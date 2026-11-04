import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const execFileAsync = promisify(execFile);
const corpus = JSON.parse(await readFile(resolve(root, 'conformance/v1/vectors.json'), 'utf8'));

// SPEC §4.4 and the OpenAPI binding's risk-default precedence, written as a
// truth table rather than repeating the reference checker's inference logic.
// Columns: omitted risk.level, explicit low, explicit medium, explicit high.
const riskLevels = [undefined, 'low', 'medium', 'high'];
const cases = [
  ['GET', undefined, ['low', 'low', 'medium', 'high']],
  ['GET', false, ['medium', 'low', 'medium', 'high']],
  ['GET', true, ['low', 'low', 'medium', 'high']],
  ['POST', undefined, ['medium', 'low', 'medium', 'high']],
  ['POST', false, ['medium', 'low', 'medium', 'high']],
  ['POST', true, ['low', 'low', 'medium', 'high']],
];

test('risk corpus covers explicit risk, readonly and OpenAPI method precedence', () => {
  const riskVectors = corpus.vectors.filter((vector) => vector.kind === 'risk-default');

  for (const [method, readonly, expectedRisks] of cases) {
    for (const [index, risk] of riskLevels.entries()) {
      const label = `${method}; readonly=${readonly}; risk=${risk}`;
      const matches = riskVectors.filter((vector) => (
        vector.input.http_method === method
        && vector.input.declaration.execution?.readonly === readonly
        && vector.input.declaration.risk?.level === risk
      ));
      assert.equal(matches.length, 1, `Missing or duplicate precedence case: ${label}`);
      assert.deepEqual(matches[0].expected, { effective_risk: expectedRisks[index] }, label);
    }
  }
});

test('the actual reference checker accepts the complete risk precedence corpus', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['scripts/check-conformance.mjs'], {
    cwd: root,
    encoding: 'utf8',
  });

  assert.ok(stdout.includes(`conformance corpus passed (${corpus.vectors.length} vectors)`));
});
