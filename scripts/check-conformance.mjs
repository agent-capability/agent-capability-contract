import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';

const root = resolve(import.meta.dirname, '..');
const readJson = (relativePath) => JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'));
const declarationSchema = readJson('schemas/acc.v1.schema.json');
const vectorSchema = readJson('conformance/v1/vectors.schema.json');
const corpus = readJson('conformance/v1/vectors.json');
const packageJson = readJson('package.json');

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateCorpus = ajv.compile(vectorSchema);
const validateDeclaration = ajv.compile(declarationSchema);

if (!validateCorpus(corpus)) {
  throw new Error(`invalid conformance corpus: ${ajv.errorsText(validateCorpus.errors, { separator: '\n' })}`);
}

if (corpus.specification_release !== packageJson.version) {
  throw new Error(`conformance release ${corpus.specification_release} does not match package ${packageJson.version}`);
}

const ids = new Set();
for (const vector of corpus.vectors) {
  if (ids.has(vector.id)) throw new Error(`duplicate conformance vector id: ${vector.id}`);
  ids.add(vector.id);
}

function valueAtPath(value, path) {
  let current = value;
  for (const part of String(path).split('.').filter(Boolean)) {
    if (current === null || typeof current !== 'object') return undefined;
    current = current[part];
  }
  return current;
}

function schemaAtPath(schema, path) {
  let current = schema;
  for (const part of String(path).split('.').filter(Boolean)) {
    if (!current || typeof current !== 'object') return null;
    if (current.type === 'array' && current.items) current = current.items;
    current = current.properties?.[part];
  }
  return current && typeof current === 'object' ? current : null;
}

function sameJsonValue(left, right) {
  if (left === right) return true;
  if (left === null || right === null || typeof left !== typeof right) return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left)
      && Array.isArray(right)
      && left.length === right.length
      && left.every((value, index) => sameJsonValue(value, right[index]));
  }
  if (typeof left === 'object') {
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    return leftKeys.length === rightKeys.length
      && leftKeys.every((key, index) => key === rightKeys[index] && sameJsonValue(left[key], right[key]));
  }
  return false;
}

function conditionMatches(condition, args, parameterSchema) {
  const actual = valueAtPath(args, condition.param);
  const declared = schemaAtPath(parameterSchema, condition.param);
  if (!declared) throw new Error(`condition path has no declared schema: ${condition.param}`);

  switch (condition.op) {
    case 'exists': return actual !== undefined && actual !== null;
    case '>':
    case '>=':
    case '<':
    case '<=': {
      if (typeof actual !== 'number' || !Number.isFinite(actual) || typeof condition.value !== 'number' || !Number.isFinite(condition.value)) {
        throw new Error(`numeric condition requires finite numbers: ${condition.param}`);
      }
      if (condition.op === '>') return actual > condition.value;
      if (condition.op === '>=') return actual >= condition.value;
      if (condition.op === '<') return actual < condition.value;
      return actual <= condition.value;
    }
    case '==': return sameJsonValue(actual, condition.value);
    case '!=': return !sameJsonValue(actual, condition.value);
    case 'in': {
      if (!Array.isArray(condition.value)) throw new Error(`in condition requires an array: ${condition.param}`);
      return condition.value.some((candidate) => sameJsonValue(actual, candidate));
    }
    case 'contains': {
      if (typeof actual === 'string' && typeof condition.value === 'string') return actual.includes(condition.value);
      if (Array.isArray(actual)) return actual.some((candidate) => sameJsonValue(candidate, condition.value));
      throw new Error(`contains condition requires a string or array argument: ${condition.param}`);
    }
    default: throw new Error(`unsupported condition operator: ${condition.op}`);
  }
}

function observe(vector) {
  const { declaration } = vector.input;

  if (vector.kind === 'declaration') {
    const valid = validateDeclaration(declaration);
    if (valid) return { valid: true };
    const hasUnsupportedIntegerVersion = Number.isInteger(declaration.version)
      && declaration.version !== declarationSchema.properties.version.const;
    return {
      valid: false,
      diagnostic: hasUnsupportedIntegerVersion ? 'unsupported_version' : 'invalid_declaration',
    };
  }

  if (!validateDeclaration(declaration)) {
    throw new Error(`runtime vector contains invalid declaration: ${ajv.errorsText(validateDeclaration.errors)}`);
  }

  if (vector.kind === 'exposure') {
    const subjectRequired = declaration.subject?.required === true;
    return {
      exposed: declaration.enabled === true
        && Boolean(declaration.scope)
        && vector.input.scope_allowed === true
        && (!subjectRequired || vector.input.trusted_subject === true),
    };
  }

  if (vector.kind === 'approval') {
    const parameterSchema = vector.input.parameter_schema;
    const args = vector.input.args ?? {};
    const validateArgs = ajv.compile(parameterSchema);
    if (!validateArgs(args)) return { decision: 'reject_invalid_arguments' };

    const when = declaration.approval?.when ?? [];
    for (const condition of when) {
      if (!schemaAtPath(parameterSchema, condition.param)) {
        throw new Error(`approval condition is not declared in parameter schema: ${condition.param}`);
      }
    }

    if (declaration.approval?.required === true) return { decision: 'approval_required' };
    const matched = when.some((condition) => conditionMatches(condition, args, parameterSchema));
    return { decision: matched ? 'approval_required' : 'allow' };
  }

  if (vector.kind === 'risk-default') {
    const explicit = declaration.risk?.level;
    const readonly = declaration.execution?.readonly === true;
    const effectiveRisk = explicit || (String(vector.input.http_method).toUpperCase() === 'GET' || readonly ? 'low' : 'medium');
    return { effective_risk: effectiveRisk };
  }

  if (vector.kind === 'audit-hint') {
    return { audit_sensitive: declaration.audit?.sensitive === true };
  }

  throw new Error(`unsupported conformance vector kind: ${vector.kind}`);
}

function sameRecord(actual, expected) {
  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = Object.keys(expected).sort();
  return actualKeys.length === expectedKeys.length
    && actualKeys.every((key, index) => key === expectedKeys[index] && sameJsonValue(actual[key], expected[key]));
}

const failures = [];
for (const vector of corpus.vectors) {
  try {
    const actual = observe(vector);
    if (!sameRecord(actual, vector.expected)) {
      failures.push(`${vector.id}: expected ${JSON.stringify(vector.expected)}, got ${JSON.stringify(actual)}`);
    }
  } catch (error) {
    failures.push(`${vector.id}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`ACC v${corpus.specification_release} conformance corpus passed (${corpus.vectors.length} vectors)`);
