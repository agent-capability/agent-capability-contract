# Concepts

## A2B: Agent-to-Business

**A2B (Agent-to-Business)** is the scenario where an agent safely and governably connects to an existing business system, acts on behalf of a real business subject, and uses business capabilities such as querying data, creating requests, updating state, or starting workflows.

A2B is not just tool calling. It includes:

- business-side identity and authorization;
- route and scenario boundaries;
- capability declarations;
- risk and approval intent;
- audit trails and traceability;
- signatures and invocation accountability;
- the ability for the business system to remain the final authority.

Short form:

```text
A2B = agents safely doing business work through existing systems.
```

## ACC: Agent Capability Contract

**ACC (Agent Capability Contract)** is the capability declaration contract for A2B.

ACC answers:

- Which business capability may be exposed to an agent?
- Under which scope?
- With what risk level?
- Does it require an acting subject?
- Does it require approval intent?
- What should be redacted or audited?
- What execution hints should a runtime respect?

ACC does not execute the capability. It declares the capability boundary.

Short form:

```text
ACC is the capability contract for A2B.
```

## Relationship

```text
A2B is the category.
ACC is the standard contract.
Implementations turn ACC declarations into runtime behavior.
```

## Why These Questions Recur

An agent can reason, draft, or simulate without producing an external effect. Governance becomes structurally important when an agent action crosses one or more boundaries:

- an **effect boundary**, where the action reads controlled data, changes state, sends a message, moves funds, or creates another real-world consequence;
- an **authority boundary**, where the action uses authority granted by a user, organization, application, or external system;
- a **trust boundary**, where the declaring, deciding, executing, and authorizing parties are not all in the same trust domain.

Across such boundaries, systems repeatedly need to answer related questions about capability reach, acting principals, consequences, human intervention, accountability, and execution semantics. A deployment may answer that no subject or approval is required for a particular low-consequence operation; that is still an explicit governance decision.

This recurring problem family is broader than any one transport or binding. It does **not** mean that ACC v1 already governs every agent action, or that its current fields can be copied unchanged into MCP, A2A, app intents, operating-system permissions, or cross-organization delegation. ACC v1 remains the concrete contract for A2B business operations, with OpenAPI as its first binding. Broader applicability requires separate bindings, failure semantics, implementation evidence, and public proposal review.

## Adjacent Terms

| Term | Meaning | Relationship |
|---|---|---|
| A2A | Agent-to-Agent collaboration. | Adjacent, not the same problem. |
| MCP | A protocol ecosystem for exposing and invoking tools. | Can be used with A2B, but does not define business governance by itself. |
| ACC | Capability declaration contract for A2B. | Defines portable business capability metadata. |
| ACC runtime | Any implementation that parses, validates, or enforces ACC declarations. | Runtime implementation, not the contract itself. |

## Recommended Messaging

Use:

```text
ACC is the capability contract for A2B.
```

Also accurate:

```text
ACC v1 is a concrete, machine-readable contract for recurring agent-action governance questions in A2B systems.
```

Avoid:

```text
ACC is a product-specific configuration format.
```

Avoid:

```text
Any implementation is the ACC standard.
```

Avoid:

```text
ACC v1 is the universal contract for every agent action.
```

The standard and the implementation should remain clearly separated.
