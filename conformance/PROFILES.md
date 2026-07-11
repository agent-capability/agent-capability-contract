# ACC Conformance Profiles

Status: Non-normative claim framework
Applies to: ACC v1

Profiles let implementations make precise compatibility claims without pretending that every parser, generator, gateway, and runtime has the same responsibilities. Profiles do not add semantics to ACC; they group existing requirements from [../SPEC.md](../SPEC.md) and [README.md](README.md).

## 1. Claim Format

Recommended public wording:

```text
Implements the ACC v1 Parser Profile.
Implements the ACC v1 Generator Profile.
Implements the ACC v1 Runtime Profile.
Implements the ACC v1 Policy Component Profile for: risk, approval, audit.
```

An implementation should include:

- the ACC major version;
- the claimed profile;
- a dated self-assessment;
- evidence links;
- unsupported optional fields or known limitations.

Do not use `ACC certified` or imply review by an independent certification body.

## 2. Parser Profile

For libraries or tools that read ACC declarations.

Minimum behavior:

- reads `x-agent-capability` from OpenAPI operation objects;
- validates required fields and supported versions;
- preserves standard OpenAPI parameter and request-body schemas;
- validates typed `approval.when` references when that field is supported;
- ignores unknown ACC fields safely;
- preserves non-ACC extensions without giving them implicit security meaning;
- emits diagnostics for invalid or unsupported declarations.

A parser does not claim to enforce runtime governance.

## 3. Generator Profile

For SDKs, annotations, code generators, or authoring tools that produce ACC declarations.

Minimum behavior:

- emits declarations that validate against the ACC v1 schema;
- emits `version`, `enabled`, and a non-empty `scope`;
- keeps business parameters in standard OpenAPI schemas;
- emits typed parameters for every generated `approval.when.param`;
- preserves strict JSON value types in generated conditions;
- does not generate unknown fields that silently change ACC security behavior;
- identifies the ACC version used by generated artifacts.

A generator does not claim that a downstream runtime enforces the generated metadata.

## 4. Runtime Profile

For runtimes, control planes, or gateways that expose and invoke ACC-declared capabilities.

Minimum behavior:

- satisfies the Parser Profile or consumes equivalent validated artifacts;
- applies exposure semantics for `enabled`, `scope`, and trusted-subject availability;
- applies safe risk defaults;
- evaluates `approval.required` and `approval.when` before invocation;
- validates arguments against standard OpenAPI schemas without implicit JSON type coercion;
- maps timeout and rate-limit hints to documented runtime policy;
- preserves the boundary between capability reach and final business authorization;
- prevents model-controlled input from overriding governance metadata;
- records capability, governance decision, result/failure summary, and requested redaction;
- emits diagnostics for skipped or unsupported declarations.

The Runtime Profile does not require an LLM, UI, database, queue, signature algorithm, cost system, or approval product.

## 5. Policy Component Profile

For components that evaluate a documented subset of ACC on behalf of another runtime, such as a gateway plugin or policy engine.

The claim must name every supported area, for example:

```text
Implements the ACC v1 Policy Component Profile for risk, approval, and audit.
```

Minimum behavior:

- documents which ACC fields it consumes and which component supplies the remaining lifecycle;
- follows the same field semantics and type rules as ACC v1;
- fails safely when required context is missing;
- does not claim full Runtime Profile compatibility;
- publishes integration evidence showing where its decision is enforced.

## 6. Evidence Levels

Self-assessments may provide:

| Evidence | Meaning |
|---|---|
| Documentation | Public explanation of supported fields and limitations. |
| Examples | Reproducible ACC inputs and resulting artifacts or decisions. |
| Tests | Automated tests linked to checklist items. |
| Interoperability | Evidence that declarations produced or consumed by another implementation behave consistently. |

Evidence depth may vary, but unsupported behavior must not be hidden.

## 7. Version Maintenance

A profile claim applies only to the named ACC version. Implementations should reassess when ACC adds normative behavior that affects the profile and should update or remove stale registry entries.
