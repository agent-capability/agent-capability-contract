# ACC in the Agent Governance Landscape

> Status: Informational and non-normative. This document explains where ACC fits among adjacent specifications, protocols, policy systems, and runtime controls. It does not change ACC v1 semantics or require any named technology.

## The Short Answer

ACC is a portable, operation-level declaration contract for business capabilities that may be exposed to agents.

It is designed to sit between interface and transport descriptions on one side, and deployment-specific enforcement and final business authorization on the other:

```text
Agent applications and orchestration
                 |
Interface, discovery, and transport protocols
                 |
ACC: portable business capability governance declarations
                 |
Runtime policy, gateways, control planes, and approval systems
                 |
Business authorization, workflows, data, and final effects
```

These layers are complementary. An implementation may use OpenAPI, MCP, A2A, a runtime hook framework, a policy engine, and ACC in the same system.

## Layer Map

| Layer | Primary question | Examples | Relationship to ACC |
|---|---|---|---|
| Interface description | What operation exists, and what are its inputs and outputs? | OpenAPI, JSON Schema | ACC reuses standard interface schemas instead of duplicating business parameters. |
| Tool and agent transport | How are tools or agents discovered, connected, and invoked? | MCP, A2A | A binding or adapter may carry ACC metadata across these protocols. ACC does not replace their transport semantics. |
| Identity and trusted metadata | Which agent or artifact is this, and which claims can be verified? | OASF, AgentFacts, identity and credential systems | ACC describes a business operation, not an agent identity or a trust credential. |
| Capability governance declaration | What business operation may an agent-facing surface expose, with what subject, risk, approval intent, audit, and execution metadata? | ACC | This is ACC's core responsibility. |
| Runtime decision and enforcement | Where and how is an invocation inspected, allowed, denied, transformed, escalated, throttled, or audited? | Control planes, API gateways, policy components, runtime hook specifications, OpenPort-style secure gateways | These systems can consume ACC declarations and combine them with local policy and context. |
| Enterprise policy and authorization | Is this subject allowed to perform this action now? | RBAC, ABAC, XACML, OPA, Cedar, IAM, application authorization | These systems retain authority. ACC must not replace them. |
| Workflow and transaction coordination | How are multi-step work, compensation, retries, and recovery coordinated? | Workflow engines, Saga coordinators, approval systems | ACC can describe individual capabilities, but does not promise cross-operation atomicity. |

## Recurring Governance Questions Across Boundaries

The technologies in this landscape do not all solve the same problem, but consequential agent actions repeatedly raise a related set of governance questions:

| Question | Portable concern | Current ACC v1 expression |
|---|---|---|
| What may the agent-facing surface expose? | Capability reach | `enabled`, `scope` |
| Must the action be bound to a trusted business actor? | Acting principal | `subject` |
| What kind of consequence can the operation produce? | Risk signal | `risk` |
| When must execution pause for an external decision? | Human intervention intent | `approval` |
| What evidence must remain for explanation and traceability? | Accountability | `audit` and runtime evidence |
| What portable execution properties should be preserved? | Execution semantics | `execution` |

These questions become relevant when an action crosses an effect, authority, or trust boundary. They can recur in business APIs, MCP tools, app intents, A2A delegation, and cross-organization automation.

Recurrence does not imply protocol ownership. A2A additionally needs task, delegation, and multi-party semantics. App and operating-system integrations need sandbox, permission, lifecycle, and user-consent semantics. Cross-organization systems need credentials, disclosure, revocation, and responsibility models. ACC must not absorb those layers merely because some governance questions are shared.

ACC v1 is the concrete A2B and operation-level contract in this landscape. Whether its core semantics can support other environments must be demonstrated through separate bindings, explicit failure behavior, independent implementations, and public proposal review.

## Adjacent Protocols and Specifications

### OpenAPI and JSON Schema

[OpenAPI](https://spec.openapis.org/oas/latest.html) describes HTTP operations, parameters, request bodies, responses, and other interface details. JSON Schema describes data shape and validation constraints.

ACC's first binding uses the OpenAPI extension field `x-agent-capability`. Business parameters remain in standard OpenAPI and JSON Schema. ACC adds portable agent-facing governance meaning beside the operation.

### MCP

[Model Context Protocol](https://modelcontextprotocol.io/specification/) defines an ecosystem for connecting models and applications to tools, resources, and prompts.

MCP and ACC answer different questions:

- MCP helps a client discover and invoke a tool.
- ACC describes the governance meaning of the underlying business operation.

An MCP gateway may expose a tool derived from an ACC-marked operation. A future ACC binding may define a portable mapping, but MCP is not required to implement ACC.

### A2A

[Agent2Agent Protocol](https://a2a-protocol.org/latest/) addresses communication and collaboration between agents. Its extension mechanism can carry additional capabilities or metadata.

ACC focuses on Agent-to-Business operations rather than Agent-to-Agent collaboration. An A2A extension may transport ACC-related metadata, but the two specifications do not own the same layer.

### Runtime control specifications

Runtime control systems define interception points and decisions around a live invocation. Two similarly named efforts must not be conflated:

- Microsoft's [Agent Control Specification](https://microsoft.github.io/agent-governance-toolkit/packages/agent-control-specification/) is part of the Agent Governance Toolkit and describes runtime intervention points and control decisions.
- The independent [Agent Control Standard](https://agentcontrolstandard.org/) describes governance hooks, Guardian-style evaluation, observability, and an Agent Bill of Materials.

Runtime hooks answer where and how to enforce a decision. ACC answers what portable governance meaning the business operation declares. A runtime can use both.

### Secure gateways and OpenPort

[OpenPort](https://arxiv.org/abs/2602.20196) proposes a model- and runtime-independent service-side security gateway for exposing application tools with controlled writes, authorization, failure handling, and auditability.

This has meaningful architectural overlap with an ACC runtime or control plane, but it is not the same artifact. ACC is a declaration contract; a secure gateway is an enforcement architecture. A gateway may consume ACC declarations, translate them into local policy, or use another declaration model.

### OASF and AgentFacts

[Open Agentic Schema Framework](https://docs.agntcy.org/pages/oasf.html) focuses on describing agent records, skills, domains, and discovery metadata. [AgentFacts](https://arxiv.org/abs/2507.14263) explores signed and verifiable claims about agents.

These efforts primarily describe or establish trust in an agent or artifact. ACC describes a business operation offered to agents. Trusted agent identity and operation-level governance can be used together.

### OPA, Cedar, XACML, RBAC, and ABAC

Policy languages and authorization models evaluate deployment-specific rules using local identities, resources, context, and enterprise policy.

ACC does not attempt to become a general policy language. A runtime may map `scope`, `risk`, `subject`, or approval metadata into [OPA](https://www.openpolicyagent.org/), [Cedar](https://www.cedarpolicy.com/), an API gateway policy, or application code. The business system still makes the final authorization decision.

## Why Keep a Separate Declaration Contract?

Business capability governance should survive changes in model provider, agent framework, transport protocol, gateway, and workflow product. Keeping the portable declaration separate from a particular enforcement runtime provides three useful properties:

1. **Portability:** the same operation metadata can be consumed by different implementations.
2. **Separation of responsibility:** the declaration describes governance intent without pretending to own identity, authorization, workflow, or UI.
3. **Testability:** parsers and runtimes can publish precise conformance evidence for the fields they support.

This separation does not mean every deployment needs a standalone ACC server. ACC metadata may be parsed by an SDK, gateway plugin, policy component, control plane, build tool, or agent runtime.

## Frequently Asked Questions

### Is ACC a replacement for MCP or A2A?

No. MCP and A2A define connection and collaboration mechanisms. ACC defines portable governance metadata for operations in existing business systems. They can be composed.

### Is ACC intended to govern every agent action?

No. ACC v1 has a precise normative scope: A2B business operations, with OpenAPI as the first binding. The governance questions ACC addresses can recur when agents cross other effect, authority, or trust boundaries, but broader applicability is a research and binding question rather than a current compatibility claim.

### Does every agent action need approval or a business subject?

No. The structural requirement is to reach an explicit governance conclusion. A low-consequence operation may require no subject and no approval, while a consequential operation may require both. ACC describes those differences; it does not make every operation high risk.

### Is ACC an authorization system?

No. ACC controls reach: what an agent-facing runtime may expose. The business system controls authority: whether the acting subject may perform the action at call time.

### Why not put all ACC fields directly into MCP or A2A?

A protocol-specific extension can carry ACC metadata, but the declaration should remain usable when a deployment uses another transport or calls an HTTP API directly. Protocol bindings belong beside the core contract, not inside its portable semantics.

### Why not use OPA, Cedar, or an API gateway instead?

Those systems make or enforce local policy decisions. ACC provides a common operation-level input that implementations may translate into those systems. ACC does not replace local policy.

### Do runtime hooks make ACC unnecessary?

No. Hooks define interception points and available actions. They do not automatically provide portable business meaning for every operation. Hooks and gateways can consume ACC declarations as one source of governance intent.

### Does an ACC declaration make an operation safe by itself?

No. Safety requires a compatible runtime, trusted subject resolution where applicable, secure execution, audit, and final business authorization. ACC is one layer in that chain.

### Is ACC tied to BailingHub or another implementation?

No. ACC is maintained independently. Implementations are evaluated under the same public profiles and evidence rules, regardless of owner.

### Why is the core deliberately small?

Fields enter the core only when their meaning can remain implementation-neutral, machine-testable, compatible, and separate from final authority. Runtime policy, approval ownership, enterprise compliance, multi-step workflow, and business invariants remain in their proper layers.

## Scope of This Document

The landscape changes quickly. Named projects are examples, not endorsements, dependencies, or claims of equivalence. This page explains architectural responsibility, not market rank.

For normative ACC behavior, read [SPEC.md](SPEC.md). For the boundary and field-admission rationale, read [DESIGN_RATIONALE.md](DESIGN_RATIONALE.md).
