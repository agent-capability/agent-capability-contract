# ACC Binding Requirements

Status: Normative requirements for ACC v1 bindings

ACC Core defines the portable declaration object and its governance semantics. A binding defines how that object is carried by, resolved from, and validated against another protocol or interface description.

OpenAPI is the first standardized ACC v1 binding. It is not part of the identity of ACC Core, and future bindings MUST NOT redefine core field meaning.

## 1. Core And Binding Responsibilities

ACC Core defines:

- the `version`, `enabled`, `scope`, `risk`, `subject`, `approval`, `audit`, `execution`, and `guidance` fields;
- field defaults, precedence, failure behavior, and compatibility rules;
- the JSON value model used by portable approval-condition evaluation;
- runtime invariants that do not depend on one carrier protocol.

Each binding defines:

- the carrier object and placement of the ACC declaration;
- the operation granularity and stable operation reference used by the binding;
- how native input schemas and invocation values map to the ACC JSON value model;
- how `approval.when.param` paths resolve against native input definitions;
- how native descriptions, examples, lifecycle markers, and behavioral annotations interact with ACC metadata;
- extraction, validation, unsupported-version, and diagnostic behavior;
- binding-specific parser or generator conformance evidence.

When a carrier protocol provides standard schema or description mechanisms, bindings MUST reuse them. Bindings MUST NOT turn ACC into a duplicate request or response schema language.

## 2. Validated Capability Artifact

A binding parser produces or supplies the equivalent of a validated capability artifact containing:

- the ACC declaration object;
- a binding-qualified operation reference;
- the bound input schema needed for argument validation and condition resolution;
- the binding name and supported binding version;
- diagnostics produced during extraction and validation.

This is a conceptual interface, not a required storage format or wire object. Implementations MAY represent it with generated code, an in-memory model, a gateway route, or another equivalent structure.

A core runtime MAY consume this validated artifact without implementing the source binding itself. A runtime that also parses a binding MUST satisfy both the core runtime requirements and the applicable binding profile.

## 3. Input And Value Mapping

ACC condition evaluation uses JSON types and strict JSON equality. A binding MUST define a deterministic mapping from its native input model to:

- object;
- array;
- string;
- finite number;
- boolean;
- null.

If a native type, field-presence rule, reference, or numeric value cannot be represented faithfully, the binding MUST reject or skip the affected declaration with diagnostics. It MUST NOT silently coerce values in a way that changes approval-condition outcomes.

The binding MUST define whether parameter paths address a combined argument object, separate parameter locations, or another normalized input view. Two conforming implementations of the same binding MUST resolve the same path to the same declared input.

## 4. Native Metadata And Precedence

A binding MUST document every mapping between ACC and semantically related native metadata.

- Native request and response schemas remain authoritative for API shape.
- Native restrictions MUST NOT be weakened by ACC metadata.
- Agent-specific `guidance` MAY supplement native descriptions, but MUST NOT replace a declared input or output schema.
- Native behavioral annotations MAY be mapped into ACC only when the binding defines trust, precedence, defaults, and conservative failure behavior.
- Unknown native or ACC extension fields MUST NOT silently change exposure, risk, subject, approval, audit, or execution behavior.

Bindings MUST NOT infer final business authorization from carrier-protocol metadata.

## 5. Exposure And Failure

Every binding MUST preserve these core outcomes:

- `enabled: false` is never exposed as an agent-callable capability;
- an empty or missing `scope` is invalid for exposure;
- unsupported ACC major versions are rejected or skipped with diagnostics;
- insufficient input schema for safe invocation causes the operation to be skipped or rejected;
- binding extraction failure never creates a less-governed fallback tool.

A binding MAY define additional conservative rejection conditions required by its native protocol. It MUST NOT redefine the meaning of an existing ACC core field.

## 6. Binding Conformance

A binding specification MUST provide:

- at least one minimal valid declaration;
- placement and extraction examples;
- native type and parameter-path mapping rules;
- malformed, unsupported-version, unresolved-reference, and insufficient-schema outcomes;
- machine-readable parser vectors before a stable compatibility claim;
- claim language that names the binding and version.

The current OpenAPI mapping is defined in [OpenAPI Binding](openapi.md).
