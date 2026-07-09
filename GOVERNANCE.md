# Governance

ACC is maintained as an open contract, not as a product-private configuration format.

## Stewardship

ACC was initially proposed by the BailingHub project. It is maintained as an implementation-neutral open contract.

The long-term goal is to keep ACC implementation-neutral:

- A2B is the category: agents safely doing business work through existing systems.
- ACC is the capability contract for A2B.
- Any compatible runtime may implement ACC independently.
- The ACC specification should not depend on any implementation's internal database tables, UI concepts, or deployment model.

## Versioning

ACC uses semantic versioning for the specification.

- Patch: wording clarifications, examples, schema bug fixes that do not change meaning.
- Minor: new optional fields, new examples, or new non-breaking behavior.
- Major: required behavior changes, field meaning changes, or incompatible schema changes.

The OpenAPI binding uses:

```yaml
x-agent-capability:
  version: 1
```

The `version` field is an ACC schema version, not an implementation or product version.

## Extension Rules

ACC core fields should remain small and stable.

Add a new core field only when:

- it affects runtime governance;
- the effect is portable across runtimes;
- it can be tested by conformance checks;
- it cannot be expressed cleanly with standard OpenAPI schema;
- it does not require the ACC runtime to understand business-specific authorization logic.

Business-specific metadata should use:

- standard OpenAPI fields where possible;
- `guidance.context` for lightweight context tags;
- operation-level `x-business-*` fields for business-defined metadata;
- runtime-specific extension fields for non-portable behavior.

Unknown ACC fields must be ignored by compliant runtimes unless standardized later.

## Implementations

ACC implementations may include runtime features that are not part of ACC.

When an implementation feature becomes generally useful as a portable declaration, it can be proposed for ACC only after the contract boundary is clear.

## Attribution

Projects implementing ACC should cite:

```text
ACC (Agent Capability Contract), first published by the BailingHub project.
```

Implementations may say:

```text
Implements ACC v1.
```

They may not imply official certification unless a certification program exists.
