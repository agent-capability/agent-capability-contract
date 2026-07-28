# ACC v1.0.4

ACC v1.0.4 is a compatible authoring-experience release for the ACC v1
declaration family.

## Contract Version

ACC declarations continue to use:

```yaml
x-agent-capability:
  version: 1
```

This release adds no core field, changes no JSON Schema rule, changes no
OpenAPI Binding requirement, and requires no declaration migration.

## OpenAPI Authoring Validator

The `agent-capability-contract` npm package now publishes the non-normative
`acc-validate` command. It checks:

- OpenAPI 3.0 and 3.1 documents in YAML or JSON;
- operation-level `x-agent-capability` placement and ACC v1 declaration shape;
- local and relative local-file `$ref` targets without hidden network access;
- parameter and JSON request-body paths used by `approval.when`;
- strict JSON type compatibility without implicit coercion;
- human-readable and JSON diagnostics with stable exit codes.

The validator is an authoring aid. It is not a complete OpenAPI linter,
business-authorization engine, runtime, policy service, or ACC certification.

## Five-Minute Quickstart

English and Chinese quickstarts now provide one continuous path from an
existing OpenAPI document to a validated ACC declaration. The published
package can be run without a global installation:

```bash
npx --yes agent-capability-contract@1.0.4 validate ./openapi.yaml
```

## Multi-Operation Service Example

The new order-service example shows multiple ACC declarations in one OpenAPI
document:

- a low-risk readonly order query;
- a medium-risk order creation operation;
- a high-risk refund with parameter-level conditional approval;
- an audit-log operation that is explicitly disabled for agent exposure;
- reusable local OpenAPI components and references.

The example is validated by the same command documented in the quickstart.

## Tests And Packaging

The authoring validator and CLI have focused automated coverage for valid and
invalid declarations, references, ambiguous input paths, strict value types,
recursive schemas, diagnostics, and exit codes.

The npm artifact is also installed into a clean temporary project and exercised
through its published command during release verification.

## Conformance And Compatibility

The ACC v1 conformance corpus remains at 18 vectors. Existing vector inputs,
expected outcomes, Schema rules, core semantics, and OpenAPI Binding behavior
are unchanged. The corpus release marker is updated to `1.0.4`.
