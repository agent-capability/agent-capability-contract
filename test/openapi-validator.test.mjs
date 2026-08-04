import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateOpenApiFile } from '../lib/openapi-validator.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function writeFixture(contents, name = 'openapi.yaml') {
  const directory = await mkdtemp(join(tmpdir(), 'acc-validator-'));
  const file = join(directory, name);
  await writeFile(file, contents, 'utf8');
  return { directory, file };
}

function declaration(overrides = '') {
  return `      x-agent-capability:
        version: 1
        enabled: true
        scope: order.read
${overrides}`;
}

test('validates the multi-operation order service example', async () => {
  const report = await validateOpenApiFile(
    resolve(root, 'examples/openapi-order-service.yaml'),
  );

  assert.equal(report.valid, true);
  assert.equal(report.operations, 4);
  assert.equal(report.acc_declarations, 4);
  assert.equal(report.errors, 0);
});

test('rejects an invalid ACC declaration', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /orders:
    get:
      x-agent-capability:
        version: 1
        enabled: true
      responses:
        '200':
          description: ok
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(report.diagnostics.some((item) => item.code === 'invalid_acc_declaration'));
});

test('reports an unsupported ACC major separately', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /orders:
    get:
      x-agent-capability:
        version: 2
        enabled: true
        scope: order.read
      responses:
        '200':
          description: ok
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(report.diagnostics.some((item) => item.code === 'unsupported_acc_version'));
});

test('rejects an approval condition that targets no operation input', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /refunds:
    post:
${declaration(`        approval:
          required: true
          when:
            - param: amount
              op: '>'
              value: 1000
`)}      responses:
        '202':
          description: accepted
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(
    report.diagnostics.some((item) => item.code === 'approval_condition_target_missing'),
  );
});

test('rejects ambiguous normalized parameter and body names', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /refunds:
    post:
      parameters:
        - name: amount
          in: query
          schema:
            type: number
${declaration(`        approval:
          required: true
          when:
            - param: amount
              op: '>'
              value: 1000
`)}      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                amount:
                  type: number
      responses:
        '202':
          description: accepted
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(
    report.diagnostics.some((item) => item.code === 'approval_condition_target_ambiguous'),
  );
});

test('enforces strict condition value types', async () => {
  const { file } = await writeFixture(`openapi: 3.0.3
paths:
  /refunds:
    post:
${declaration(`        approval:
          required: true
          when:
            - param: amount
              op: '>'
              value: '1000'
`)}      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                amount:
                  type: number
      responses:
        '202':
          description: accepted
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(
    report.diagnostics.some((item) => item.code === 'approval_condition_value_invalid'),
  );
});

test('requires an array comparison value for the in operator', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /cases:
    post:
${declaration(`        approval:
          when:
            - param: team
              op: in
              value: finance
`)}      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                team:
                  type: string
      responses:
        '202':
          description: accepted
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(
    report.diagnostics.some((item) => item.code === 'approval_condition_value_invalid'),
  );
});

test('requires a string comparison value for string contains', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /messages:
    post:
${declaration(`        approval:
          when:
            - param: message
              op: contains
              value: 1
`)}      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
      responses:
        '202':
          description: accepted
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(
    report.diagnostics.some(
      (item) => item.code === 'approval_condition_value_type_mismatch',
    ),
  );
});

test('resolves local file references', async () => {
  const { directory, file } = await writeFixture(`openapi: 3.1.0
paths:
  /refunds:
    post:
${declaration(`        approval:
          required: true
          when:
            - param: amount
              op: '>'
              value: 1000
`)}      requestBody:
        content:
          application/json:
            schema:
              $ref: './schemas.yaml#/CreateRefundInput'
      responses:
        '202':
          description: accepted
`);
  await writeFile(
    join(directory, 'schemas.yaml'),
    `CreateRefundInput:
  type: object
  properties:
    amount:
      type: number
`,
    'utf8',
  );

  const report = await validateOpenApiFile(file);
  assert.equal(report.valid, true);
});

test('resolves references relative to an external path item file', async () => {
  const { directory, file } = await writeFixture(`openapi: 3.1.0
paths:
  /refunds:
    $ref: './paths/refunds.yaml'
`);
  await writeFile(
    join(directory, 'schemas.yaml'),
    `CreateRefundInput:
  type: object
  properties:
    amount:
      type: number
`,
    'utf8',
  );
  const pathsDirectory = join(directory, 'paths');
  await mkdir(pathsDirectory);
  await writeFile(
    join(pathsDirectory, 'refunds.yaml'),
    `post:
  x-agent-capability:
    version: 1
    enabled: true
    scope: refund.create
    approval:
      when:
        - param: amount
          op: '>'
          value: 1000
  requestBody:
    content:
      application/json:
        schema:
          $ref: '../schemas.yaml#/CreateRefundInput'
  responses:
    '202':
      description: accepted
`,
    'utf8',
  );

  const report = await validateOpenApiFile(file);
  assert.equal(report.valid, true);
});

test('allows exists against a declared input without an explicit schema type', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /orders:
    get:
${declaration(`        approval:
          when:
            - param: filter
              op: exists
`)}      parameters:
        - name: filter
          in: query
          schema: {}
      responses:
        '200':
          description: ok
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, true);
});

test('allows strict equality with null when the schema permits null', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /orders:
    get:
${declaration(`        approval:
          when:
            - param: status
              op: '=='
              value: null
`)}      parameters:
        - name: status
          in: query
          schema:
            type:
              - string
              - 'null'
      responses:
        '200':
          description: ok
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, true);
});

test('handles recursive allOf schemas without unbounded traversal', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /refunds:
    post:
${declaration(`        approval:
          when:
            - param: amount
              op: '>'
              value: 1000
`)}      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RecursiveRefund'
      responses:
        '202':
          description: accepted
components:
  schemas:
    RecursiveRefund:
      type: object
      properties:
        amount:
          type: number
      allOf:
        - $ref: '#/components/schemas/RecursiveRefund'
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, true);
});

test('does not fetch remote references', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /orders:
    get:
${declaration()}      parameters:
        - $ref: https://example.com/parameters.yaml#/OrderId
      responses:
        '200':
          description: ok
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(
    report.diagnostics.some((item) => item.code === 'remote_reference_unsupported'),
  );
});

test('rejects x-agent-capability on a path item', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /orders:
    x-agent-capability:
      version: 1
      enabled: true
      scope: order.read
    get:
      responses:
        '200':
          description: ok
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, false);
  assert.ok(report.diagnostics.some((item) => item.code === 'acc_extension_misplaced'));
});

test('warns when a valid OpenAPI document has no ACC declarations', async () => {
  const { file } = await writeFixture(`openapi: 3.1.0
paths:
  /health:
    get:
      responses:
        '200':
          description: ok
`);
  const report = await validateOpenApiFile(file);

  assert.equal(report.valid, true);
  assert.equal(report.warnings, 1);
  assert.ok(report.diagnostics.some((item) => item.code === 'acc_declaration_missing'));
});
