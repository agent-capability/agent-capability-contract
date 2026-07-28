#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateOpenApiFile } from '../lib/openapi-validator.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const args = process.argv.slice(2);

function usage() {
  return `ACC OpenAPI authoring validator

Usage:
  acc-validate [validate] [options] <openapi-file...>

Options:
  --format <human|json>  Output format (default: human)
  --strict               Treat warnings as a failed validation
  -h, --help             Show this help
  -v, --version          Show the package version

Exit codes:
  0  Validation passed
  1  One or more documents failed validation
  2  Invalid command-line usage
`;
}

function failUsage(message) {
  if (message) process.stderr.write(`${message}\n\n`);
  process.stderr.write(usage());
  process.exit(2);
}

if (args[0] === 'validate') args.shift();
if (args.includes('--help') || args.includes('-h')) {
  process.stdout.write(usage());
  process.exit(0);
}
if (args.includes('--version') || args.includes('-v')) {
  process.stdout.write(`${packageJson.version}\n`);
  process.exit(0);
}

let format = 'human';
let strict = false;
const files = [];
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--strict') {
    strict = true;
    continue;
  }
  if (arg === '--format') {
    const value = args[index + 1];
    if (!value || !['human', 'json'].includes(value)) {
      failUsage('--format must be human or json');
    }
    format = value;
    index += 1;
    continue;
  }
  if (arg.startsWith('-')) failUsage(`Unknown option: ${arg}`);
  files.push(arg);
}

if (!files.length) failUsage('At least one OpenAPI file is required');

const reports = [];
for (const file of files) {
  reports.push(await validateOpenApiFile(file));
}

const valid = reports.every((report) => report.valid && (!strict || report.warnings === 0));
if (format === 'json') {
  process.stdout.write(`${JSON.stringify({
    tool: 'acc-validate',
    version: packageJson.version,
    valid,
    strict,
    reports,
  }, null, 2)}\n`);
} else {
  for (const report of reports) {
    const passed = report.valid && (!strict || report.warnings === 0);
    process.stdout.write(
      `${passed ? 'PASS' : 'FAIL'} ${report.file}: `
      + `${report.acc_declarations} ACC declaration(s), `
      + `${report.operations} operation(s), `
      + `${report.errors} error(s), ${report.warnings} warning(s)\n`,
    );
    for (const item of report.diagnostics) {
      process.stdout.write(
        `  ${item.severity.toUpperCase()} [${item.code}] ${item.path} ${item.message}\n`,
      );
    }
  }
}

process.exit(valid ? 0 : 1);
