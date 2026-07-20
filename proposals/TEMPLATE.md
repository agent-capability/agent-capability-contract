# ACC Proposal: Short Title

- Status: Draft
- Author(s):
- Created:
- Target compatibility family:
- Related issue or pull request:

## Summary

Describe the proposed portable semantic change in a few sentences.

## Problem

Explain the problem and why existing ACC fields, binding-native standard fields, or implementation extensions cannot solve it cleanly.

## Non-Goals

List adjacent runtime, business authorization, workflow, UI, storage, or transport behavior that this proposal does not standardize.

## Independent Implementation Contexts

Describe at least two independent implementation contexts or provide a plan for collecting that evidence. Do not count two configurations of one private architecture as independent evidence.

## Proposed Syntax

Provide the smallest complete declaration examples.

## Normative Semantics

Define:

- field types and allowed values;
- required and optional fields;
- defaults;
- precedence and interaction with existing fields;
- validation and failure behavior;
- unknown value and unsupported-version behavior.

## Layer Boundary

Explain why ACC core is the correct owner rather than OpenAPI, a binding, runtime policy, business authorization, approval workflow, or another specification.

## Compatibility And Security

Document:

- behavior in an older runtime;
- whether ignoring the field is fail-safe for the declaration author's intent;
- conservative fallback or capability-negotiation requirements;
- downgrade, replay, authority-boundary, and redaction risks;
- whether the proposal requires a minor or major specification release.

## Alternatives

Describe rejected smaller designs, implementation extensions, and adjacent-layer solutions.

## Implementation Evidence

Link reference implementations, prototypes, or public implementation descriptions. State known limitations.

## Conformance Vectors

List parser and runtime inputs with abstract expected outcomes. Do not require a product-specific database, UI, identity directory, or workflow engine.

## Ecosystem Cost

Describe parser, generator, runtime, documentation, migration, and long-term maintenance impact.

## Open Questions

List unresolved decisions. A proposal with unresolved normative semantics should remain `Draft`.
