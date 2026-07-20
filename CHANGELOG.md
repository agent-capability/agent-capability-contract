# Changelog

## Unreleased

- Defined a common Core/Binding interface covering carrier placement, validated capability artifacts, native input mapping, metadata precedence, failure behavior, and binding-specific conformance.
- Moved OpenAPI-specific extraction, parameter resolution, `GET` risk fallback, guidance mapping, and Parser Profile responsibilities into the OpenAPI binding.
- Clarified why detailed effect or business-domain taxonomies remain experimental authoring or binding metadata rather than ACC v1 core fields.
- Clarified why agent-selection guidance remains in the capability contract while native schemas and descriptions remain authoritative.
- Added a Draft Proposal for minimal agent-facing capability deprecation without automatic disabling, redirection, or schema changes.
- No released schema, core field, OpenAPI declaration behavior, or existing conformance outcome changed.

## 1.0.2 - 2026-07-18

- Added a public normative proposal lifecycle and template.
- Clarified that core-field admission checks are necessary but not sufficient.
- Added an implementation-neutral landscape of adjacent transport, identity, runtime-control, policy, workflow, and business-authorization layers.
- Clarified that broader cross-boundary agent-action governance is a research direction, while ACC v1 remains the concrete A2B contract with OpenAPI as its first binding.
- Clarified that `subject.required` applies at the receiving runtime's trust boundary and does not prove subject continuity across multiple hops.
- Clarified that runtime-authored approval assertions and audit records are not automatically independently verifiable evidence.
- Documented identity, delegation, canonicalization, freshness, replay protection, and third-party approval evidence as complementary protocol concerns.
- Refined provenance wording without granting any implementation privileged status in ACC governance or compatibility.
- Added Chinese concept and design-boundary documentation.
- No schema, core field, declaration compatibility, or conformance outcome changed; existing ACC v1 declarations require no migration.

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
