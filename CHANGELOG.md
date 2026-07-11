# Changelog

## Unreleased

## 1.0.0 - 2026-07-11

- Published the stable ACC v1 specification release while keeping declaration compatibility at `x-agent-capability.version: 1`.
- Clarified typed `approval.when` semantics: condition targets must resolve to declared parameters, comparisons do not coerce JSON types, and incompatible invocation values must be rejected before business execution.
- Added an implementation-neutral implementer's guide with reference lifecycles, approval patterns, security invariants, and conformance mapping.
- Added separate Parser, Generator, Runtime, and Policy Component conformance profiles.
- Added an open implementation registration and self-assessment process without implying certification.
- Strengthened maintainer neutrality invariants so no product implementation defines ACC semantics or receives privileged registry status.
- Reworked the implementation registry around profile claims, public evidence, known limitations, and equal criteria.

## Initial public draft - 2026-07-09

- Introduced ACC v1 as an OpenAPI `x-agent-capability` declaration contract.
- Defined core fields: `version`, `enabled`, `scope`, `risk`, `subject`, `approval`, `audit`, `execution`, and `guidance`.
- Added JSON Schema for ACC v1.
- Added OpenAPI examples for readonly query, approval intent, and subject-required capabilities.
- Added conformance checklist and governance notes.
