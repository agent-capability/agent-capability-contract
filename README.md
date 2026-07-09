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

ACC is the capability contract for **A2B (Agent-to-Business)**: agents safely doing business work through existing systems.

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

The first ACC binding is OpenAPI extension field:

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

See [SPEC.md](SPEC.md) for the normative field model.

## Repository Layout

```text
SPEC.md                       Normative ACC v1 specification
CONCEPTS.md                   A2B and ACC terminology
bindings/openapi.md           OpenAPI extension binding
schemas/acc.v1.schema.json    Machine-readable JSON Schema
examples/                     OpenAPI examples
conformance/README.md         Implementation conformance checklist
IMPLEMENTATIONS.md            Known implementations and claim language
GOVERNANCE.md                 Stewardship, versioning, and extension rules
CONTRIBUTING.md               Contribution rules for contract changes
CHANGELOG.md                  Public changes
NOTICE                        Attribution notice
LICENSE                       Apache-2.0 license
```

## Implementations

ACC is implementation-neutral. It can be implemented by control planes, API gateways, SDK generators, developer tools, agent runtimes, MCP gateways, and policy engines.

Known implementations are listed in [IMPLEMENTATIONS.md](IMPLEMENTATIONS.md). Projects implementing ACC are welcome to submit a pull request to be listed there.

## License

ACC is licensed under the Apache License 2.0. See [LICENSE](LICENSE).

The license allows use, modification, redistribution, and commercial implementation of ACC.
