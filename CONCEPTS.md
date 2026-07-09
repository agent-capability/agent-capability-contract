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

Avoid:

```text
ACC is a product-specific configuration format.
```

Avoid:

```text
Any implementation is the ACC standard.
```

The standard and the implementation should remain clearly separated.
