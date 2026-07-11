# ACC v1.0.0

ACC v1.0.0 is the first stable specification release of Agent Capability Contract for A2B capability declarations.

## Contract Version

ACC declarations continue to use:

```yaml
x-agent-capability:
  version: 1
```

The declaration field identifies the ACC v1 compatibility family. The `v1.0.0` repository tag identifies this exact specification revision. Product and runtime versions are independent.

## Specification Clarification

- `approval.when.param` must resolve to a typed standard OpenAPI parameter or request-body field.
- Comparisons use strict JSON type semantics and do not coerce strings into numbers or booleans.
- Incompatible invocation values must be rejected before the business operation is called.

## Implementer Path

- Added a non-normative implementer's guide covering reference modules and lifecycles without prescribing a product architecture.
- Added Parser, Generator, Runtime, and Policy Component profiles.
- Added open implementation registration and self-assessment templates.
- Added specification-derived security invariants and clearly separated optional platform features.

## Neutral Governance

- No product implementation defines ACC semantics or receives privileged compatibility or registry status.
- Implementation observations are examples until portable, testable semantics are accepted through the contract process.
- Registry inclusion is self-declared and evidence-backed; it is not certification, endorsement, partnership, or a production-readiness guarantee.

## Compatibility

This release keeps the ACC v1 declaration shape and does not require a new declaration version. Existing valid ACC v1 declarations remain in the same compatibility family.
