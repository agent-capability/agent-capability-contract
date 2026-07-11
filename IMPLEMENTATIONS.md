# ACC Implementations

This document is an open registry of projects that publicly declare ACC support.

The registry is implementation-neutral. Entries are ordered alphabetically and evaluated under the same evidence rules regardless of language, architecture, owner, commercial model, or relationship with ACC maintainers.

Registry inclusion is not official certification, a security audit, production-readiness endorsement, partnership, or commercial recommendation.

## Registered Implementations

| Project | Profile | ACC version | Status | Last assessed | Evidence | Notes |
|---|---|---|---|---|---|---|
| [BailingHub](https://github.com/bailinghub/bailinghub) | Runtime | v1 | Self-declared | 2026-07-11 | [ACC implementation](https://github.com/bailinghub/bailinghub/blob/main/docs/TOOLS_MODEL.md) | First public implementation used to validate the initial contract; its product architecture does not define ACC semantics. |

## Register an Implementation

Projects are welcome to register through a pull request:

1. choose a claim from [conformance/PROFILES.md](conformance/PROFILES.md);
2. publish a dated self-assessment using [conformance/SELF_ASSESSMENT.md](conformance/SELF_ASSESSMENT.md);
3. provide public evidence and known limitations;
4. add one alphabetically ordered row to the registry table.

Maintainers verify submission completeness, evidence reachability, claim scope, and neutral wording. They do not certify the implementation's security or production readiness.

## Available Profiles

| Profile | Meaning |
|---|---|
| ACC parser | Reads and validates `x-agent-capability`. |
| ACC generator | Produces ACC-compatible declarations while keeping business parameters in standard OpenAPI schemas. |
| ACC runtime | Applies exposure, governance, authority-boundary, and traceability semantics. |
| ACC policy component | Enforces a named subset of ACC semantics for another runtime or gateway. |

An implementation may support only part of the lifecycle and still be useful, as long as its profile and limitations are explicit.

Recommended claim language:

```text
Implements the ACC v1 Runtime Profile.
```

Avoid:

```text
ACC certified.
Official ACC implementation.
```
