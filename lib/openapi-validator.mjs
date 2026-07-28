import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { parseDocument } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const declarationSchema = JSON.parse(
  await readFile(resolve(root, 'schemas/acc.v1.schema.json'), 'utf8'),
);
const supportedMajor = declarationSchema.properties.version.const;
const httpMethods = new Set([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
]);

const ajv = new Ajv2020({
  allErrors: true,
  allowUnionTypes: true,
  strict: false,
});
const validateDeclaration = ajv.compile(declarationSchema);

class ValidationFailure extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

class DocumentStore {
  constructor() {
    this.documents = new Map();
  }

  async load(filePath) {
    const absolutePath = resolve(filePath);
    if (this.documents.has(absolutePath)) return this.documents.get(absolutePath);

    let source;
    try {
      source = await readFile(absolutePath, 'utf8');
    } catch (error) {
      throw new ValidationFailure(
        'document_read_failed',
        `Cannot read ${absolutePath}: ${error.message}`,
      );
    }

    let value;
    try {
      if (extname(absolutePath).toLowerCase() === '.json') {
        value = JSON.parse(source);
      } else {
        const document = parseDocument(source, {
          merge: false,
          prettyErrors: false,
          uniqueKeys: true,
        });
        if (document.errors.length) {
          throw new Error(document.errors.map((error) => error.message).join('; '));
        }
        value = document.toJS({ maxAliasCount: 100 });
      }
    } catch (error) {
      throw new ValidationFailure(
        'document_parse_failed',
        `Cannot parse ${absolutePath}: ${error.message}`,
      );
    }

    if (!isRecord(value)) {
      throw new ValidationFailure(
        'document_root_invalid',
        `${absolutePath} must contain an object at the document root`,
      );
    }

    const loaded = { filePath: absolutePath, value };
    this.documents.set(absolutePath, loaded);
    return loaded;
  }

  async resolveReference(reference, fromFile) {
    if (typeof reference !== 'string' || reference.length === 0) {
      throw new ValidationFailure('reference_invalid', 'A $ref value must be a non-empty string');
    }

    if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(reference)) {
      throw new ValidationFailure(
        'remote_reference_unsupported',
        `Remote or URL-based $ref values are not fetched: ${reference}`,
      );
    }

    const hashIndex = reference.indexOf('#');
    const filePart = hashIndex === -1 ? reference : reference.slice(0, hashIndex);
    const fragment = hashIndex === -1 ? '' : reference.slice(hashIndex + 1);
    let decodedFilePart;
    try {
      decodedFilePart = decodeURIComponent(filePart);
    } catch {
      throw new ValidationFailure('reference_invalid', `Invalid URI encoding in $ref: ${reference}`);
    }

    const targetPath = decodedFilePart
      ? resolve(dirname(fromFile), decodedFilePart)
      : resolve(fromFile);
    const target = await this.load(targetPath);
    const pointerParts = decodePointer(fragment, reference);
    let current = target.value;

    for (const part of pointerParts) {
      if (!isRecord(current) && !Array.isArray(current)) {
        throw new ValidationFailure(
          'reference_unresolved',
          `Cannot resolve $ref ${reference}: ${part} is not reachable`,
        );
      }
      if (!Object.prototype.hasOwnProperty.call(current, part)) {
        throw new ValidationFailure(
          'reference_unresolved',
          `Cannot resolve $ref ${reference}: ${part} does not exist`,
        );
      }
      current = current[part];
    }

    return {
      filePath: target.filePath,
      pointer: pointerParts,
      value: current,
    };
  }

  async dereference(node, trail = new Set()) {
    if (!isRecord(node.value) || typeof node.value.$ref !== 'string') return node;

    const referenceKey = `${node.filePath}::${node.value.$ref}`;
    if (trail.has(referenceKey)) {
      throw new ValidationFailure(
        'reference_cycle',
        `Circular $ref encountered while resolving ${node.value.$ref}`,
      );
    }

    const nextTrail = new Set(trail);
    nextTrail.add(referenceKey);
    const resolved = await this.resolveReference(node.value.$ref, node.filePath);
    const dereferenced = await this.dereference(resolved, nextTrail);
    const siblings = Object.fromEntries(
      Object.entries(node.value).filter(([key]) => key !== '$ref'),
    );

    if (!Object.keys(siblings).length || !isRecord(dereferenced.value)) {
      return dereferenced;
    }

    return {
      ...dereferenced,
      value: {
        ...dereferenced.value,
        ...siblings,
      },
    };
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function escapePointerPart(value) {
  return String(value).replaceAll('~', '~0').replaceAll('/', '~1');
}

function pointer(parts) {
  return `#/${parts.map(escapePointerPart).join('/')}`;
}

function decodePointer(fragment, reference) {
  if (fragment === '') return [];
  if (!fragment.startsWith('/')) {
    throw new ValidationFailure(
      'reference_anchor_unsupported',
      `Only JSON Pointer fragments are supported in $ref values: ${reference}`,
    );
  }

  return fragment
    .slice(1)
    .split('/')
    .map((part) => {
      let decoded;
      try {
        decoded = decodeURIComponent(part);
      } catch {
        throw new ValidationFailure(
          'reference_invalid',
          `Invalid URI encoding in $ref: ${reference}`,
        );
      }
      return decoded.replaceAll('~1', '/').replaceAll('~0', '~');
    });
}

function diagnostic(severity, code, message, file, path = '#') {
  return {
    severity,
    code,
    message,
    file,
    path,
  };
}

function jsonType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  return typeof value;
}

function typeAccepts(types, value) {
  const actual = jsonType(value);
  if (actual === 'integer') return types.has('integer') || types.has('number');
  return types.has(actual);
}

function intersectTypes(left, right) {
  const result = new Set();
  for (const type of left) {
    if (right.has(type)) result.add(type);
    if (type === 'integer' && right.has('number')) result.add('integer');
    if (type === 'number' && right.has('integer')) result.add('integer');
  }
  return result;
}

function beginSchemaVisit(resolved, visited) {
  const key = Array.isArray(resolved.pointer)
    ? `${resolved.filePath}#/${resolved.pointer.map(escapePointerPart).join('/')}`
    : resolved.value;
  if (visited.has(key)) return null;
  const next = new Set(visited);
  next.add(key);
  return next;
}

async function inferTypes(node, store, visited = new Set()) {
  const resolved = await store.dereference(node);
  const nextVisited = beginSchemaVisit(resolved, visited);
  if (nextVisited === null) return null;
  const schema = resolved.value;
  if (schema === true) return null;
  if (schema === false) return new Set();
  if (!isRecord(schema)) return null;

  let types = null;
  if (typeof schema.type === 'string') {
    types = new Set([schema.type]);
  } else if (Array.isArray(schema.type) && schema.type.every((type) => typeof type === 'string')) {
    types = new Set(schema.type);
  } else if (Object.prototype.hasOwnProperty.call(schema, 'const')) {
    types = new Set([jsonType(schema.const)]);
  } else if (Array.isArray(schema.enum) && schema.enum.length) {
    types = new Set(schema.enum.map(jsonType));
  } else if (isRecord(schema.properties)) {
    types = new Set(['object']);
  } else if (Object.prototype.hasOwnProperty.call(schema, 'items')) {
    types = new Set(['array']);
  }

  if (schema.nullable === true) {
    types ??= new Set();
    types.add('null');
  }

  if (Array.isArray(schema.allOf) && schema.allOf.length) {
    let combined = types;
    for (const branch of schema.allOf) {
      const branchTypes = await inferTypes(
        { value: branch, filePath: resolved.filePath },
        store,
        nextVisited,
      );
      if (branchTypes === null) continue;
      combined = combined === null ? branchTypes : intersectTypes(combined, branchTypes);
    }
    types = combined;
  }

  for (const keyword of ['oneOf', 'anyOf']) {
    if (!Array.isArray(schema[keyword]) || !schema[keyword].length) continue;
    const combined = new Set(types ?? []);
    let knownBranches = 0;
    for (const branch of schema[keyword]) {
      const branchTypes = await inferTypes(
        { value: branch, filePath: resolved.filePath },
        store,
        nextVisited,
      );
      if (branchTypes === null) continue;
      knownBranches += 1;
      for (const type of branchTypes) combined.add(type);
    }
    if (knownBranches) types = combined;
  }

  return types;
}

async function propertyNodes(node, propertyName, store, visited = new Set()) {
  const resolved = await store.dereference(node);
  const nextVisited = beginSchemaVisit(resolved, visited);
  if (nextVisited === null) return [];
  const schema = resolved.value;
  if (!isRecord(schema)) return [];

  const matches = [];
  if (
    isRecord(schema.properties)
    && Object.prototype.hasOwnProperty.call(schema.properties, propertyName)
  ) {
    matches.push({
      filePath: resolved.filePath,
      value: schema.properties[propertyName],
    });
  }

  if (Array.isArray(schema.allOf)) {
    for (const branch of schema.allOf) {
      matches.push(
        ...await propertyNodes(
          { filePath: resolved.filePath, value: branch },
          propertyName,
          store,
          nextVisited,
        ),
      );
    }
  }

  return matches;
}

async function objectProperties(node, store, visited = new Set()) {
  const resolved = await store.dereference(node);
  const nextVisited = beginSchemaVisit(resolved, visited);
  if (nextVisited === null) return new Map();
  const schema = resolved.value;
  if (!isRecord(schema)) return new Map();

  const result = new Map();
  const add = (name, propertyNode) => {
    const current = result.get(name) ?? [];
    current.push(propertyNode);
    result.set(name, current);
  };

  if (isRecord(schema.properties)) {
    for (const [name, propertySchema] of Object.entries(schema.properties)) {
      add(name, {
        filePath: resolved.filePath,
        value: propertySchema,
      });
    }
  }

  if (Array.isArray(schema.allOf)) {
    for (const branch of schema.allOf) {
      const branchProperties = await objectProperties(
        { filePath: resolved.filePath, value: branch },
        store,
        nextVisited,
      );
      for (const [name, nodes] of branchProperties) {
        for (const propertyNode of nodes) add(name, propertyNode);
      }
    }
  }

  return result;
}

function addInputCandidate(index, name, origin, nodes) {
  if (!name || !nodes.length) return;
  const origins = index.get(name) ?? new Map();
  const existing = origins.get(origin) ?? [];
  origins.set(origin, [...existing, ...nodes]);
  index.set(name, origins);
}

async function parameterSchema(parameterNode, store) {
  const parameter = await store.dereference(parameterNode);
  if (!isRecord(parameter.value)) {
    throw new ValidationFailure('parameter_invalid', 'A parameter must resolve to an object');
  }

  if (parameter.value.schema !== undefined) {
    return {
      filePath: parameter.filePath,
      value: parameter.value.schema,
    };
  }

  if (isRecord(parameter.value.content)) {
    const jsonEntry = selectJsonContent(parameter.value.content);
    if (jsonEntry?.schema !== undefined) {
      return {
        filePath: parameter.filePath,
        value: jsonEntry.schema,
      };
    }
  }

  throw new ValidationFailure(
    'input_schema_missing',
    `Parameter ${parameter.value.name ?? '(unnamed)'} has no schema`,
  );
}

function selectJsonContent(content) {
  if (!isRecord(content)) return null;
  if (isRecord(content['application/json'])) return content['application/json'];
  const matches = Object.entries(content)
    .filter(([mediaType, media]) => mediaType.toLowerCase().endsWith('+json') && isRecord(media))
    .map(([, media]) => media);
  return matches.length === 1 ? matches[0] : null;
}

async function buildInputIndex({
  diagnosticFilePath,
  operationFilePath,
  operation,
  operationPath,
  pathItemFilePath,
  pathItem,
  pathItemPath,
  store,
  diagnostics,
}) {
  const index = new Map();
  const parameters = new Map();

  const collectParameters = async (items, basePath, nodeFilePath) => {
    if (items === undefined) return;
    if (!Array.isArray(items)) {
      diagnostics.push(
        diagnostic(
          'error',
          'parameters_invalid',
          'OpenAPI parameters must be an array',
          diagnosticFilePath,
          pointer(basePath),
        ),
      );
      return;
    }

    for (const [indexValue, value] of items.entries()) {
      const itemPath = [...basePath, indexValue];
      try {
        const resolved = await store.dereference({ filePath: nodeFilePath, value });
        if (!isRecord(resolved.value)) {
          throw new ValidationFailure('parameter_invalid', 'A parameter must resolve to an object');
        }
        const name = resolved.value.name;
        const location = resolved.value.in;
        if (typeof name !== 'string' || typeof location !== 'string') {
          throw new ValidationFailure(
            'parameter_identity_missing',
            'A parameter must declare string name and in fields',
          );
        }
        parameters.set(`${location}:${name}`, {
          node: resolved,
          sourcePath: itemPath,
        });
      } catch (error) {
        diagnostics.push(
          diagnostic(
            'error',
            error.code ?? 'parameter_resolution_failed',
            error.message,
            diagnosticFilePath,
            pointer(itemPath),
          ),
        );
      }
    }
  };

  await collectParameters(
    pathItem.parameters,
    [...pathItemPath, 'parameters'],
    pathItemFilePath,
  );
  await collectParameters(
    operation.parameters,
    [...operationPath, 'parameters'],
    operationFilePath,
  );

  for (const [identity, entry] of parameters) {
    const parameter = entry.node.value;
    try {
      const schemaNode = await parameterSchema(entry.node, store);
      addInputCandidate(index, parameter.name, `parameter:${identity}`, [schemaNode]);
    } catch (error) {
      diagnostics.push(
        diagnostic(
          'error',
          error.code ?? 'input_schema_resolution_failed',
          error.message,
          diagnosticFilePath,
          pointer(entry.sourcePath),
        ),
      );
    }
  }

  if (operation.requestBody !== undefined) {
    const requestBodyPath = [...operationPath, 'requestBody'];
    try {
      const requestBody = await store.dereference({
        filePath: operationFilePath,
        value: operation.requestBody,
      });
      if (!isRecord(requestBody.value) || !isRecord(requestBody.value.content)) {
        throw new ValidationFailure(
          'request_body_schema_missing',
          'requestBody must provide a content object with a JSON schema',
        );
      }
      const media = selectJsonContent(requestBody.value.content);
      if (!media || media.schema === undefined) {
        throw new ValidationFailure(
          'request_body_media_type_unsupported',
          'The authoring validator resolves request-body inputs from application/json or one application/*+json schema',
        );
      }
      const bodyProperties = await objectProperties(
        { filePath: requestBody.filePath, value: media.schema },
        store,
      );
      if (!bodyProperties.size) {
        throw new ValidationFailure(
          'request_body_object_required',
          'A governed request body must expose object properties for deterministic input mapping',
        );
      }
      for (const [name, nodes] of bodyProperties) {
        addInputCandidate(index, name, `request-body:${name}`, nodes);
      }
    } catch (error) {
      diagnostics.push(
        diagnostic(
          'error',
          error.code ?? 'request_body_resolution_failed',
          error.message,
          diagnosticFilePath,
          pointer(requestBodyPath),
        ),
      );
    }
  }

  return index;
}

async function resolveConditionTarget(param, inputIndex, store) {
  const parts = String(param).split('.');
  if (parts.some((part) => part.length === 0)) {
    throw new ValidationFailure(
      'approval_condition_path_invalid',
      `Condition path ${param} contains an empty segment`,
    );
  }

  const origins = inputIndex.get(parts[0]);
  if (!origins) {
    throw new ValidationFailure(
      'approval_condition_target_missing',
      `Condition path ${param} does not resolve to a declared operation input`,
    );
  }
  if (origins.size > 1) {
    throw new ValidationFailure(
      'approval_condition_target_ambiguous',
      `Condition path ${param} matches multiple normalized inputs: ${[...origins.keys()].join(', ')}`,
    );
  }

  let nodes = [...origins.values()][0];
  for (const part of parts.slice(1)) {
    const next = [];
    for (const node of nodes) {
      next.push(...await propertyNodes(node, part, store));
    }
    if (!next.length) {
      throw new ValidationFailure(
        'approval_condition_target_missing',
        `Condition path ${param} does not resolve at nested property ${part}`,
      );
    }
    nodes = next;
  }

  return nodes;
}

async function combinedTypes(nodes, store) {
  let result = null;
  for (const node of nodes) {
    const types = await inferTypes(node, store);
    if (types === null) continue;
    result = result === null ? types : intersectTypes(result, types);
  }
  return result;
}

async function validateCondition(condition, targetNodes, store) {
  const op = condition.op;
  const hasValue = Object.prototype.hasOwnProperty.call(condition, 'value');
  if (op !== 'exists' && !hasValue) {
    throw new ValidationFailure(
      'approval_condition_value_missing',
      `Operator ${op} requires a value`,
    );
  }
  if (op === 'exists') return;

  const inferred = await combinedTypes(targetNodes, store);
  if (inferred === null || inferred.size === 0) {
    throw new ValidationFailure(
      'approval_condition_schema_unsupported',
      `Cannot determine a stable JSON type for condition path ${condition.param}`,
    );
  }
  const types = new Set(inferred);
  const nonNullTypes = new Set([...types].filter((type) => type !== 'null'));

  if (['>', '>=', '<', '<='].includes(op)) {
    if (
      nonNullTypes.size === 0
      || ![...nonNullTypes].every((type) => type === 'number' || type === 'integer')
    ) {
      throw new ValidationFailure(
        'approval_condition_type_mismatch',
        `Operator ${op} requires a number or integer input, found ${[...types].join(' | ')}`,
      );
    }
    if (typeof condition.value !== 'number' || !Number.isFinite(condition.value)) {
      throw new ValidationFailure(
        'approval_condition_value_invalid',
        `Operator ${op} requires a finite numeric value`,
      );
    }
    return;
  }

  if (op === 'in') {
    if (!Array.isArray(condition.value)) {
      throw new ValidationFailure(
        'approval_condition_value_invalid',
        'Operator in requires an array value',
      );
    }
    const invalid = condition.value.find((value) => !typeAccepts(types, value));
    if (invalid !== undefined) {
      throw new ValidationFailure(
        'approval_condition_value_type_mismatch',
        `Operator in contains ${jsonType(invalid)}, incompatible with ${[...types].join(' | ')}`,
      );
    }
    return;
  }

  if (op === 'contains') {
    if (
      nonNullTypes.size !== 1
      || (!nonNullTypes.has('string') && !nonNullTypes.has('array'))
    ) {
      throw new ValidationFailure(
        'approval_condition_type_mismatch',
        `Operator contains requires one stable string or array input type, found ${[...types].join(' | ')}`,
      );
    }
    if (nonNullTypes.has('string') && typeof condition.value !== 'string') {
      throw new ValidationFailure(
        'approval_condition_value_type_mismatch',
        'String containment requires a string value',
      );
    }
    if (nonNullTypes.has('array')) {
      const itemNodes = [];
      for (const node of targetNodes) {
        const resolved = await store.dereference(node);
        if (isRecord(resolved.value) && resolved.value.items !== undefined) {
          itemNodes.push({
            filePath: resolved.filePath,
            value: resolved.value.items,
          });
        }
      }
      const itemTypes = itemNodes.length ? await combinedTypes(itemNodes, store) : null;
      if (
        itemTypes
        && itemTypes.size
        && !typeAccepts(itemTypes, condition.value)
      ) {
        throw new ValidationFailure(
          'approval_condition_value_type_mismatch',
          `Array containment value ${jsonType(condition.value)} is incompatible with the item schema`,
        );
      }
    }
    return;
  }

  if (op === '==' || op === '!=') {
    if (!typeAccepts(types, condition.value)) {
      throw new ValidationFailure(
        'approval_condition_value_type_mismatch',
        `Operator ${op} value ${jsonType(condition.value)} is incompatible with ${[...types].join(' | ')}`,
      );
    }
  }
}

function appendDeclarationDiagnostics({
  declaration,
  diagnostics,
  filePath,
  operationPath,
}) {
  if (Number.isInteger(declaration?.version) && declaration.version !== supportedMajor) {
    diagnostics.push(
      diagnostic(
        'error',
        'unsupported_acc_version',
        `ACC major version ${declaration.version} is unsupported; this validator supports ${supportedMajor}`,
        filePath,
        pointer([...operationPath, 'x-agent-capability', 'version']),
      ),
    );
    return false;
  }

  if (validateDeclaration(declaration)) return true;

  for (const error of validateDeclaration.errors ?? []) {
    const suffix = error.instancePath
      .split('/')
      .filter(Boolean)
      .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'));
    diagnostics.push(
      diagnostic(
        'error',
        'invalid_acc_declaration',
        `${error.instancePath || '/'} ${error.message}`,
        filePath,
        pointer([...operationPath, 'x-agent-capability', ...suffix]),
      ),
    );
  }
  return false;
}

async function validateOperation({
  filePath,
  operationFilePath,
  operation,
  operationPath,
  pathItemFilePath,
  pathItem,
  pathItemPath,
  store,
  diagnostics,
}) {
  const declaration = operation['x-agent-capability'];
  if (declaration === undefined) return false;

  const validDeclaration = appendDeclarationDiagnostics({
    declaration,
    diagnostics,
    filePath,
    operationPath,
  });
  if (!validDeclaration) return true;

  const inputIndex = await buildInputIndex({
    diagnosticFilePath: filePath,
    operationFilePath,
    operation,
    operationPath,
    pathItemFilePath,
    pathItem,
    pathItemPath,
    store,
    diagnostics,
  });

  const conditions = declaration.approval?.when ?? [];
  for (const [conditionIndex, condition] of conditions.entries()) {
    const conditionPath = [
      ...operationPath,
      'x-agent-capability',
      'approval',
      'when',
      conditionIndex,
    ];
    try {
      const targetNodes = await resolveConditionTarget(condition.param, inputIndex, store);
      await validateCondition(condition, targetNodes, store);
    } catch (error) {
      diagnostics.push(
        diagnostic(
          'error',
          error.code ?? 'approval_condition_invalid',
          error.message,
          filePath,
          pointer(conditionPath),
        ),
      );
    }
  }

  return true;
}

export async function validateOpenApiFile(filePath, options = {}) {
  const absolutePath = resolve(filePath);
  const store = options.store ?? new DocumentStore();
  const diagnostics = [];
  let rootDocument;

  try {
    rootDocument = await store.load(absolutePath);
  } catch (error) {
    diagnostics.push(
      diagnostic(
        'error',
        error.code ?? 'document_load_failed',
        error.message,
        absolutePath,
      ),
    );
    return buildReport(absolutePath, null, 0, 0, diagnostics);
  }

  const document = rootDocument.value;
  const openapiVersion = typeof document.openapi === 'string' ? document.openapi : null;
  if (!openapiVersion || !/^3\.(0|1)\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?$/.test(openapiVersion)) {
    diagnostics.push(
      diagnostic(
        'error',
        'openapi_version_unsupported',
        'Supported OpenAPI versions are 3.0.x and 3.1.x',
        absolutePath,
        '#/openapi',
      ),
    );
  }

  if (document['x-agent-capability'] !== undefined) {
    diagnostics.push(
      diagnostic(
        'error',
        'acc_extension_misplaced',
        'x-agent-capability must be placed on an OpenAPI operation object, not the document root',
        absolutePath,
        '#/x-agent-capability',
      ),
    );
  }

  if (!isRecord(document.paths)) {
    diagnostics.push(
      diagnostic(
        'error',
        'openapi_paths_missing',
        'The OpenAPI document must provide a paths object',
        absolutePath,
        '#/paths',
      ),
    );
    return buildReport(absolutePath, openapiVersion, 0, 0, diagnostics);
  }

  let operationCount = 0;
  let declarationCount = 0;
  for (const pathName of Object.keys(document.paths).sort()) {
    const pathItemPath = ['paths', pathName];
    let pathItem;
    let pathItemFilePath = absolutePath;
    try {
      const resolvedPathItem = await store.dereference({
        filePath: absolutePath,
        value: document.paths[pathName],
      });
      pathItem = resolvedPathItem.value;
      pathItemFilePath = resolvedPathItem.filePath;
    } catch (error) {
      diagnostics.push(
        diagnostic(
          'error',
          error.code ?? 'path_item_resolution_failed',
          error.message,
          absolutePath,
          pointer(pathItemPath),
        ),
      );
      continue;
    }

    if (!isRecord(pathItem)) {
      diagnostics.push(
        diagnostic(
          'error',
          'path_item_invalid',
          `Path item ${pathName} must resolve to an object`,
          absolutePath,
          pointer(pathItemPath),
        ),
      );
      continue;
    }

    if (pathItem['x-agent-capability'] !== undefined) {
      diagnostics.push(
        diagnostic(
          'error',
          'acc_extension_misplaced',
          'x-agent-capability must be placed on an operation object, not a path item',
          absolutePath,
          pointer([...pathItemPath, 'x-agent-capability']),
        ),
      );
    }

    for (const method of [...httpMethods].sort()) {
      if (pathItem[method] === undefined) continue;
      operationCount += 1;
      const operationPath = [...pathItemPath, method];
      let operation;
      let operationFilePath = pathItemFilePath;
      try {
        const resolvedOperation = await store.dereference({
          filePath: pathItemFilePath,
          value: pathItem[method],
        });
        operation = resolvedOperation.value;
        operationFilePath = resolvedOperation.filePath;
      } catch (error) {
        diagnostics.push(
          diagnostic(
            'error',
            error.code ?? 'operation_resolution_failed',
            error.message,
            absolutePath,
            pointer(operationPath),
          ),
        );
        continue;
      }

      if (!isRecord(operation)) {
        diagnostics.push(
          diagnostic(
            'error',
            'operation_invalid',
            `${method.toUpperCase()} ${pathName} must resolve to an operation object`,
            absolutePath,
            pointer(operationPath),
          ),
        );
        continue;
      }

      if (await validateOperation({
        filePath: absolutePath,
        operationFilePath,
        operation,
        operationPath,
        pathItemFilePath,
        pathItem,
        pathItemPath,
        store,
        diagnostics,
      })) {
        declarationCount += 1;
      }
    }
  }

  if (declarationCount === 0) {
    diagnostics.push(
      diagnostic(
        'warning',
        'acc_declaration_missing',
        'No operation-level x-agent-capability declarations were found',
        absolutePath,
        '#/paths',
      ),
    );
  }

  return buildReport(
    absolutePath,
    openapiVersion,
    operationCount,
    declarationCount,
    diagnostics,
  );
}

function buildReport(file, openapiVersion, operationCount, declarationCount, diagnostics) {
  const errorCount = diagnostics.filter((item) => item.severity === 'error').length;
  const warningCount = diagnostics.filter((item) => item.severity === 'warning').length;
  return {
    valid: errorCount === 0,
    file,
    openapi_version: openapiVersion,
    operations: operationCount,
    acc_declarations: declarationCount,
    errors: errorCount,
    warnings: warningCount,
    diagnostics,
  };
}
