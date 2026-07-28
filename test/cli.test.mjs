import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cli = resolve(root, 'bin/acc-validate.mjs');

async function run(args) {
  try {
    const result = await execFileAsync(process.execPath, [cli, ...args], {
      cwd: root,
      encoding: 'utf8',
    });
    return { ...result, code: 0 };
  } catch (error) {
    return {
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr,
    };
  }
}

test('human output passes for the order service example', async () => {
  const result = await run(['examples/openapi-order-service.yaml']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /^PASS /);
  assert.match(result.stdout, /4 ACC declaration\(s\)/);
});

test('JSON output is machine-readable', async () => {
  const result = await run([
    '--format',
    'json',
    'examples/openapi-order-service.yaml',
  ]);
  const output = JSON.parse(result.stdout);

  assert.equal(result.code, 0);
  assert.equal(output.tool, 'acc-validate');
  assert.equal(output.valid, true);
  assert.equal(output.reports[0].acc_declarations, 4);
});

test('strict mode turns a missing-declaration warning into failure', async () => {
  const result = await run(['--strict', 'test/fixtures/openapi-no-acc.yaml']);

  assert.equal(result.code, 1);
  assert.match(result.stdout, /^FAIL /);
  assert.match(result.stdout, /acc_declaration_missing/);
});

test('invalid usage exits with code 2', async () => {
  const result = await run(['--unknown']);

  assert.equal(result.code, 2);
  assert.match(result.stderr, /Unknown option/);
});
