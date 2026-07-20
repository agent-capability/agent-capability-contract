# ACC Proposal: Agent-Facing Capability Deprecation

State: Draft

Decision date: Not decided

Compatibility conclusion: Candidate same-major advisory addition; evidence pending

## Summary

Define a minimal, machine-readable signal for an ACC capability that remains enabled but is no longer recommended for new agent plans or integrations.

This draft does not change ACC v1. It records candidate semantics for public review and implementation evidence.

## Problem

`enabled` is intentionally binary: an enabled capability may be exposed, while a disabled capability must not be exposed. It cannot express a migration interval in which an existing agent-facing capability still works but new consumers should prefer another path.

Standard OpenAPI already supports operation-level `deprecated: true`. That signal is correct when the HTTP operation itself is deprecated. It does not cover the distinct case where the HTTP operation remains supported for non-agent clients but its agent-facing capability should no longer be selected for new use.

A portable deprecation signal could let parsers, catalogs, authoring tools, and runtimes preserve that distinction without turning lifecycle metadata into a second exposure or authorization mechanism.

## Non-Goals

This proposal does not define:

- API or schema versioning;
- automatic disabling at a future time;
- a `stable`, `sunset`, or `removed` lifecycle state machine;
- automatic redirection to another capability;
- argument translation or workflow migration;
- whether an LLM will follow migration guidance;
- final business authorization or endpoint availability;
- HTTP `Deprecation` or `Sunset` response-header behavior.

Actual removal remains explicit: the publisher sets `enabled: false`, removes the ACC declaration, or retires the underlying operation under the rules of the bound protocol and business system.

## Independent Implementation Contexts

The portable problem should be validated in at least these independent contexts before review advances:

1. An OpenAPI gateway or compiler where an HTTP operation remains active for conventional clients while its agent-facing capability is being replaced.
2. An agent platform or catalog that consumes a validated ACC capability artifact and needs to identify deprecated capabilities without owning the source API lifecycle.

Evidence from one product implementing both contexts is not sufficient by itself. This draft currently has no independent implementation evidence.

## Proposed Syntax

```yaml
x-agent-capability:
  version: 1
  enabled: true
  scope: refund.create
  lifecycle:
    deprecated: true
    migration_uri: https://example.com/migrations/refund-create
```

Candidate fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `lifecycle` | object | no | Agent-facing lifecycle metadata. |
| `lifecycle.deprecated` | boolean | no | The capability remains governed by `enabled`, but is not recommended for new agent use. Default: `false`. |
| `lifecycle.migration_uri` | absolute URI string | no | Human-facing migration documentation. It is not a capability reference or executable instruction. |

## Normative Semantics

The following semantics are candidates for review, not released ACC v1 requirements:

1. Missing `lifecycle` or missing `lifecycle.deprecated` means no ACC-specific deprecation signal.
2. `lifecycle.deprecated: true` MUST NOT change `enabled`, scope policy, risk, subject, approval, audit, execution, or final authority semantics.
3. An enabled deprecated capability remains eligible for exposure under ACC Core. A consumer MUST preserve the deprecation state in its validated capability artifact when it supports this proposal.
4. A runtime or authoring tool SHOULD make the deprecation state available as structured diagnostics. ACC does not require a particular warning UI, model prompt, or ranking algorithm.
5. A consumer MUST NOT automatically invoke, redirect to, authorize, or translate arguments for another capability based on `migration_uri`.
6. Consumers are not required to fetch `migration_uri`. If retrieved, its content is untrusted descriptive material and MUST NOT override governance metadata or become authority for execution.
7. A malformed `lifecycle` object or invalid field type MUST produce diagnostics under the supporting parser's documented validation behavior. It MUST NOT create a less-governed fallback tool.
8. Unknown lifecycle fields follow the existing ACC unknown-field compatibility rule and MUST NOT implicitly change security behavior.

## Interaction And Precedence

### `enabled`

`enabled` remains the only ACC Core field that directly enables or disables exposure. `enabled: false` always prevents exposure, regardless of lifecycle metadata.

Deprecation is therefore advisory migration state, not delayed enforcement. A publisher that intends to stop exposure must update `enabled` or use a separate deployment mechanism understood by all relevant runtimes.

### OpenAPI `deprecated`

For the OpenAPI binding:

- OpenAPI operation `deprecated: true` makes the bound operation effectively deprecated for agent consumers even when ACC lifecycle metadata is absent;
- `lifecycle.deprecated: true` may add an agent-specific deprecation signal while the OpenAPI operation remains active;
- ACC lifecycle metadata MUST NOT negate OpenAPI `deprecated: true`.

The OpenAPI binding would define this effective-state mapping if the proposal advances.

### Replacement Capabilities

This draft deliberately does not define `superseded_by: <scope>`. ACC `scope` is a policy and allowlist unit, not a globally unique operation reference. Replacements may be one-to-many, may require different arguments, and may have different risk or authorization semantics.

A future replacement reference would need binding-qualified identity, resolution, trust, and failure rules. Until then, migration details belong in non-executable documentation.

## Layer Boundary

Agent-specific deprecation is a plausible ACC declaration concern because it describes whether a capability is recommended to agent consumers while leaving the underlying operation active.

The lifecycle of the underlying API, RPC method, message consumer, deployment, or business operation remains owned by the binding-native contract and provider. Binding-native deprecation should be reused when it already expresses the intended scope.

## Compatibility And Security

An older ACC v1 runtime ignores `lifecycle` and continues to apply the existing `enabled`, scope, subject, risk, and approval behavior. This is a candidate same-major addition only because the draft forbids lifecycle metadata from acting as an automatic exposure restriction.

The fallback is not safe if a publisher treats deprecation or a date as automatic removal. Such behavior would require an existing conservative `enabled: false` fallback, explicit capability negotiation, or a new compatibility boundary.

The proposal does not weaken business authorization. It also does not guarantee that a model stops selecting the capability; the portable outcomes are preservation and structured deprecation state, not model obedience.

## Alternatives

### Use OpenAPI `deprecated` only

Preferred when the operation itself is deprecated for all consumers. It cannot distinguish agent-specific deprecation from general API deprecation.

### `status: stable | deprecated | sunset`

Not proposed. `deprecated` is a current recommendation state, while sunset is a future availability event or instant. Combining them creates overlapping state and time semantics and risks turning lifecycle into a second exposure switch.

### `sunset_at`

Deferred. A portable timestamp would need absolute-time syntax, clock and failure semantics, binding interaction, and a clear statement that it does not automatically change `enabled`. The minimal deprecation problem does not require it.

### `superseded_by: <scope>`

Not proposed because scope is not a unique operation identity and cannot safely drive automatic migration.

## Implementation Evidence

None yet. The proposal remains `Draft` until independent implementations or implementation descriptions demonstrate the same semantics without sharing one private architecture.

## Conformance Vectors

Candidate vectors, not yet part of the released corpus:

| ID | Input | Expected portable outcome |
|---|---|---|
| `T-LIFECYCLE-01` | lifecycle absent | no ACC-specific deprecation signal |
| `T-LIFECYCLE-02` | `enabled: true`, `deprecated: true` | capability remains exposure-eligible and carries deprecated state |
| `T-LIFECYCLE-03` | `enabled: false`, `deprecated: true` | capability is not exposed |
| `T-LIFECYCLE-04` | OpenAPI `deprecated: true`, ACC lifecycle absent | OpenAPI binding reports effective deprecation |
| `T-LIFECYCLE-05` | migration URI present | URI is preserved; no automatic redirect or invocation |
| `T-LIFECYCLE-06` | invalid deprecated type | diagnostic; no less-governed fallback tool |

Machine-readable vectors and a reference oracle are required before this proposal can advance to `Under Review`.

## Ecosystem Cost

The smallest candidate adds one optional object, one boolean, and one optional documentation URI. Costs include parser preservation, diagnostics, native-deprecation precedence in each binding, authoring guidance, and long-term naming stability.

Adding dates, replacement graphs, automatic migration, or enforcement would materially increase ecosystem cost and is outside this draft.

## Open Questions

- Is an ACC-specific signal needed in at least two independent bindings, or should OpenAPI-specific usage remain a binding extension?
- Is `lifecycle` the smallest stable namespace, or would a top-level `deprecated` boolean be more appropriate?
- Should `migration_uri` enter with the boolean or remain binding-native documentation?
- Which structured diagnostic is portable enough for conformance without prescribing UI?
