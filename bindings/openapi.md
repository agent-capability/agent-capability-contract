# OpenAPI Binding

ACC v1 is bound to OpenAPI through the operation-level extension field:

```yaml
x-agent-capability:
  version: 1
  enabled: true
  scope: order.read
```

## Placement

The extension MUST be placed on an OpenAPI operation object.

```yaml
paths:
  /orders/{id}:
    get:
      operationId: order_get
      summary: Query one order by ID.
      x-agent-capability:
        version: 1
        enabled: true
        scope: order.read
```

The extension SHOULD NOT be placed at the root, path item, schema, parameter, or response level.

## What Belongs In OpenAPI

Keep standard API shape in standard OpenAPI fields:

- path and method;
- `operationId`;
- `summary` and `description`;
- `parameters`;
- `requestBody`;
- `responses`;
- standard JSON Schema definitions.

ACC does not replace OpenAPI.

## What Belongs In ACC

Place agent governance metadata in `x-agent-capability`:

- exposure switch;
- scope;
- risk;
- subject requirement;
- approval intent;
- audit sensitivity;
- execution hints;
- agent guidance.

## Extension Bags

Business-specific metadata should not be added as new ACC core fields unless it has portable governance meaning.

Use operation-level extensions such as:

```yaml
x-business-owner: trade-team
x-business-policy:
  approval_scene: order_over_limit
```

ACC-compatible runtimes may preserve these fields, but must not silently treat them as security rules.

## Minimal Valid Declaration

```yaml
x-agent-capability:
  version: 1
  enabled: true
  scope: member.read
```

Runtimes should apply safe defaults for omitted fields.

## Recommended Declaration

```yaml
x-agent-capability:
  version: 1
  enabled: true
  scope: member.read
  risk:
    level: low
  subject:
    required: true
  execution:
    readonly: true
    idempotent: true
  guidance:
    when_to_use: Use when the user asks for a member profile.
    returns: Returns member name, level, tags, and last visit time.
```

## Write Operation Example

```yaml
x-agent-capability:
  version: 1
  enabled: true
  scope: refund.request.create
  risk:
    level: medium
  subject:
    required: true
  approval:
    when:
      - param: amount
        op: ">"
        value: 1000
        label: Refund amount exceeds 1000.
  audit:
    sensitive: true
  execution:
    readonly: false
    idempotent: false
```

`approval.when` uses ANY semantics: when `approval.required` is false or omitted, any matching item creates an approval intent. `approval.required: true` remains unconditional and cannot be reduced by `approval.when`.

## Non-Goals

The OpenAPI binding does not define:

- how a runtime signs tool calls;
- where approval is completed;
- how subjects are encoded;
- how route allowlists are stored;
- how audit records are persisted.

Those are runtime concerns. ACC defines the declaration, not the whole control plane.

The reasoning behind these boundaries is documented in [Design Rationale And Boundaries](../DESIGN_RATIONALE.md).
