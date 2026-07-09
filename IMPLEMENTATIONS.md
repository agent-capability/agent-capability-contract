# Implementations

This document tracks known ACC implementations and implementation styles.

## Reference Implementation

### BailingHub

BailingHub is the first open-source A2B control plane and reference implementation of ACC.

It implements ACC by compiling OpenAPI `x-agent-capability` declarations and SDK-generated specs into a unified runtime tool model, then enforcing:

- route allowlists;
- risk levels;
- approval intents;
- parameter-level confirmation rules;
- subject requirements;
- HMAC-signed tool calls;
- audit trails;
- traceability;
- runtime diagnostics.

BailingHub also includes product/runtime features outside ACC, such as a console UI, routes, inbound channels, knowledge injection, web chat widgets, storage adapters, and deployment tooling.

Those runtime features are not required for ACC compatibility.

## Compatible Implementation Types

ACC may be implemented by:

- agent control planes;
- API gateways;
- OpenAPI developer tools;
- SDK generators;
- MCP gateways;
- enterprise AI platforms;
- runtime policy engines;
- audit and trace tools.

An implementation may support only part of the runtime lifecycle and still be useful, as long as it is explicit about what it implements.

## Claim Levels

Recommended claim levels:

| Claim | Meaning |
|---|---|
| ACC parser | Reads and validates `x-agent-capability`. |
| ACC generator | Produces ACC-compatible OpenAPI declarations. |
| ACC runtime | Enforces scope, risk, subject, approval intent, audit, and execution hints. |
| ACC reference implementation | A maintained implementation used by the ACC maintainers to prove the contract works in practice. |

Until a formal certification program exists, projects should avoid saying "ACC certified".
