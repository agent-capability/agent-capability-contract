# Safety Governance Responsibilities

Status: Non-normative guidance

Applies to: ACC v1, specification release 1.0.5

Reference review date: 2026-09-15

[中文](SAFETY_GOVERNANCE_GUIDE.zh-CN.md)

ACC describes business capabilities. A valid declaration is a useful input to governance; it is not proof of a trustworthy publisher, authorized execution, or a safe application. This guide helps a gateway, workflow, SDK, or agent runtime divide those responsibilities and choose evidence to test them.

Only [SPEC.md](SPEC.md), the [bindings](bindings/README.md), and the versioned schema define ACC semantics. **Normative reference** below points to an existing ACC rule; **Recommended**, **Optional**, and **Example** identify implementation guidance, not new ACC obligations. This document adds no fields, compatibility profile, certification, or jurisdiction-specific condition for using ACC.

## 1. Review One Business Task

**Example:** “Update pictures and descriptions for these 100 catalog items; read inventory to check availability; do not change prices or stock.”

The catalog and inventory services declare separate capabilities. ACC can describe each capability's scope, risk, required subject, approval intent, and execution/audit hints. The authorized object set, editable fields, total impact, selected service identities, and task stop conditions belong to the runtime and authoritative business policies. An agent's plan or a display name cannot grant those permissions.

**Recommended:** review the task with the [catalog and inventory worksheet](examples/BUSINESS_RISK_EXAMPLES.md), then distinguish three artifacts:

1. The declaration and binding-native operation, reviewed by its publisher.
2. The deployment's effective authorization, approval, and task controls.
3. Evidence of the exact implementation and operations actually tested.

The [reference-vector coverage index](conformance/v1/COVERAGE.md) explains how little of the third artifact can be inferred from the corpus alone.

## 2. Keep Source, Data, and Authority Separate

**Normative references:** [SPEC §§4.5, 4.9, 5](SPEC.md#5-runtime-conformance) establish subject trust, the non-policy nature of guidance, and the prohibition on model text overriding governance.

**Recommended implementation boundary:**

| Input | Appropriate use | Not established by that input |
|---|---|---|
| Governance declarations ingested through an authenticated, authorized publisher configuration | Validate and compile the declared semantics against a known operation | Schema validity does not authenticate the publisher or prove the implementation benign. |
| Tool names, object display names, descriptions, and `guidance` | Help a caller understand and select capabilities | They are not authorization identities, approval decisions, or executable policy. |
| Web pages, files, business text, and other tool results | Data to interpret and results to verify | Embedded instructions do not become trusted governance rules. |
| An updated declaration or input schema | Trigger a documented change review and revalidation | An update does not silently authorize changing previously approved arguments or targets. |
| Cached or loaded tools | Avoid repeated discovery while the task remains valid | A cache does not establish current permission, subject trust, or operation-version validity. |

**Recommended:** keep the publisher identity, binding-qualified operation identity, declaration/input-schema revision, and review history together. A digest can identify changed bytes; it does not identify a trustworthy publisher without an authenticated source. ACC does not define a signature format, trust root, or credential field.

**Recommended:** retain valid tools during a long task rather than treating every search as a security reset. Revalidate the trusted target and applicable policy at invocation; invalidate changed or revoked entries according to the implementation's documented lifecycle. A changed description is not permission to repeat an uncertain write. Use the implementation's original-call recovery mechanism; `idempotent` does not create a recovery protocol or a guarantee that a request never reached the business system.

## 3. Responsibility and Evidence Map

The following is an interpretive mapping to selected directions in China's [Artificial Intelligence Safety Governance Framework 3.0, published 2026-09-14](https://www.cac.gov.cn/2026-09/14/c_1791137092283345.htm). References to Appendix 2 use its “II. Preventive Measures” item numbers. [Official full text](https://www.cac.gov.cn/rootimages/uploadimg/1791137114683961/1791137114683961.pdf).

The framework is a reference for this review, not the exclusive basis of ACC or an ACC certification scheme. The implementation and evidence columns below are **Recommended review patterns**; they do not assert that the referenced framework prescribes ACC or a particular product design. Applicability of laws, sector rules, and deployment duties requires a separate assessment.

| Framework direction | Existing ACC reference | Runtime responsibility | Business system responsibility | Host/deployer responsibility | Useful acceptance evidence | Guarantee not established |
|---|---|---|---|---|---|---|
| Risk review: Appendix 1; Appendix 2, II.1 | §4.4 `risk`; §4.6 per-invocation conditions | Enforce effective risk/approval policy; assess cumulative task effects separately | Review consequences using current business state | Assess application purpose, autonomy, scale, and deployment context | Owner-reviewed worksheet plus boundary and batch tests | An ACC risk value is not an application risk grade. |
| Identity and task permissions: II.2 | §§4.2–4.3 `enabled`, `scope`; §4.5 `subject` | Bind selected capabilities to verified subjects and task policy | Reauthorize the actual subject and object at call time | Establish identities, credential lifecycle, and trust across boundaries | Unselected/revoked-target denial; original identity preserved on recovery | A scope or subject identifier is not final permission or end-to-end delegation. |
| Human control: II.3 | §4.6 `approval`; §5 | Evaluate intent before invocation; bind review to target and arguments | Own approver authority and business approval rules | Supply the approval service and an unavailable/expired decision policy | Changed arguments rejected; unavailable approval cannot enable dispatch | An approval declaration is not evidence that a person approved. |
| Tool and supply-chain review: II.4 | §4.1 version; binding-native schema; §4.9 guidance; §5 | Verify approved artifacts and handle revisions without changing in-flight calls | Publish accurate operation semantics and changes | Maintain source trust, dependency checks, and vulnerability response | Publisher/revision record; altered schema and poisoned-result tests | Valid ACC metadata does not prove tool safety or supply-chain integrity. |
| Runtime controls: II.5 | §4.8 execution hints; §4.6 cumulative-effects boundary | Enforce task limits, pause new dispatch, and distinguish in-flight/unknown results | Enforce balances, inventory invariants, concurrency, and supported recovery | Isolate local execution, network access, and task credentials | Concurrent budget tests; pause-before-dispatch; original-call recovery | Frequency hints are not cumulative-impact limits; cancellation is not rollback. |
| Monitoring and data handling: II.6 | §4.7 audit; §5 | Record necessary invocation/decision/result evidence with redaction | Identify sensitive business fields and protect result access | Set retention, storage, export, incident, and verification policies | Redacted export, access tests, retention/deletion tests, tamper checks where claimed | A sensitivity hint or runtime log is not full redaction, complete history, or independent proof. |
| Decommissioning: II.7 | No ACC lifecycle field; §§4.5, 4.7 remain relevant | Stop new dispatch and retain recoverable original-call associations as appropriate | Revoke relevant grants and resolve accepted operations by business rules | Stop owned processes, revoke credentials, and retain/erase required data | Shutdown/revocation test plus an explicit account of in-flight operations | ACC cannot terminate an unmanaged host process or undo accepted business effects. |

## 4. Review Different Kinds of Risk Separately

**Normative reference:** ACC `low`, `medium`, and `high` describe the worst reasonable consequence of automatically initiating an operation under [SPEC §4.4](SPEC.md#44-risk). The framework's five application-level grades use a different assessment scope. There is no unconditional conversion table.

**Example:** editing one unpublished product draft is different from autonomously publishing changes to thousands of products. Repeating a single-object operation does not encode aggregate risk into its declaration. [SPEC §4.6](SPEC.md#46-approval) already places cumulative controls in authoritative business or policy layers.

**Recommended:** distinguish a long-lived user grant from permission for a particular task. A task may narrow that grant by service, objects, operations, fields, and time. Task termination can end its execution permission while the implementation still permits authorized inspection of an original invocation's result. Neither a task lease nor its serialized format is part of ACC v1.

**Optional:** deployments can expose task budgets, a pause control, or independently verifiable evidence. These features need their own concurrency, replay, and failure semantics. A UI label or an invocation ID alone does not establish those guarantees.

## 5. State Claims Precisely

**Recommended:** publish the ACC release, implementation revision or package hash, claimed [profile](conformance/PROFILES.md), test entrypoint, observed outcomes, and untested areas using the [self-assessment template](conformance/SELF_ASSESSMENT.md).

Passing the declaration validator or reference oracle does not test a production runtime. Framework alignment does not establish legal compliance, certification, official endorsement, or independent adoption. Evidence about one runtime does not transfer to every ACC implementation.

Data residency, retention periods, content labeling, model safety, local sandboxing, and sector-specific approval remain deployment or complementary-system concerns. ACC's audit hint does not require uploading every conversational attachment or retaining private model reasoning. Define the necessary business evidence, visible conversation records, and reusable files separately for the actual purpose and applicable rules.
