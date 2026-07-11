# ACC Design Rationale And Boundaries

[简体中文](DESIGN_RATIONALE.zh-CN.md)

Status: Non-normative rationale

Applies to: ACC v1

ACC is intentionally a small contract. Small does not mean incomplete: it means the normative core contains only semantics that independent runtimes can interpret consistently without understanding one product's database, UI, identity model, approval system, or deployment topology.

Normative behavior is defined by [SPEC.md](SPEC.md), the versioned schema, and binding documents. This file explains why several useful platform and business features are not ACC core fields.

## 1. The Boundary In One Sentence

```text
ACC declares the agent-facing capability boundary.
The runtime governs exposure and invocation.
The business system remains the final authority.
```

ACC answers what an agent-facing runtime needs to know about a business capability: whether it is exposed, its policy scope, consequence risk, subject requirement, approval intent, audit sensitivity, execution hints, and model-readable guidance.

ACC does not attempt to describe the entire A2B control plane.

## 2. Test For A Core Field

A field belongs in ACC core only when all of the following are true:

1. It changes portable agent-facing governance semantics.
2. Independent parsers or runtimes can implement the same meaning.
3. The behavior can be tested without one product's private database, UI, identity directory, or workflow engine.
4. Standard OpenAPI and JSON Schema cannot already express it cleanly.
5. It does not require the runtime to become the final business authorization authority.
6. An older compatible runtime can ignore the field without silently reducing security, or the change uses a new major compatibility family.

These conditions are necessary, not sufficient. Passing them makes a proposal eligible for governance review; it does not create an obligation to add the field to ACC core.

Review also considers:

- demonstrated need across independent implementation contexts;
- whether the proposal is the smallest stable semantic addition;
- whether a binding, implementation extension, or adjacent specification is a better owner;
- complete defaults, precedence, failure, and security semantics;
- backward-compatibility and ecosystem implementation cost;
- implementation evidence and machine-readable conformance vectors.

More fields are not automatically better. A field that cannot pass this test creates apparent portability while moving hidden assumptions into every implementation.

## 3. Known Concerns That Are Intentionally Outside ACC Core

| Concern | Why it is not an ACC v1 core field | Correct owner or layer |
|---|---|---|
| Final user permission | Roles, ABAC rules, ownership, data permissions, and current account state are business-specific and time-dependent. | Business authorization layer |
| Tenant or merchant isolation | Isolation must remain enforced when an API is called outside an agent runtime. Gateway parameter injection is not a security boundary. | Business data and authorization layers |
| Identity representation | Sessions, JWT claims, service principals, certificates, directory groups, and signed tickets are not interchangeable. | Runtime identity bridge and business system |
| Approval assignee and workflow | Who approves, quorum, delegation, expiry, UI, and escalation depend on an organization's process. | External approval owner |
| Business deny rules | Blacklists, order state, inventory, refund limits, and contractual restrictions require authoritative business data. | Business policy and authorization layer |
| Cross-field or contextual invariants | Rules such as refund amount not exceeding the current order balance require fresh, authorized business state. | Business operation or preflight API |
| Context fetching | Where a value comes from, who may fetch it, freshness, failure, and caching require a separate data-access contract. | Runtime integration or business API |
| Audit retention and legal hold | Retention duration, archive, deletion, and legal hold are organization-wide compliance policies. | Deployment and compliance policy |
| Field-level audit redaction | ACC v1 declares broad sensitivity. A portable request/response path model, arrays, references, and conservative fallback still need design evidence. | OpenAPI schema annotation, runtime policy, or a future ACC proposal |
| General Boolean condition groups | ACC v1 intentionally uses bounded ANY conditions. Nested Boolean policy needs precedence, compatibility, and fail-safe semantics. | Runtime policy engine or a future ACC proposal |
| Approval UI or double confirmation | Some runtimes are headless gateways, queues, or deterministic workflows with no user interface. | Runtime or approval product |
| Rollback and compensation | Compensation is not necessarily an inverse call; it needs authorization, state, idempotency, and workflow semantics. | Transaction, saga, or workflow layer |
| Tool composition and ordering | Preconditions, orchestration, and multi-step transactions form a workflow or planning contract. | Workflow or orchestration layer |
| Storage, queue, signatures, metrics, and cost accounting | These are valuable control-plane features but do not change the portable declaration meaning. | Runtime implementation |
| HTTP, RPC, message queue, or MCP transport | ACC declarations can be consumed before several different invocation transports. | Binding, adapter, or transport specification |

Leaving these concerns outside ACC does not make them unimportant. It prevents ACC from giving false guarantees about responsibilities that only the business system or deployment owner can fulfill.

## 4. Thin Is Not Vague

A thin contract still needs exact semantics.

ACC therefore specifies:

- required fields and JSON types;
- exposure requirements for `enabled`, `scope`, and trusted-subject availability;
- strict, type-aware approval-condition comparison;
- safe handling of unsupported versions and unknown fields;
- the separation between model-controlled input and trusted governance metadata;
- conformance profiles and observable outcomes.

If the same declaration can be interpreted in contradictory ways by conforming implementations, that is a specification defect and should be corrected. If two organizations intentionally map the same risk classification to different local approval workflows, that is deployment policy, not a portability defect.

## 5. Examples Of The Boundary

### Portable declaration

```yaml
approval:
  when:
    - param: amount
      op: ">"
      value: 10000
```

The invocation argument and literal threshold are declared in the operation contract. A runtime can evaluate the condition without private business data.

### Business invariant

```text
refund amount <= current refundable order balance
```

The current balance is authoritative business state. The business operation must validate it even when the API is called without an agent runtime.

### Trusted subject requirement

```yaml
subject:
  required: true
```

ACC declares that an anonymous or untrusted invocation is not acceptable. It does not standardize whether the subject arrives as a JWT, signed ticket, service principal, or another trusted identity form.

## 6. Why ACC Does Not Standardize A Universal Policy Engine

A general policy language would need a type system, expression grammar, authoritative data sources, authorization for data access, freshness rules, deterministic failure semantics, and a sandbox. A partial expression language would make declarations look enforceable while allowing runtimes to interpret them differently.

ACC v1 uses bounded, typed conditions over declared invocation arguments. More powerful policy evaluation can be integrated by a runtime under an explicit policy namespace without pretending it is portable ACC behavior.

## 7. Safe Evolution

Unknown fields are ignored so newer declarations remain parseable by older runtimes. That rule does not make every new security field backward-compatible.

A new field that affects exposure, approval, authorization boundaries, or redaction may enter the same major family only when ignoring it is fail-safe or when the declaration carries a conservative fallback understood by older runtimes. Otherwise it requires a new major contract family or explicit capability negotiation.

Examples:

- An optional condition-combination hint may be compatible when an older runtime falls back to a more conservative approval decision.
- A new redaction field is not safely compatible if an older runtime ignores it and records raw sensitive values; it needs an existing broad sensitivity fallback or a new compatibility boundary.

## 8. How To Propose More Expressive Fields

A proposal should include:

- the portable problem, with more than one implementation context;
- why standard OpenAPI or an implementation extension cannot solve it;
- complete field and failure semantics;
- interaction and precedence with existing fields;
- backward-compatibility and fail-safe analysis;
- parser and runtime conformance vectors;
- examples that do not depend on one product's private architecture.

Features may begin as implementation extensions. Proven, portable, testable semantics can later be proposed for ACC through the process in [CONTRIBUTING.md](CONTRIBUTING.md).
