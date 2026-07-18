# ACC v1.0.2

ACC v1.0.2 is a compatible boundary, governance, and documentation clarification release for the ACC v1 declaration family.

## Contract Version

ACC declarations continue to use:

```yaml
x-agent-capability:
  version: 1
```

This release does not add or change any ACC field, JSON Schema rule, OpenAPI binding, or conformance outcome. No existing valid ACC v1 declaration requires migration.

## Trust Boundaries

- `subject.required: true` requires a trusted acting subject at the receiving runtime's current trust boundary.
- Model output, tool arguments, and unverified upstream claims do not become trusted subject context merely because they contain a subject identifier.
- ACC compatibility does not prove that one subject remained authentic and unmodified across a chain of agents, runtimes, organizations, or trust domains.
- Cross-hop continuity requires a complementary identity or delegation mechanism with explicit issuer, verification, audience, freshness, replay, and failure semantics.

These clarifications preserve the existing rule that the business system remains the final authorization authority at invocation time.

## Approval Evidence And Traceability

ACC continues to declare approval intent rather than an approval-evidence protocol.

- A runtime-authored approval field or audit record can provide operational traceability inside that runtime's trust domain.
- It is not automatically independent proof against compromise of the same runtime.
- Deployments requiring third-party verification need a complementary protocol that defines canonical bytes, signatures, issuer keys, freshness, replay protection, and fail-closed verification before execution.

No cryptographic or workflow mechanism is added to ACC v1 by this release.

## Public Governance

The repository now includes a public normative proposal lifecycle and template. Core-field admission checks are explicitly necessary but not sufficient. Proposals are also reviewed for independent demand, minimality, correct layer ownership, complete failure semantics, fail-safe compatibility, implementation evidence, conformance vectors, and ecosystem cost.

Submitting or accepting a proposal does not make it part of a released ACC version. Normative changes still follow the normal versioning, review, implementation, and release process.

## Scope And Ecosystem Boundaries

The new implementation-neutral landscape distinguishes ACC from adjacent concerns such as:

- OpenAPI and transport protocols;
- identity and delegation;
- runtime enforcement and policy systems;
- workflow and transaction coordination;
- final business authorization.

The recurring governance questions may also appear in broader cross-boundary agent-action environments. That observation is a research direction, not an expansion of ACC v1 compatibility. ACC v1 remains the concrete contract for A2B business operations, with OpenAPI as its first binding.

## Neutrality And Provenance

Public wording now describes ACC v1 as developed from A2B engineering work, including early BailingHub implementation experience, while preserving strict implementation neutrality. No product receives privileged semantics, governance influence, registry status, or compatibility treatment.

## Conformance

The ACC v1 machine-readable corpus remains at 18 vectors with unchanged inputs and expected outcomes. The corpus release marker is updated to `1.0.2` so implementations can identify the exact specification revision used for self-assessment.
