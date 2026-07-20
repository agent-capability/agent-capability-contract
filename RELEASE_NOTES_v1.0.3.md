# ACC v1.0.3

ACC v1.0.3 is a compatible Core/Binding architecture clarification release for the ACC v1 declaration family.

## Contract Version

ACC declarations continue to use:

```yaml
x-agent-capability:
  version: 1
```

This release adds no released core field, changes no JSON Schema rule, and requires no declaration migration.

## Core And Binding Architecture

ACC Core now has an explicit boundary from protocol-specific bindings:

- Core owns the portable declaration fields, defaults, compatibility rules, and protocol-independent runtime invariants.
- A binding owns declaration placement, operation identity, native input mapping, parameter-path resolution, metadata precedence, extraction failures, diagnostics, and binding-specific conformance evidence.
- A validated capability artifact is defined as a conceptual interface between binding parsers and core runtimes, not as a required wire or storage format.
- OpenAPI remains the first standardized ACC v1 binding; future bindings must preserve core semantics rather than redefine them.

These clarifications make future binding work possible without turning ACC Core into an OpenAPI-specific model.

## OpenAPI Binding

OpenAPI-specific responsibilities are now consolidated in `bindings/openapi.md`, including:

- operation-level `x-agent-capability` extraction;
- standard `parameters` and `requestBody` preservation;
- strict native-value mapping and condition-path resolution;
- the OpenAPI `GET` readonly default and its precedence;
- the relationship between OpenAPI descriptions, schemas, examples, and supplemental ACC guidance;
- precise OpenAPI Binding Parser and Generator claim language.

No existing valid OpenAPI declaration changes meaning in this release.

## Risk And Guidance Boundaries

The design rationale now records why detailed state-effect or business-domain taxonomies remain experimental authoring diagnostics, binding metadata, or future evidence-backed proposals rather than ACC v1 core fields.

`guidance` remains in the capability contract because an agent-facing capability must be selectable as well as governable. Binding-native request and response schemas remain authoritative, and guidance remains supplemental, non-authoritative, and non-security-critical.

## Agent-Facing Deprecation Draft

The repository now contains a Draft Proposal for a minimal agent-facing deprecation signal. The draft deliberately does not define automatic sunset, disabling, redirection, argument migration, or replacement by `scope`.

The proposal is not part of released ACC v1. It has no effect on the v1 Schema or conformance corpus and cannot advance without independent implementation evidence and machine-readable vectors.

## Conformance

Binding Parser and Generator claims must now name the binding they implement. Runtime and Policy Component profiles remain protocol-independent when they consume an equivalent validated capability artifact.

The ACC v1 corpus remains at 18 vectors. Existing inputs and expected outcomes are unchanged; wording now distinguishes portable bound-input behavior from OpenAPI-specific defaults, and the corpus release marker is updated to `1.0.3`.
