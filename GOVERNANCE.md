# Governance

ACC is maintained as an open contract, not as a product-private configuration format.

## Stewardship

ACC v1 was developed from A2B engineering work, including early implementation experience in the BailingHub project. It is maintained as an implementation-neutral open contract.

The long-term goal is to keep ACC implementation-neutral:

- A2B is the category: agents safely doing business work through existing systems.
- ACC is the capability contract for A2B.
- Any compatible runtime may implement ACC independently.
- The ACC specification should not depend on any implementation's internal database tables, UI concepts, or deployment model.

## Maintainer Neutrality Invariants

ACC is an independent standard. It is not a subproject, configuration format, sales surface, or compatibility layer owned by any product implementation.

Maintainers MUST preserve the following boundaries:

- normative behavior is defined by ACC specification artifacts, not by any implementation's current code;
- no product receives privileged semantics, registry criteria, roadmap influence, or compatibility status because of its owner or relationship with maintainers;
- implementation names appear only in clearly labeled examples, evidence, or registry entries;
- an implementation-specific design may motivate discussion, but it becomes ACC behavior only when it is portable, testable, and accepted through the contract change process;
- examples and implementer guidance must distinguish normative requirements from recommended, optional, and example architecture;
- ACC governance, versioning, and licensing must remain usable by independent open-source and commercial implementations;
- registry inclusion does not imply certification, endorsement, partnership, security review, or production-readiness approval.

Implementation history does not grant control over ACC and does not make the contract dependent on any implementation.

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

Repository tags identify exact specification revisions:

- `v1.0.x`: wording, guidance, examples, schema corrections, and non-breaking clarifications for ACC v1;
- `v1.x.0`: new optional, portable, non-breaking ACC v1 behavior;
- `v2.0.0`: an incompatible contract family that also requires declaration `version: 2`.

Product versions and implementation release schedules MUST NOT be reused as ACC specification versions.

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

Unknown-field tolerance guarantees that a newer declaration remains parseable. It does not by itself guarantee that ignoring a new security field is safe. A field that affects exposure, approval, authority boundaries, or redaction may be added within the same major family only when:

- an older runtime ignoring it produces an equally safe or more conservative outcome; or
- the declaration includes a conservative fallback already understood by that major family.

Otherwise the change requires a new major contract family or an explicit capability-negotiation mechanism.

## Proposal Decisions

The core-field tests are necessary, not sufficient. Passing them makes a proposal eligible for review; it does not automatically place the proposal in ACC core or on a release roadmap.

Normative proposals are reviewed for:

- demonstrated need across independent implementation contexts;
- minimality and correct layer ownership;
- complete normative semantics, including defaults, precedence, and failure behavior;
- fail-safe compatibility or an explicit compatibility boundary;
- implementation evidence and machine-readable conformance vectors;
- ecosystem complexity and long-term maintenance cost.

Proposal states and submission requirements are defined in [proposals/README.md](proposals/README.md). Accepted proposals still ship only through the normal versioning and release process.

## Implementations

ACC implementations may include runtime features that are not part of ACC.

When an implementation feature becomes generally useful as a portable declaration, it can be proposed for ACC only after the contract boundary is clear.

Implementations register through public self-assessment evidence under the same criteria. The registration process is defined in [conformance/SELF_ASSESSMENT.md](conformance/SELF_ASSESSMENT.md).

## Implementation Evidence

Observed implementation failures can improve guidance, but evidence must be labeled accurately:

- specification-derived invariants may be documented immediately;
- experience from one implementation must be labeled as an example, not an ecosystem-wide pattern;
- normative changes require portable semantics and conformance evidence;
- an implementation's operational modules, workflow, storage, transport, and UI remain outside ACC unless separately standardized.

## Release Planning

Public milestones should communicate planned contract and documentation work. Release timing must not be coupled to a product release schedule.

Documentation-only guidance and non-normative examples may ship in patch releases. New optional normative behavior requires a minor release; incompatible semantics require a major release.

## Attribution

Projects implementing ACC may cite the historical source as:

```text
ACC (Agent Capability Contract), first published by the BailingHub project.
```

Implementations may say:

```text
Implements the ACC v1 Runtime Profile.
```

They may not imply official certification unless a certification program exists.
