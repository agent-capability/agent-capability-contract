# ACC Conformance Checklist

This checklist is for runtimes, gateways, SDKs, and developer tools that want to claim ACC v1 compatibility.

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
- [ ] Evaluates `approval.when` against invocation arguments.
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
