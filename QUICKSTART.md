# Add ACC to an Existing OpenAPI Service in Five Minutes

This guide adds one ACC declaration to an existing OpenAPI document and validates
the result. It does not require an ACC runtime or a business-system change.

The authoring validator is non-normative. The ACC specification and OpenAPI
binding remain authoritative.

## 1. Install the authoring validator

Run the published validator without installing it globally:

```bash
npx --yes agent-capability-contract@1.0.4 validate ./openapi.yaml
```

Or add the validator to a project:

```bash
npm install --save-dev agent-capability-contract@1.0.4
```

The package requires Node.js 20 or later.

## 2. Declare one existing operation

Find one operation in your OpenAPI document. A readonly operation is a useful
first candidate:

```yaml
paths:
  /orders/{order_id}:
    get:
      operationId: getOrder
      x-agent-capability:
        version: 1
        enabled: true
        scope: order.read
        risk:
          level: low
        subject:
          required: true
        execution:
          readonly: true
      responses:
        '200':
          description: Order details
```

The declaration says that this operation is explicitly exposed to an agent
surface, belongs to the `order.read` scope, is classified as low risk, requires
a trusted acting subject, and is readonly.

It does not grant the subject permission to read an order. The business system
still makes the final authorization decision.

Use `enabled: false` when you want to preserve a declaration without exposing
the operation to agents.

## 3. Validate your OpenAPI document

Run the validator:

```bash
npx acc-validate /absolute/path/to/openapi.yaml
```

Use JSON output in CI or another developer tool:

```bash
npx acc-validate \
  --format json \
  /absolute/path/to/openapi.yaml
```

Use strict mode when a document with no ACC declarations should fail:

```bash
npx acc-validate \
  --strict \
  /absolute/path/to/openapi.yaml
```

Exit codes are stable:

| Code | Meaning |
|---|---|
| `0` | Validation passed |
| `1` | At least one document failed, or strict mode promoted a warning |
| `2` | Invalid command-line usage |

## 4. Add conditional approval only when the input is declared

An approval condition must resolve to an OpenAPI parameter or a property in a
JSON request body:

```yaml
paths:
  /refunds:
    post:
      x-agent-capability:
        version: 1
        enabled: true
        scope: refund.create
        risk:
          level: high
        subject:
          required: true
        approval:
          when:
            - param: amount
              op: '>'
              value: 1000
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                amount:
                  type: number
```

The validator rejects unresolved or ambiguous condition paths and rejects
comparison values that rely on implicit JSON type coercion.

See the complete [order service example](examples/openapi-order-service.yaml)
for read, write, approval, audit, and disabled-operation declarations in one
OpenAPI document.

## What the tool checks

- OpenAPI `3.0.x` and `3.1.x` YAML or JSON documents;
- operation-level placement of `x-agent-capability`;
- ACC v1 declaration structure;
- local and local-file `$ref` resolution;
- OpenAPI parameter and JSON request-body input mapping;
- `approval.when.param` resolution and ambiguity;
- comparison operator and JSON schema type compatibility;
- machine-readable diagnostics and stable exit codes.

## What the tool does not claim

- It is not a complete OpenAPI validator or linter.
- It does not fetch remote `$ref` targets.
- It does not evaluate dynamic business authorization.
- It does not execute approval workflows or business operations.
- Passing this authoring check is not an ACC implementation certification.

Next, read the [OpenAPI Binding](bindings/openapi.md) and the
[Implementer's Guide](IMPLEMENTER_GUIDE.md).
