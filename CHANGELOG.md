# Changelog

## Unreleased

- Added a public normative proposal lifecycle and template.
- Clarified that core-field admission checks are necessary but not sufficient.

## 1.0.1 - 2026-07-12

- Clarified that `approval.when` uses ANY semantics when unconditional approval is not required.
- Clarified that `approval.required: true` remains unconditional and cannot be reduced by conditional rules.
- Added machine-readable ACC v1 parser and runtime conformance vectors plus a reference oracle.
- Added a design-rationale document covering known A2B concerns that intentionally belong outside ACC core.
- Added a fail-safe compatibility rule for security-relevant optional fields.
- Separated stable specification status from early ecosystem maturity.
- No existing ACC v1 declaration requires migration.

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
