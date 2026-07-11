# ACC Conformance Checklist

This checklist records ACC v1 runtime responsibilities. Before making a compatibility claim, select the applicable Parser, Generator, Runtime, or Policy Component profile in [PROFILES.md](PROFILES.md).

Use [SELF_ASSESSMENT.md](SELF_ASSESSMENT.md) to publish evidence and register an implementation. ACC currently uses self-assessment, not official certification.

Parser implementations normally complete the Parser section. Runtime implementations complete every applicable section. Generator and Policy Component requirements are defined in their profiles because they do not own the full runtime lifecycle.

## Parser

- [ ] Reads `x-agent-capability` from OpenAPI operation objects.
- [ ] Requires `version`, `enabled`, and `scope`.
- [ ] Skips or reports unsupported `version` values.
- [ ] Preserves OpenAPI `parameters` and `requestBody` schemas.
- [ ] Ignores unknown ACC fields safely.
- [ ] Preserves implementation-specific extensions without treating them as security policy.

## Exposure

- [ ] Does not expose operations with `enabled: false`.
- [ ] Does not expose operations without a non-empty `scope`.
- [ ] Applies route or policy allowlists using `scope`.
- [ ] Hides `subject.required` capabilities when no trusted acting subject exists.
- [ ] Provides diagnostics for skipped operations.

## Governance

- [ ] Applies safe risk defaults.
- [ ] Detects `risk.level: high` before invocation.
- [ ] Detects `approval.required` before invocation.
- [ ] Treats `approval.required: true` as unconditional approval intent.
- [ ] Evaluates `approval.when` with ANY semantics when unconditional approval is not required.
- [ ] Treats an absent or empty `approval.when` as no conditional approval intent.
- [ ] Requires every `approval.when.param` to resolve to a declared, typed OpenAPI parameter.
- [ ] Uses strict JSON type-aware comparison for approval conditions; does not coerce strings into numbers or booleans.
- [ ] Rejects a condition parameter whose invocation value is incompatible with its declared schema before calling the business operation.
- [ ] Applies `execution.rate_limit` or maps it to runtime limits.
- [ ] Applies `execution.timeout_ms` or maps it to runtime timeout policy.
- [ ] Treats `audit.sensitive` as a redaction or summarization hint.

## Authority Boundary

- [ ] Does not treat ACC as final business authorization.
- [ ] Propagates or requires a trusted acting subject when `subject.required` is true.
- [ ] Lets the business system decide whether the subject may perform the operation.
- [ ] Does not allow model-generated text to override scope, risk, approval, subject, or audit decisions.

## Traceability

- [ ] Records which ACC capability was exposed.
- [ ] Records risk and approval decisions.
- [ ] Records invocation result or failure summary.
- [ ] Redacts sensitive values when requested.

Machine-readable ACC v1 inputs and abstract expected outcomes are available in [v1/README.md](v1/README.md). They complement this checklist; they do not create an official certification program.

## Claim Language

Recommended wording:

```text
This project implements ACC v1 OpenAPI declarations.
```

Avoid:

```text
This project is officially ACC certified.
```

There is no certification program until one is explicitly published by the ACC maintainers.
