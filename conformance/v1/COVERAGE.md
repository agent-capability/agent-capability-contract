# ACC v1 Coverage and Implementation Evidence

Status: Non-normative coverage index

Corpus: `vectors.json`, format version 1, specification release 1.0.5

[中文](COVERAGE.zh-CN.md)

This index describes the existing 26 reference vectors without changing their expected outcomes or the reference oracle. Normative obligations and recommendations remain in [SPEC.md](../../SPEC.md) and the [OpenAPI binding](../../bindings/openapi.md). Choose the applicable [Profile](../PROFILES.md) first.

## What Each Layer Proves

- `npm run conformance:check` checks the corpus against the reference oracle. Success is **corpus internal consistency**, not acceptance of a gateway, SDK, or production runtime.
- An implementation adapter needs to feed applicable vectors through its public interface and observe expected outcomes. Implementation evidence here is **Not run** because this index does not execute an external implementation.
- Integration evidence is needed to show actual dispatch gating, correct subjects, redacted persistence, and failure recovery. The [self-assessment template](../SELF_ASSESSMENT.md) keeps these claims separate.

`allow` in approval vectors means the tested condition does not create approval intent; it does not grant final permission. `scope_allowed` and `trusted_subject` are supplied abstract inputs, not verified identities or network observations.

## Existing Vectors

Every row has an abstract vector. The last two columns concern a real implementation, not the oracle. Section references point to SPEC except where the OpenAPI binding is named.

| ID | Existing semantic reference | Abstract observation covered | Expected outcome | Additional implementation evidence | Implementation status |
|---|---|---|---|---|---|
| `T-PARSE-01` | §§4.1–4.3, 6 | A minimal ACC v1 declaration is valid. | `valid=true` | Parser interface extraction and diagnostics | Not run |
| `T-PARSE-02` | §§4.1–4.3, 6 | A declaration without scope is invalid. | `valid=false, diagnostic="invalid_declaration"` | Parser interface extraction and diagnostics | Not run |
| `T-PARSE-03` | §§4.1–4.3, 6 | An unsupported major version is rejected or skipped with diagnostics. | `valid=false, diagnostic="unsupported_version"` | Parser interface extraction and diagnostics | Not run |
| `T-PARSE-04` | §§4.1–4.3, 6 | An unknown field is ignored without making the declaration invalid. | `valid=true` | Parser interface extraction and diagnostics | Not run |
| `T-PARSE-05` | §§4.1–4.3, 6 | A declaration without a version is invalid rather than classified as an unsupported version. | `valid=false, diagnostic="invalid_declaration"` | Parser interface extraction and diagnostics | Not run |
| `T-EXPOSE-01` | §§4.2–4.3, 4.5, 5 | A disabled capability is not exposed. | `exposed=false` | Real target/subject checks and dispatch boundary | Not run |
| `T-EXPOSE-02` | §§4.2–4.3, 4.5, 5 | A subject-required capability is not exposed without a trusted subject. | `exposed=false` | Real target/subject checks and dispatch boundary | Not run |
| `T-EXPOSE-03` | §§4.2–4.3, 4.5, 5 | A capability outside the runtime scope policy is not exposed. | `exposed=false` | Real target/subject checks and dispatch boundary | Not run |
| `T-EXPOSE-04` | §§4.2–4.3, 4.5, 5 | An enabled and allowed capability with required subject available is exposed. | `exposed=true` | Real target/subject checks and dispatch boundary | Not run |
| `T-APPROVAL-01` | §4.6 | approval.required true creates approval intent even when a condition does not match. | `decision="approval_required"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-02` | §4.6 | The first matching approval.when item is sufficient under ANY semantics. | `decision="approval_required"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-03` | §4.6 | A later matching approval.when item is sufficient under ANY semantics. | `decision="approval_required"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-04` | §4.6 | No conditional approval intent is created when no approval.when item matches. | `decision="allow"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-05` | §4.6 | An invocation value incompatible with its bound input schema is rejected before condition evaluation. | `decision="reject_invalid_arguments"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-06` | §4.6 | An empty approval.when array creates no conditional approval intent. | `decision="allow"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-07` | §4.6 | The in operator matches a parameter that is strictly JSON-equal to one array member. | `decision="approval_required"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-08` | §4.6 | The in operator does not coerce a JSON number into a string. | `decision="allow"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-09` | §4.6 | The contains operator uses substring matching for a string parameter and string value. | `decision="approval_required"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-10` | §4.6 | The contains operator uses strict JSON equality for members of an array parameter. | `decision="approval_required"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-11` | §4.6 | Array containment does not coerce a JSON number element into a string. | `decision="allow"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-12` | §4.6 | The exists operator matches a path that resolves to a non-null JSON value. | `decision="approval_required"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-13` | §4.6 | The exists operator does not match a path that is absent from the invocation input. | `decision="allow"` | Decision interface plus argument/dispatch binding | Not run |
| `T-APPROVAL-14` | §4.6 | The exists operator does not match an explicit JSON null value. | `decision="allow"` | Decision interface plus argument/dispatch binding | Not run |
| `T-RISK-01` | §4.4; [OpenAPI input mapping](../../bindings/openapi.md#input-and-value-mapping) | Under the OpenAPI binding, a GET operation defaults to low risk when risk and execution.readonly are omitted. | `effective_risk="low"` | Binding mapping and effective policy preservation | Not run |
| `T-RISK-02` | §4.4; [OpenAPI input mapping](../../bindings/openapi.md#input-and-value-mapping) | A non-readonly write operation defaults to medium risk when risk is omitted. | `effective_risk="medium"` | Binding mapping and effective policy preservation | Not run |
| `T-AUDIT-01` | §4.7 | The broad audit sensitivity hint is preserved as true. | `audit_sensitive=true` | Hint propagation; separate redacted-persistence test | Not run |

Inventory: declaration 5; exposure 4; approval 14; risk defaults 2; audit hint 1. Total: **26**.

## Where the Corpus Stops

The corpus does not exhaust every rule or checklist item. An absence below does not remove a normative obligation, and a recommended deployment control does not become an ACC requirement merely because it appears here.

| Concern | Existing reference / status | Abstract corpus coverage | Evidence still needed | Implementation evidence |
|---|---|---|---|---|
| Approval operators and defaults outside the supplied cases | SPEC §§4.4, 4.6; OpenAPI binding | Partial: sample values, not every operator/type/default combination | Boundary and invalid-input tests for the claimed surface | Not run |
| Timeout and rate-limit hint mapping | SPEC §4.8 hints; mapping is implementation policy | None | Effective windows/timeouts and observed mapped behavior | Not run |
| Final business authorization and cross-hop subject verification | SPEC §§2.1, 4.5, 5 | Abstract exposure booleans only | Actual revoked, forged, wrong-tenant and wrong-object decisions at each authority | Not run |
| Model/tool-result text cannot override governance | SPEC §§4.9, 5 | None | Adversarial input through actual ingestion, selection and dispatch interfaces | Not run |
| Approval intent versus completed approval | SPEC §4.6; implementer guide §7 recommends binding | Abstract intent only | Approver authority, frozen target/arguments, expiry and failure observations | Not run |
| Cumulative business effects | SPEC §4.6; enforcement belongs to business/policy layer | None | Concurrent/batch tests using authoritative state and documented limits | Not run |
| Sensitive hints versus actual logs | SPEC §4.7; retention/verification are deployment policies | Presence of one broad hint only | Redaction before persistence/export; access, completeness and retention tests; independent verification if claimed | Not run |
| Uncertain writes, cancellation, restart and replay | Implementation recovery policy; §4.8 idempotence is a hint | None | Preserve original call/target; inspect accepted/unknown effects; demonstrate no unsafe replay | Not run |
| Source trust, local sandboxing, task shutdown and data residency | Complementary implementation/deployment controls, not ACC fields | None | Named ownership, policy and deployment-specific integration evidence | Not run |

A generator also needs evidence of its emitted binding-native artifacts. An abstract declaration pass does not validate a complete OpenAPI document or a business API's semantics.

## Attach an Implementation Report

**Recommended:** record specification release, corpus commit or SHA-256, implementation commit/package hash, applicable Profile, public interface/adapter entrypoint, date, passed/failed/skipped/not-run IDs, evidence links and limitations. Explain each skip: not applicable differs from applicable but unsupported.

Do not copy oracle output into a runtime assessment as if it exercised that runtime. Keep the implementation's adapter and integration results separate. The [business worksheet](../../examples/BUSINESS_RISK_EXAMPLES.md) supplies scenarios for planning integration evidence, not pre-passed tests.
