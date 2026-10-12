# ACC Conformance Status and Evidence

Status: Non-normative evidence index

Reviewed: 2026-10-12

[简体中文](CONFORMANCE_STATUS.zh-CN.md)

This index brings together existing ACC requirements, reference coverage, implementation claims, and their limits. It adds no field, requirement, profile, certification, or release commitment. Normative meaning remains in [SPEC.md](SPEC.md), the [schema](schemas/acc.v1.schema.json), and the applicable [binding](bindings/README.md).

## Version and Maturity

| Dimension | Evidence and current state | Limit |
|---|---|---|
| Released contract baseline | [ACC v1.0.5](RELEASE_NOTES_v1.0.5.md), tag [`v1.0.5`](https://github.com/agent-capability/agent-capability-contract/tree/v1.0.5), commit `2aae4e4adcc0fb06e70556a9700ed233e7c951cb` | Declarations use `version: 1`; specification revisions and implementation versions are separate. |
| Repository material reviewed | Public repository snapshot [`9f527009aa1068f448d377c38c03f8cbf76469f0`](https://github.com/agent-capability/agent-capability-contract/tree/9f527009aa1068f448d377c38c03f8cbf76469f0) | Later documentation and repository checks do not themselves announce a new specification release. |
| Specification | [Stable ACC v1 core](SPEC.md) | Stable semantics do not establish deployment safety or broad ecosystem adoption. |
| Ecosystem | [Early adoption](README.md) | Registry size and evidence depth are separate from specification stability. |
| Conformance process | [Profiles](conformance/PROFILES.md), [self-assessment](conformance/SELF_ASSESSMENT.md), reference vectors | No official certification program is claimed. |

The core, schema, binding, and 26-vector corpus in the reviewed snapshot retain the v1.0.5 baseline. The coverage index and other explanatory material help navigate evidence without changing those outcomes.

## Nine Core Fields

The [JSON Schema](schemas/acc.v1.schema.json) defines all nine top-level fields. Only `version`, `enabled`, and `scope` are required; field-specific optionality and behavior remain in the specification. Schema validation is not evidence that a runtime enforces a declaration.

| Field | Existing definition | Supplied reference observations | What those observations do not establish |
|---|---|---|---|
| `version` | [SPEC §4.1](SPEC.md#41-version), schema | Declaration validity and unsupported-version samples | Every parser error path or an implementation's version negotiation |
| `enabled` | [SPEC §4.2](SPEC.md#42-enabled), schema | Declaration and exposure samples | Actual ingestion, exposure, or dispatch gating |
| `scope` | [SPEC §4.3](SPEC.md#43-scope), schema | Missing-scope and supplied scope-policy samples | Real route policy, tenant isolation, or final permission |
| `risk` | [SPEC §4.4](SPEC.md#44-risk), schema; [OpenAPI mapping](bindings/openapi.md) | Two default-risk cases | Complete risk-policy coverage or deployment-specific enforcement |
| `subject` | [SPEC §4.5](SPEC.md#45-subject), schema | Exposure uses supplied `trusted_subject` booleans | Authentication, delegation, or continuity across trust boundaries |
| `approval` | [SPEC §4.6](SPEC.md#46-approval), schema and binding input mapping | Fourteen intent/condition cases | Completed approval, all operator boundaries, aggregate limits, or third-party evidence verification |
| `audit` | [SPEC §4.7](SPEC.md#47-audit), schema | One broad sensitivity-hint case | Actual redacted persistence, access, completeness, or retention |
| `execution` | [SPEC §4.8](SPEC.md#48-execution), schema | `readonly` contributes to risk-default cases | Effective timeout/rate-limit mapping, deduplication, or recovery behavior |
| `guidance` | [SPEC §4.9](SPEC.md#49-guidance), schema and binding | No dedicated behavior vector in this corpus | Resistance to model/tool-result text overriding governance |

These are coverage descriptions, not pass results for an implementation. The [coverage index](conformance/v1/COVERAGE.md) lists every vector and the additional evidence each area needs.

## Four Claim Profiles

[Profiles](conformance/PROFILES.md) group existing responsibilities; they do not add ACC semantics. An implementation can claim a documented part of the lifecycle without claiming all four profiles.

| Profile | Existing responsibility | Evidence to distinguish from a reference-oracle result |
|---|---|---|
| OpenAPI Binding Parser | Extracts declarations, validates the supported surface, preserves native input schemas, and reports invalid or unsupported declarations | Actual parser interface, supported OpenAPI versions, diagnostics, and applicable vector results |
| OpenAPI Binding Generator | Produces valid binding-native artifacts with typed inputs and documented version | Generated OpenAPI artifacts and generator behavior; declaration examples alone do not prove this profile |
| Runtime | Applies exposure and governance while preserving final business authority | Actual invocation interface, dispatch decisions, subject/argument binding, traceability, and applicable integration evidence |
| Policy Component | Evaluates a named subset for another component | Supported fields, remaining lifecycle owner, and evidence that the decision is enforced at the integration boundary |

Parser and generator claims name their binding. A policy-component claim names its subset. None of these profiles requires a particular model, UI, storage system, queue, or product architecture.

## Reference Corpus and Repository Tooling

The [ACC v1 corpus](conformance/v1/README.md) contains **26 vectors**: declaration 5, exposure 4, approval 14, risk defaults 2, audit hint 1. It supplies abstract inputs and outcomes for the OpenAPI Binding Parser and Runtime profiles; it is not exhaustive coverage of either profile or of the nine fields.

| Evidence layer | Existing public source | Meaning and limit |
|---|---|---|
| Syntax and authoring | [Schema](schemas/acc.v1.schema.json), [`acc-validate` CLI](bin/acc-validate.mjs), [validator](lib/openapi-validator.mjs), [authoring/CLI tests](test/) | An authoring aid checks supported declarations and input mappings. It is not a full OpenAPI linter, runtime, or business authorization authority. |
| Corpus consistency | [Reference oracle](scripts/check-conformance.mjs); `npm run conformance:check` | Checks the supplied vectors against their reference expectations. A passing result does not execute a named external implementation. |
| Repository checks | [`npm run check`](package.json), [check workflow](.github/workflows/check.yml) | Documentation/link, corpus, and authoring-tool checks; not deployment or runtime acceptance. |
| Implementation adapter | [Self-assessment template](conformance/SELF_ASSESSMENT.md), [coverage index](conformance/v1/COVERAGE.md) | Feed applicable vectors through the named implementation's public interface and retain its outcomes. This index supplies no new adapter result. |
| Integration | [Checklist](conformance/README.md), [implementer's guide](IMPLEMENTER_GUIDE.md), [business worksheet](examples/BUSINESS_RISK_EXAMPLES.md) | Dispatch, subject, approval, persistence, and recovery claims need evidence for the actual boundary. Examples are not pre-passed integration tests. |

`allow` in an approval vector means that the tested condition does not create approval intent; it does not grant final permission. Likewise, `scope_allowed` and `trusted_subject` are supplied inputs, not verified identities or network observations.

## Registered Implementation Claims

At the review date, [IMPLEMENTATIONS.md](IMPLEMENTATIONS.md) contains one entry:

| Project | Registered profile | ACC family | Recorded status | Last assessed | Existing evidence |
|---|---|---|---|---|---|
| BailingHub | Runtime | v1 | Self-declared | 2026-07-11 | [Registry entry and its public implementation link](IMPLEMENTATIONS.md) |

That row does not register BailingHub under every profile, pin a current implementation commit, or constitute an independent conformance assessment. No second implementation or independent interoperability result is added by this index. The authoring validator in this repository is not an additional registered Runtime implementation.

The coverage index's implementation columns remain **Not run**: it describes the corpus and does not exercise an external implementation. That status does not erase the registry's self-declaration or prove that the implementation lacks support. It identifies the absence of the specific adapter/integration observation in that index.

For a new or updated claim, use the existing [self-assessment process](conformance/SELF_ASSESSMENT.md): identify the specification release, corpus commit/hash, implementation commit/package hash, profile, interface, date, passed/failed/skipped/not-run IDs, evidence, and limitations. A skip needs a scope reason; an applicable unsupported behavior is a limitation. Listing is not certification, endorsement, or production-readiness approval.

## Evidence Gaps and Responsibilities

| Concern | Existing boundary | Status to communicate |
|---|---|---|
| Timeout and rate-limit hints | [SPEC §4.8](SPEC.md#48-execution); implementation policy mapping | Defined hints; no effective-window or timeout behavior established by this index |
| Approval intent and audit sensitivity | [SPEC §§4.6–4.7](SPEC.md#46-approval); [coverage limits](conformance/v1/COVERAGE.md) | Abstract samples; completed approval and real redaction need implementation evidence |
| Trusted subject at the current boundary | [SPEC §4.5](SPEC.md#45-subject) | Existing requirement; actual verification needs evidence at that boundary |
| End-to-end subject continuity and delegation | [Design boundaries](DESIGN_RATIONALE.md), [multi-hop guidance](IMPLEMENTER_GUIDE.md#61-trust-across-multiple-hops) | Outside ACC v1's continuity guarantee; complementary identity/delegation semantics are required, not a planned ACC feature |
| Final permission, tenant/object isolation, cumulative effects | [SPEC](SPEC.md), [design boundaries](DESIGN_RATIONALE.md), [responsibility guide](SAFETY_GOVERNANCE_GUIDE.md) | Authoritative business/policy-layer responsibilities, not implied by an ACC pass |
| Storage, recovery, sandboxing, and deployment controls | [Coverage limits](conformance/v1/COVERAGE.md), [design boundaries](DESIGN_RATIONALE.md) | Implementation/deployment evidence; not new ACC fields or release commitments |

**Not run** means that the named observation has not been supplied here; it does not mean **planned**, **failed**, or **not applicable**. A complementary or out-of-scope responsibility is not a future core promise. [Proposal states](proposals/README.md) and [governance](GOVERNANCE.md) remain separate: a proposal is not a roadmap promise, and acceptance is not release.

When evidence changes, update its dated implementation report or registry entry and the relevant coverage links. Keep released semantics, reference consistency, implementation behavior, independent interoperability, and certification claims distinct.
