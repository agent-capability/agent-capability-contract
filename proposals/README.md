# ACC Proposal Process

ACC proposals provide a public, implementation-neutral path for changing normative fields or behavior. They are design inputs, not roadmap promises or compatibility claims.

Use [TEMPLATE.md](TEMPLATE.md) for a new proposal.

## Current Drafts

- [Agent-Facing Capability Deprecation](agent-facing-deprecation.md) records a minimal advisory deprecation candidate. It is not part of released ACC v1 and currently lacks the independent implementation evidence required for review.

## States

| State | Meaning |
|---|---|
| `Draft` | The author is still defining semantics or collecting evidence. |
| `Under Review` | The proposal is complete enough for public technical review. |
| `Accepted` | Governance review accepted the semantics for a future release. |
| `Rejected` | The proposal does not fit ACC core or did not satisfy the evidence requirements. |
| `Withdrawn` | The author withdrew the proposal. |
| `Superseded` | A later proposal replaced it. |

Proposal authors may suggest a state, but maintainers record state transitions in public review with a rationale. `Accepted` does not mean released; the change still follows ACC versioning, implementation, conformance, and release checks.

## Admission Gate

A normative proposal must first satisfy the core-field tests in [DESIGN_RATIONALE.md](../DESIGN_RATIONALE.md). Those tests are necessary, not sufficient.

Review additionally considers:

1. Evidence that the problem appears across independent implementation contexts.
2. Whether the proposal is the smallest stable semantic addition.
3. Whether ACC core is the correct layer rather than OpenAPI, a binding, an implementation extension, runtime policy, business authorization, or workflow orchestration.
4. Complete types, defaults, precedence, failure behavior, and security semantics.
5. Fail-safe behavior for older runtimes, a conservative fallback they already understand, or a new compatibility boundary.
6. Reference implementations or implementation descriptions that do not share one private product architecture.
7. Machine-readable parser or runtime conformance vectors.
8. Ecosystem complexity and long-term maintenance cost.

Examples alone do not prove cross-implementation demand. A self-assessment does not decide acceptance.

## File Naming

Before an identifier is assigned, use a descriptive draft filename in a pull request. Accepted or long-running proposals may be assigned a stable filename such as:

```text
0001-short-title.md
```

Do not reuse identifiers from rejected, withdrawn, or superseded proposals.

## Compatibility Rule

An optional security restriction is not backward-compatible merely because an older parser ignores it. Review the declaration author's security intent:

- if ignoring the field broadens exposure, weakens approval, extends authorization, or records data that should be redacted, ignoring it is not fail-safe;
- same-major evolution requires a conservative fallback understood by older runtimes or explicit capability negotiation;
- otherwise use a new major compatibility family.

## Decision Record

The merged proposal or pull request must preserve:

- final state;
- decision date;
- concise rationale;
- compatibility conclusion;
- links to conformance evidence;
- superseding proposal, when applicable.

Private conversations, product-specific negotiations, and personal attribution are not normative evidence. Public decisions should stand on portable semantics and reproducible evidence.
