# ACC Implementation Registration and Self-Assessment

Status: Non-normative process
Applies to: ACC v1

ACC uses open registration backed by self-assessment evidence. It does not currently operate a certification program.

## 1. Registration Process

1. Choose a profile from [PROFILES.md](PROFILES.md).
2. Copy the template below into the implementation's public repository.
3. Complete the applicable checks in [README.md](README.md).
4. Link documentation, examples, tests, and known limitations.
5. Submit a pull request updating [../IMPLEMENTATIONS.md](../IMPLEMENTATIONS.md).
6. Reassess when the claimed ACC version or implementation behavior changes.

Maintainers review whether the submission is complete, accurately scoped, publicly verifiable, and neutrally worded. Registry inclusion is not a security audit, production-readiness guarantee, endorsement, partnership, or official certification.

## 2. Self-Assessment Template

```markdown
# ACC Self-Assessment

- Project:
- Public repository:
- Maintainer:
- Assessment date: YYYY-MM-DD
- ACC version: v1
- Claimed profile: Binding Parser / Binding Generator / Runtime / Policy Component
- Binding and binding version:
- Implementation version or commit:
- License:

## Supported Surface

- Supported ACC fields:
- Unsupported optional fields:
- Supported carrier-protocol versions:
- Runtime or integration assumptions:
- Conformance corpus release:
- Applicable vectors passed / skipped:

## Conformance Evidence

| Checklist area | Status | Evidence link | Notes |
|---|---|---|---|
| Binding Parser | Pass / Partial / N/A | | |
| Exposure | Pass / Partial / N/A | | |
| Governance | Pass / Partial / N/A | | |
| Authority Boundary | Pass / Partial / N/A | | |
| Traceability | Pass / Partial / N/A | | |
| Machine-readable vectors | Pass / Partial / N/A | | |

## Known Limitations

-

## Declaration

This is a self-assessment by the project maintainers. It does not claim official ACC certification, an independent security audit, or production-readiness endorsement.
```

## 3. Registry Entry Template

Add one row to the alphabetically ordered table in `IMPLEMENTATIONS.md`:

```markdown
| Project | Profile | ACC version | Status | Last assessed | Evidence | Notes |
|---|---|---|---|---|---|---|
| Example | Runtime | v1 | Self-declared | YYYY-MM-DD | [Assessment](https://example.com/assessment) | Short neutral description. |
```

## 4. Acceptance Criteria

A registry pull request should be accepted when:

- the project and evidence are publicly reachable;
- the claim names an ACC version and profile;
- the self-assessment is dated and tied to an implementation version or commit;
- partial support and known limitations are explicit;
- the description does not imply certification or official partnership;
- the implementation is not using ACC terminology deceptively.

Maintainers should not require a particular language, product architecture, deployment model, commercial relationship, or affiliation with any existing implementation.

## 5. Removal and Updates

An entry may be marked stale or removed when its links no longer work, the project no longer claims ACC support, the evidence materially contradicts the claim, or maintainers do not respond to a documented update request.

Removal from the registry does not restrict anyone from implementing or using ACC under its license.
