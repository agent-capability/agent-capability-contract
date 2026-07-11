# ACC v1.0.1

ACC v1.0.1 is a compatible clarification and conformance release for the ACC v1 declaration family.

## Contract Version

ACC declarations continue to use:

```yaml
x-agent-capability:
  version: 1
```

No existing valid ACC v1 declaration requires migration.

## Approval Semantics

- `approval.required: true` creates approval intent for every invocation.
- Otherwise, `approval.when` uses ANY semantics: one matching item is sufficient to create approval intent.
- An absent or empty `approval.when` creates no conditional approval intent.
- Existing strict JSON type comparison and argument-schema validation remain unchanged.

This clarification removes an ambiguity that could otherwise produce inconsistent independent runtimes.

## Conformance Corpus

The repository now includes machine-readable ACC v1 vectors for:

- declaration validation and unknown-field tolerance;
- exposure decisions for enabled, scope policy, and trusted-subject availability;
- unconditional and parameter-conditional approval decisions;
- strict argument-type rejection;
- risk defaults;
- audit sensitivity hints.

`npm run check` validates the specification repository and verifies the corpus against a reference oracle. Implementations may consume the same abstract inputs through their own adapters and publish results as self-assessment evidence.

## Design Boundaries

[DESIGN_RATIONALE.md](DESIGN_RATIONALE.md) documents known concerns that are intentionally outside ACC core, including final business permissions, tenant isolation, identity representation, approval ownership, audit retention, contextual business invariants, rollback, workflow composition, storage, transport, and observability.

The document also defines a test for proposed core fields and explains the difference between a small contract and an ambiguous contract.

## Safe Evolution

Unknown-field tolerance provides syntax-level compatibility only. Security-relevant optional fields may remain within ACC v1 only when older runtimes ignoring them are fail-safe or when a conservative ACC v1 fallback is present. Other changes require a new major family or explicit capability negotiation.

## Maturity

The ACC v1 specification core is stable. The implementation ecosystem is in early adoption, and conformance currently uses public profiles, machine-readable vectors, and self-assessment rather than official certification.
