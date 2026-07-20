<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/acc-logo-light.svg">
    <img src="./assets/acc-logo.svg" width="88" alt="Agent Capability Contract logo">
  </picture>
</p>

<h1 align="center">Agent Capability Contract (ACC)</h1>

**Agent Capability Contract (ACC)** is an open declaration contract for exposing business capabilities to agents.

ACC defines how a business system describes which operations an agent may see, when those operations should be considered risky, when a human approval intent is required, how an acting subject is required, and what metadata a runtime should preserve for audit and traceability.

ACC is not a runtime, a chatbot framework, or a workflow engine. It is a portable contract that can be implemented by different control planes, gateways, SDKs, developer tools, and agent runtimes.

ACC is maintained as an independent, implementation-neutral standard. No product implementation defines ACC semantics or receives privileged compatibility status.

ACC is the capability contract for **A2B (Agent-to-Business)**: agents safely doing business work through existing systems.

The governance questions ACC addresses can recur whenever an agent action crosses an effect, authority, or trust boundary. This is a broader research observation, not a claim that ACC v1 already governs every agent action. See [Concepts](CONCEPTS.md) for the distinction between recurring questions and the current normative scope.

ACC deliberately keeps a small normative core. See [Design Rationale And Boundaries](DESIGN_RATIONALE.md) for the concerns ACC knows about but intentionally leaves to business authorization, runtime policy, approval systems, compliance policy, or other contracts.

For an implementation-neutral map of adjacent protocols, runtime controls, policy systems, and workflow layers, see [ACC in the Agent Governance Landscape](LANDSCAPE.md).

| Dimension | Current state |
|---|---|
| Specification | Stable ACC v1 core, governed by Semantic Versioning |
| Ecosystem | Early adoption; independent implementations are welcome |
| Conformance | Profiles, self-assessment, and machine-readable v1 reference vectors |

## Why ACC Exists

Existing business systems were not designed for A2B. Once an agent can call business APIs, teams need a standard way to answer:

- Which operations may be exposed to an agent?
- Which route, product surface, or scenario may use a capability?
- Does the operation require a real business subject?
- Is the operation readonly, low risk, medium risk, or high risk?
- Should specific arguments trigger a human approval intent?
- Which fields are sensitive and should be redacted from audit logs?
- How should runtime gateways preserve extension metadata without making it a security rule?

ACC puts these declarations next to the API contract, while keeping the final authorization decision inside the business system.

```text
ACC controls reach.
The business system controls authority.
```

## OpenAPI Binding

OpenAPI is the first standardized ACC binding. It carries the ACC Core declaration in the operation-level `x-agent-capability` extension:

```yaml
x-agent-capability:
  version: 1
  enabled: true
  scope: order.read
  risk:
    level: low
  subject:
    required: true
  execution:
    readonly: true
```

See [SPEC.md](SPEC.md) for the normative core field model, [Binding Requirements](bindings/README.md) for the interface every binding must define, and [OpenAPI Binding](bindings/openapi.md) for the first carrier-specific mapping.

ACC v1 declarations use `version: 1`. Exact specification revisions use repository tags such as `v1.0.2`; product or runtime versions are separate.

## Implement ACC

- Read the non-normative [Implementer's Guide](IMPLEMENTER_GUIDE.md).
- Choose a claim from [Conformance Profiles](conformance/PROFILES.md).
- Run the applicable [machine-readable ACC v1 vectors](conformance/v1/README.md).
- Publish evidence using [Implementation Registration and Self-Assessment](conformance/SELF_ASSESSMENT.md).
- Submit a pull request to the neutral [implementation registry](IMPLEMENTATIONS.md).

## Repository Layout

```text
SPEC.md                       Normative ACC v1 specification
CONCEPTS.md                   A2B and ACC terminology
CONCEPTS.zh-CN.md             Chinese translation of core concepts and scope boundaries
bindings/README.md            Common requirements for ACC bindings
bindings/openapi.md           OpenAPI extension binding
schemas/acc.v1.schema.json    Machine-readable JSON Schema
examples/                     OpenAPI examples
conformance/README.md         Implementation conformance checklist
conformance/PROFILES.md       Parser, generator, runtime, and policy profiles
conformance/SELF_ASSESSMENT.md Open registration and evidence template
conformance/v1/                Machine-readable ACC v1 conformance vectors
proposals/                     Public normative proposal process and template
IMPLEMENTER_GUIDE.md          Non-normative implementation architecture guidance
DESIGN_RATIONALE.md           Why ACC stays small and where adjacent concerns belong
DESIGN_RATIONALE.zh-CN.md     Chinese design rationale and boundaries
LANDSCAPE.md                  Non-normative map of adjacent protocols and governance layers
IMPLEMENTATIONS.md            Known implementations and claim language
RELEASE_NOTES_v1.0.2.md       Current ACC v1 patch release summary
RELEASE_NOTES_v1.0.1.md       Previous ACC v1 patch release summary
RELEASE_NOTES_v1.0.0.md       Initial stable ACC v1 release summary
GOVERNANCE.md                 Stewardship, versioning, and extension rules
CONTRIBUTING.md               Contribution rules for contract changes
CHANGELOG.md                  Public changes
NOTICE                        Attribution notice
LICENSE                       Apache-2.0 license
```

## Implementations

ACC is implementation-neutral. It can be implemented by control planes, API gateways, SDK generators, developer tools, agent runtimes, MCP gateways, and policy engines.

Known implementations are listed alphabetically in [IMPLEMENTATIONS.md](IMPLEMENTATIONS.md). Projects implementing ACC are welcome to publish a self-assessment and submit a pull request. Listing is not certification or endorsement.

## License

ACC is licensed under the Apache License 2.0. See [LICENSE](LICENSE).

The license allows use, modification, redistribution, and commercial implementation of ACC.
