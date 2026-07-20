# Agent Capability Contract v1

Status: Stable
Ecosystem maturity: Early adoption
Conformance: Self-assessment with machine-readable reference vectors
Short name: ACC v1
Specification release: 1.0.3
First standardized binding: OpenAPI (`x-agent-capability`)

## 1. Scope

ACC v1 defines a declaration model for business capabilities that may be exposed to agents.

The normative scope of ACC v1 is:

- exposing or hiding a capability;
- declaring a stable permission scope;
- declaring runtime risk;
- declaring whether a real acting subject is required;
- declaring approval intent and parameter-level confirmation rules;
- declaring audit sensitivity;
- declaring execution hints such as readonly, idempotent, timeout, and rate limit;
- providing model-readable guidance;
- preserving extension metadata without implicitly changing security behavior.

ACC v1 does not define:

- final business authorization;
- user identity format;
- runtime storage schema;
- approval workflow ownership;
- tool invocation transport;
- model provider behavior;
- user interface requirements.

## 2. Design Principles

### 2.1 Reach And Authority

ACC controls reach: which business capabilities an agent-facing runtime may expose to an agent in a specific route or scenario.

The business system controls authority: whether the acting subject can actually perform the action at call time.

An ACC-compatible runtime MUST NOT treat ACC as a replacement for business authorization.

### 2.2 Stable Core, Open Extensions

ACC core fields are stable and have explicit runtime meaning.

Unknown fields inside the ACC declaration object MUST be ignored by runtimes unless they are standardized in a later ACC version.

Binding-native or implementation-specific extension fields MAY be preserved in an extension bag, but MUST NOT implicitly alter allowlist, risk, approval, rate limit, audit, or signature behavior. For example, the OpenAPI binding may preserve operation-level `x-business-*` fields without assigning them ACC semantics.

### 2.3 Parameters Stay In Binding-Native Schemas

Business input parameters MUST remain in the standard input-schema mechanism of the bound protocol.

ACC MUST NOT become a duplicate schema language for business parameters.

Each binding MUST define how its native input schema and invocation values map to the ACC JSON value model used by validation and approval conditions. Binding requirements are defined in [bindings/README.md](bindings/README.md).

## 3. Core And Binding Model

ACC Core is the declaration object defined by the field model in this specification. A binding carries that object on a protocol-specific operation and resolves the operation's native input schema into a form a core runtime can validate.

An ACC-declared operation is exposed only when:

- `enabled` is `true`;
- `scope` is present and non-empty;
- the runtime's route or policy allows that scope;
- the binding supplies enough input schema for safe invocation.

The first standardized ACC v1 binding is OpenAPI. It carries the declaration in the operation-level `x-agent-capability` extension. Placement, extraction, parameter resolution, and OpenAPI-specific conformance are defined in [bindings/openapi.md](bindings/openapi.md).

Core declaration example:

```yaml
version: 1
enabled: true
scope: order.read
risk:
  level: low
subject:
  required: true
execution:
  readonly: true
  idempotent: true
```

## 4. Field Model

### 4.1 `version`

Type: integer  
Required: yes  
Allowed value in this specification: `1`

Declares the ACC schema version used by this object.

Runtimes SHOULD reject unsupported major versions or mark the operation as skipped with diagnostics.

### 4.2 `enabled`

Type: boolean  
Required: yes

When `false`, the operation MUST NOT be exposed as an agent-callable capability.

### 4.3 `scope`

Type: string  
Required: yes  
Recommended format: dot-separated capability scope, such as `order.read`, `staff.search`, `refund.request.create`.

The scope is the unit used by route allowlists and governance policies.

Runtimes MAY support exact matching and prefix matching such as `order.*`, but matching rules are runtime policy and not part of ACC core.

### 4.4 `risk`

Type: object  
Required: no

```yaml
risk:
  level: low
```

Fields:

| Field | Type | Required | Values |
|---|---|---|---|
| `level` | string | no | `low`, `medium`, `high` |

Risk levels describe the worst reasonable consequence of allowing an agent to initiate the operation automatically.

- `low`: readonly or minor recoverable effect.
- `medium`: business side effect, usually single-object, recoverable, or request/draft creation.
- `high`: money movement, deletion, permission changes, HR actions, contracts, bulk actions, cross-tenant effects, external notifications, or difficult rollback.

If omitted, runtimes SHOULD apply safe defaults:

- `execution.readonly: true`: `low`;
- operations not declared readonly: `medium`.

A binding MAY define an additional native signal for the readonly default when that signal has stable semantics in the carrier protocol. The binding MUST document its precedence and conservative fallback.

### 4.5 `subject`

Type: object  
Required: no

```yaml
subject:
  required: true
```

Fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `required` | boolean | no | Whether an acting subject is required before this capability may be exposed or invoked. |

If `subject.required` is true and the runtime has no trusted acting subject, the capability SHOULD NOT be shown to the agent.

The requirement applies at the runtime's current trust boundary. A subject identifier copied from model output, tool arguments, or an unverified upstream message is not a trusted acting subject merely because the sender labels it as one. The receiving runtime MUST resolve or verify subject trust through its own trusted context or an explicit identity/delegation binding.

ACC v1 does not prove that the same subject has remained unmodified across multiple agent, runtime, or organizational hops. End-to-end subject continuity requires a complementary identity or delegation mechanism with its own issuer, verification, freshness, and failure semantics.

At invocation time, the business system MUST still verify the subject according to its own permission model.

### 4.6 `approval`

Type: object  
Required: no

```yaml
approval:
  required: true
  prompt: "Approve refund for order {order_id}?"
  when:
    - param: amount
      op: ">"
      value: 1000
      label: Refund amount exceeds 1000.
```

Fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `required` | boolean | no | Every invocation should create an approval intent before execution. |
| `prompt` | string | no | Human-readable approval prompt template. |
| `when` | array | no | Parameter-level confirmation rules. |

`approval.when` items:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `param` | string | yes | Argument path, using dot notation for nested values. |
| `op` | string | yes | One of `>`, `>=`, `<`, `<=`, `==`, `!=`, `in`, `contains`, `exists`. |
| `value` | any | conditional | Comparison value; not required for `exists`. |
| `label` | string | no | Human-readable explanation. |

Approval condition semantics:

- `approval.required: true` means every invocation creates an approval intent. Conditional rules MUST NOT reduce an unconditional approval requirement.
- When `approval.required` is false or omitted, `approval.when` uses **ANY** semantics: one matching item is sufficient to create an approval intent.
- An absent or empty `approval.when` array creates no conditional approval intent.
- `param` MUST resolve to an input declared by the bound operation. Each binding MUST define deterministic path resolution and map native values to the ACC JSON value model.
- Runtimes MUST evaluate conditions against JSON values. They MUST NOT coerce strings into numbers or booleans for comparison.
- `>` / `>=` / `<` / `<=` require a JSON `number` or `integer` parameter and a finite JSON number as `value`.
- `==`, `!=`, and `in` use strict JSON type-aware equality. For example, `true` is not equal to `"true"`, and `0` is not equal to `"0"`.
- `contains` applies only to string or array parameters. String containment requires a string `value`; array containment uses strict JSON equality for elements.
- If an invocation supplies a value whose JSON type is incompatible with the condition parameter schema, the runtime MUST reject the invocation before it reaches the business operation. It MUST NOT silently treat the condition as unmatched.

ACC declares approval intent. It does not define who approves, where approval occurs, or how the business workflow is completed.

An approval field or runtime-authored audit entry is not, by itself, independently verifiable evidence that approval occurred. ACC v1 does not standardize canonical serialization, digital signatures, issuer keys, freshness anchors, or replay protection for approval evidence. Deployments that require third-party verification MUST provide those semantics in a complementary approval, identity, or evidence protocol.

### 4.7 `audit`

Type: object  
Required: no

```yaml
audit:
  sensitive: true
```

Fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sensitive` | boolean | no | Indicates that arguments or responses may contain sensitive data and should be redacted or summarized in logs. |

Runtimes SHOULD preserve audit records for invocation attempts, risk decisions, approval intent, and final result.

### 4.8 `execution`

Type: object  
Required: no

```yaml
execution:
  readonly: true
  idempotent: true
  timeout_ms: 10000
  rate_limit:
    count: 30
    window: 1m
```

Fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `readonly` | boolean | no | Operation should not change business state. |
| `idempotent` | boolean | no | Operation may be safely retried with the same arguments. |
| `timeout_ms` | integer | no | Invocation timeout hint in milliseconds. |
| `rate_limit` | object | no | Runtime rate limit hint. |

`execution.rate_limit`:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `count` | integer | yes | Maximum number of calls in the window. |
| `window` | string | yes | Window such as `1m`, `1h`, `1d`. |

### 4.9 `guidance`

Type: object  
Required: no

```yaml
guidance:
  when_to_use: Use when the user asks for order status.
  returns: Returns order status, amount, customer, and fulfillment state.
  examples:
    - id: SO202607001
  context:
    - customer-service
```

Fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `when_to_use` | string | no | Model-readable usage guidance. |
| `returns` | string | no | Human-readable return shape explanation. |
| `examples` | array | no | Example argument objects. |
| `context` | array of strings | no | Lightweight tags preserved for runtime, UI, or indexing. |

Guidance fields help agents select and call capabilities correctly. They MUST NOT be treated as security policy.

## 5. Runtime Conformance

An ACC-compatible runtime SHOULD:

- consume a validated ACC declaration and bound operation artifact from a conforming binding, or implement that binding itself;
- expose only `enabled: true` operations with a non-empty `scope`;
- compile the declaration into a runtime tool model;
- preserve the binding-native input schema required for validation;
- enforce route or policy allowlists using `scope`;
- apply risk defaults for omitted risk values;
- hide `subject.required` capabilities when no trusted subject exists;
- detect `approval.required` and `approval.when` before invocation;
- validate `approval.when` targets and values against the declared parameter schema;
- evaluate approval conditions without implicit JSON type coercion and reject incompatible invocation values before the business operation;
- preserve audit and trace information;
- ignore unknown ACC fields safely;
- preserve implementation-specific extension fields without making them security rules.

An ACC-compatible runtime MUST NOT:

- treat ACC as final business authorization;
- allow model-generated text to override scope, risk, subject, approval, or audit decisions;
- use unknown fields to silently change security behavior;
- require business parameters to be encoded inside ACC metadata;
- reinterpret a core field because a different carrier protocol is used.

## 6. Compatibility

ACC follows semantic versioning for the specification:

- patch versions clarify wording or fix schema/documentation errors;
- minor versions add optional fields or non-breaking semantics;
- major versions may change field meaning or required behavior.

ACC v1 runtimes MUST ignore unknown fields and SHOULD produce diagnostics for unsupported versions.

Ignoring an unknown field provides syntax-level forward compatibility, not automatic security compatibility. A new field that affects exposure, approval, authority boundaries, or redaction may remain in the ACC v1 family only when an older runtime ignoring it is fail-safe or when the declaration includes a conservative ACC v1 fallback. Otherwise the behavior requires a new major contract family or explicit capability negotiation.

The declaration field and the specification release serve different purposes:

- declaration field `version: 1` identifies the major contract compatibility family;
- repository releases use semantic versions such as `v1.0.3` for an exact published revision of ACC v1;
- patch and minor releases within `v1.x.x` keep the declaration field at `1`;
- a breaking contract family would require both an ACC `v2.0.0` specification release and declaration field `version: 2`.
