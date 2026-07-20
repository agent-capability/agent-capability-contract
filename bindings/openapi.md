# OpenAPI Binding

Status: Normative ACC v1 binding

Applies to: OpenAPI operation objects carrying ACC v1 declarations

This binding conforms to the common [ACC Binding Requirements](README.md). It defines carrier-specific placement, extraction, input mapping, and parser behavior; it does not redefine ACC Core fields.

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

## Extraction And Exposure

An OpenAPI operation is ACC-declared when its operation object contains `x-agent-capability`.

The parser MUST extract the extension value as the ACC declaration object and retain a binding-qualified reference to the source operation. An operation is eligible for exposure only when:

- `x-agent-capability.enabled` is `true`;
- `x-agent-capability.scope` is present and non-empty;
- the runtime's route or policy allows that scope;
- the OpenAPI operation provides enough parameter or request-body schema for safe invocation.

Malformed extension values, unsupported ACC major versions, and insufficient input schemas MUST be rejected or skipped with diagnostics. A parser MUST NOT fall back to exposing the same operation as an ungoverned tool.

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

## Input And Value Mapping

The bound input view consists of the operation's resolved standard OpenAPI `parameters` and `requestBody` schema. Implementations MUST declare which OpenAPI versions they support and MUST apply their documented `$ref` resolution behavior consistently.

`approval.when.param` MUST resolve to a declared input in that bound view. Nested paths use the ACC dot-notation rules from the core specification. If parameters from different OpenAPI locations would produce an ambiguous normalized path, the parser MUST reject the affected condition with diagnostics rather than choose one silently.

OpenAPI and JSON Schema string, number, integer, boolean, array, object, and null values map to the corresponding ACC JSON value types. Comparison behavior remains strict and type-aware as defined by ACC Core.

An unresolved reference, unsupported schema construct, non-finite numeric value, or invocation value incompatible with the declared schema MUST NOT be silently coerced into a value that changes an approval outcome.

For the ACC risk default, an OpenAPI `GET` operation is treated as the binding-native readonly signal when `execution.readonly` and `risk.level` are both omitted. An explicit `execution.readonly` or `risk.level` declaration takes precedence. Other operations not declared readonly default to `medium` risk under ACC Core.

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

`guidance` is supplemental agent-selection metadata:

- `guidance.when_to_use` MAY add agent-specific selection context that is not already clear from `summary` or `description`;
- `guidance.returns` MUST NOT replace or contradict standard OpenAPI `responses` schemas;
- `guidance.examples` MUST NOT replace standard parameter, request-body, or schema examples;
- OpenAPI schema remains authoritative for request and response shape;
- no guidance field is authorization or security policy.

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

## OpenAPI Parser Conformance

An implementation claiming the ACC v1 OpenAPI Binding Parser Profile MUST:

- read `x-agent-capability` only from OpenAPI operation objects;
- validate required ACC fields and supported major versions;
- preserve the resolved OpenAPI input schema needed for invocation validation;
- resolve `approval.when.param` against declared operation inputs;
- preserve unknown ACC and operation-level extension metadata without assigning it implicit security meaning;
- emit diagnostics for malformed declarations, unresolved parameter targets, unsupported schema constructs, and skipped operations.

The implementation SHOULD run the OpenAPI-oriented vectors in [../conformance/v1](../conformance/v1/README.md) and publish the supported OpenAPI versions in its self-assessment.

## Non-Goals

The OpenAPI binding does not define:

- how a runtime signs tool calls;
- where approval is completed;
- how subjects are encoded;
- how route allowlists are stored;
- how audit records are persisted.

Those are runtime concerns. ACC defines the declaration, not the whole control plane.

The reasoning behind these boundaries is documented in [Design Rationale And Boundaries](../DESIGN_RATIONALE.md).
