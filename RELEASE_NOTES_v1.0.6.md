# ACC v1.0.6

ACC v1.0.6 corrects the reference conformance checker and expands risk-default
coverage. It implements the already published OpenAPI binding precedence;
it does not change ACC Core semantics or require declaration migration.

## Reference Checker Correction

For an OpenAPI GET operation with explicit `execution.readonly: false` and no
`risk.level`, the effective default is `medium`. The previous oracle returned
`low` because its GET fallback overrode the explicit false value.

The checker now preserves three states: omitted, false, and true. Explicit
`risk.level` still takes precedence; GET supplies a readonly fallback only when
`execution.readonly` is omitted. This was already the binding rule.

## Coverage and Evidence

The original 26 vectors are preserved. Another 22 vectors complete a 24-case
risk matrix: GET/POST × readonly omitted/false/true × risk omitted/low/medium/high.
The corpus now contains 48 vectors. Regression tests check a fixed expectation
table and execute the real reference checker.

The original 26-vector pass did not exercise the erroneous combination.
Passing the expanded corpus establishes reference consistency, not production
runtime acceptance, independent interoperability, or certification.

## Upgrade Guidance

- Declarations continue to use `version: 1`; no field or schema rule changes.
- Implementers using the reference checker or copying its default-risk logic
  should update and test the explicit-false GET case through their own interface.
- Record the exact corpus tag, commit, or digest with implementation results.
- The npm authoring CLI has no behavioral change in this release. Its version
  and published documentation are aligned with the repository revision;
  updating that CLI is not a runtime security fix.
- This correction alone does not establish a vulnerability in any deployed
  runtime. Subject verification, approval completion, and final business
  authorization retain their existing implementation-specific evidence needs.

## Repository Dependency Maintenance

The locked transitive `fast-uri` dependency is updated from 3.1.8 to 3.1.9,
which addresses the URI-parsing advisories reported by the existing npm audit
gate. Direct dependency ranges and CLI source are unchanged. Existing consumers
with their own older lockfiles should review that dependency independently;
changing the ACC package version alone is not evidence that a consumer's lockfile
has been refreshed.

The release also retains the documentation, conformance-evidence indexes,
business examples, and repository-security improvements already published on
the default branch since v1.0.5. It does not adopt experimental contract fields
or pending research proposals.
