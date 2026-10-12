# ACC Repository Security Self-Assessment

This maintainer analysis follows the [OpenSSF written self-assessment outline](https://github.com/ossf/security-assessments/blob/main/guidance/self-assessment/template/self-assessment.md) for
the specification and reference-tooling repository. It is not an independent
audit, an implementation certification, or a claim that every OSPS requirement
passes. ACC declarations describe governance intent; they do not execute or
authorize business operations.

## Metadata

| Item | Assessment |
| --- | --- |
| Assessment stage | Complete written self-assessment of the scope below; control coverage and remediation remain partial. |
| Assessment date | 2026-10-12 |
| Software | [Agent Capability Contract](https://github.com/agent-capability/agent-capability-contract) |
| Source baseline | `28e91131e441005acad5d4557fa3e7d4b4afce3a`; specification/package revision 1.0.5, declaration family `version: 1`. |
| Security provider | Yes: security-relevant capability declarations and authoring validation, without runtime enforcement. |
| Languages and platform | Markdown, JSON Schema, YAML, JavaScript, Python; authoring package requires Node.js >=20. |
| Dependency inventory | [package-lock.json](package-lock.json) and [package.json](package.json). These are dependency inventory, not a generated SPDX/CycloneDX SBOM. |
| Assessor | Repository maintainer identified in [GOVERNANCE.md](GOVERNANCE.md). |

### Security links

[Security policy](SECURITY.md), [governance](GOVERNANCE.md),
[contribution process](CONTRIBUTING.md), [Security Insights](security-insights.yml),
[design boundaries](DESIGN_RATIONALE.md),
[safety responsibilities](SAFETY_GOVERNANCE_GUIDE.md),
[profiles](conformance/PROFILES.md), [vectors](conformance/v1/README.md),
[implementation claim template](conformance/SELF_ASSESSMENT.md) and
[authoring quickstart](QUICKSTART.md).

## Overview

ACC is an implementation-neutral capability declaration contract for agents
interacting with existing business APIs. This assessment covers the normative
specification, bindings, JSON Schema, conformance vectors, examples, repository
checks and reference OpenAPI authoring validator in this repository.

### Background

An API may be syntactically callable while its scope, acting-subject requirement,
risk, approval intent or sensitive fields are unclear. ACC makes those
statements explicit and portable. A declaration is not proof that its author is
trusted, that its description matches the deployed endpoint, or that a runtime
correctly enforces it. The business system retains final authority.

### Actors and isolation

- Maintainers and contributors change normative documents, schemas, vectors and
  reference tools through the repository process.
- Declaration authors supply OpenAPI documents and associated local references.
  Those documents can be untrusted input to the authoring validator.
- The CLI/library parses local documents and checks the declared extension. It
  runs with the invoking user's filesystem privileges; it is not a sandbox.
- Independent parsers, generators, runtimes and policy systems consume ACC under
  their own trust and authorization boundaries. They are not components managed
  by this repository.
- Package registries and repository CI are supply-chain dependencies. A corrupt
  schema, package or release can mislead multiple independent consumers.

The specification and its validator are not mutually isolated security domains.
A trusted reference tool helps author a declaration; using it does not make an
untrusted service authoritative. No business credentials, customer database,
model gateway, payment executor or hosted multi-tenant service is operated by the
contract itself.

### Actions and data flow

1. An author selects an operation and writes the `x-agent-capability` declaration
   alongside its OpenAPI inputs.
2. The CLI reads the explicitly provided local file, parses YAML/JSON, resolves
   supported local references and validates ACC fields and input conditions.
   URL/scheme-based references are refused rather than fetched. Cyclic references
   are diagnosed. Local references remain filesystem reads under caller rights.
3. The tool produces diagnostics; it does not call the business endpoint, submit
   approvals, execute a tool or establish a subject's business permission.
4. Repository checks compare documents, schema, examples and conformance vectors.
   Independent implementations then assess their own applicable profile and
   actual runtime behavior, without receiving certification from this repository.

### Goals

Keep declarations portable and explicit; preserve the business authority
boundary; prevent schema/reference-tool divergence from normative semantics;
make unknown-field and version compatibility rules reviewable; and retain
repeatable conformance examples and honest claim language.

### Non-goals

ACC does not authenticate users, establish tenant isolation, decide business
permission, implement approval workflows, execute operations, compare business
truth across sources, orchestrate agent work or guarantee model correctness. The
authoring validator is not a full OpenAPI linter or a runtime conformance test.
Registry inclusion is not certification, endorsement or production readiness.

## Self-assessment use

This repository-scoped maintainer analysis gives adopters an initial view of
security assumptions, evidence and gaps. It is not an external attestation.
Implementation self-assessments under `conformance/` address ACC claim profiles;
this document addresses repository security. One does not replace the other.
Normative revisions, validator behavior, dependencies and release changes should
trigger review of this assessment.

## Security functions and features

### Critical components and threat analysis

| Threat | Existing design or evidence | Remaining boundary or risk |
| --- | --- | --- |
| A declaration is mistaken for business authority | Explicit reach/authority boundary and role ownership in the specification, rationale and safety guide. | Each runtime and receiving API must bind identity and enforce its own permission; a valid document cannot grant it. |
| Schema or validator accepts a forbidden declaration | Versioned JSON Schema, authoring diagnostics, examples, tests and reference vectors. | Reference tests are finite; novel counterexamples or implementation differences require review. |
| A new security field is ignored unsafely | Governance requires an equally safe/conservative fallback or a major compatibility boundary. | Older or nonconforming consumers must be assessed separately; parseability alone does not prove safe behavior. |
| An untrusted file causes unwanted reference fetching | The reference validator rejects scheme-based references, detects reference cycles and reports supported local resolution. | Local paths can refer beyond the starting directory; there is no filesystem sandbox or established hostile-input resource-limit guarantee. |
| Package or specification substitution | Tagged revisions, lockfile, repository checks, documented release/versioning rules and fixed Action references. | Consumers must verify the artifact and exact revision; this assessment does not establish universal signed provenance. |
| A registry entry implies unearned trust | Registry and governance distinguish evidence-backed claims from certification and endorsement. | A listed implementation's behavior and operating security remain independently accountable. |

### Security-relevant configuration

Run the authoring tool with only the filesystem access required for the input,
and use suitable resource isolation when processing hostile or very large
sources. Keep credentials and production customer data out of examples and
reports. Independent implementations must define which declarations they trust,
which capabilities they expose, what current subject is bound and how approval
and redaction are enforced. ACC metadata is not a substitute for those controls.

## Project compliance

No PCI-DSS, ISO, GDPR, CRA certification, independent security audit or OpenSSF
Best Practices badge is claimed. ACC profile conformance and repository security
are different evaluation questions.

The initial 2026-10-10 [Baseline run](https://github.com/agent-capability/agent-capability-contract/actions/runs/38016769353)
collected `osps-baseline-2026-08` Maturity Level 1 requirements: 20 Passed,
0 Failed, 3 Needs Review, 1 Not Applicable and 41 Not Run (65 total). A green
collection workflow does not mean all controls passed. The collection level does
not settle final maturity or the applicability of untested requirements. Manual
administrative evidence does not rewrite the scanner's original results.

## Secure development practices

### Development pipeline

[GOVERNANCE.md](GOVERNANCE.md) and [CONTRIBUTING.md](CONTRIBUTING.md) define
maintainer responsibility, neutral normative review, semantic versioning and the
proposal process. Current branch protection requires Check, rejects force pushes
and deletion, and applies to administrators. Required approving reviews are zero;
this is single-maintainer stewardship without an independent two-person human
review gate. Signed commits are not universally required by the documented
workflow. Normative compatibility needs semantic review even when tests pass.

[CI](.github/workflows/check.yml) installs from the lockfile, audits dependencies,
and runs documentation/schema, conformance and reference-tool tests. Actions are
pinned to full commit identifiers and checkout does not persist credentials.
Secret scanning, push protection and dependency alerts were verified enabled;
they do not prove that every secret or security issue has been detected.

[Baseline evaluation](.github/workflows/osps-baseline.yml) uses the Privateer
GitHub scanner v0.31.0 at a fixed image digest with a read-only token, weekly
scheduling and manual dispatch. Results are retained as workflow artifacts for
14 days. A manual run is observed; the first scheduled run was not observed at
the 2026-10-12 assessment check. This assessment did not trigger a new scan.

The npm authoring package has an explicit `files` allowlist. Repository security
self-assessment and Security Insights remain repository governance metadata,
excluded from the runtime/tool package. No container image release is defined by
this repository's current release workflow; independent consumers' containers
are outside scope. This assessment changes no specification version, schema,
vector, dependency or release artifact.

### Communication and ecosystem

Routine questions, changes and proposals use repository Issues and pull requests.
Sensitive findings use GitHub private reporting. Maintainer-led security
coordination is documented; a separately staffed security team or incident
hotline is not. Tags, release notes and coordinated advisories communicate
corrections. ACC is usable by independent gateways, SDK generators and agent
runtimes; compatibility or an implementation listing does not establish customer
adoption or extend this repository's security review to those implementations.

## Security issue resolution

### Responsible disclosure and vulnerability response

[SECURITY.md](SECURITY.md) covers normative ambiguity, schema/validator bypass,
unsafe reference tooling and artifact integrity. It asks for the affected
revision, a minimal counterexample, the violated invariant, likely impact and
sanitized evidence through the private reporting channel. The maintainer targets
acknowledgement of complete reports within three business days, then coordinates
correction, disclosure and credit unless anonymity is requested. Latest ACC v1
and main are maintained; older forks and implementations may require their own
fixes. No paid bounty or guaranteed resolution time is claimed.

### Incident response

For a confirmed defect, identify whether the root cause is portable semantics or
an implementation-specific failure, preserve a minimal sanitized reproduction,
identify affected revisions/consumers and prepare corrected documentation,
schema, vectors or tooling with regression coverage. Apply the governance
compatibility rules and publish migration/disclosure guidance as needed.
Implementation incidents go to their owning security channel unless a portable
ACC defect is involved. These are responsible response steps; an exercised
incident program, staffed on-call coverage and recovery-time objective have not
been established by this assessment.

## Appendix

### Known issues and gaps

The initial scan has no recorded Failed requirement, but three requirements need
manual administrative review and 41 were not run. This is not proof of absence
of vulnerabilities. Independent review, more hostile-input/resource tests,
generated SBOM and comprehensive release-signature/provenance evidence remain
areas needing further evidence. The validator's documented refusal of remote
references does not constrain every independent ACC consumer.

Review the assessment after normative/schema changes, new bindings, changes to
reference resolution or input handling, dependency updates, maintainer access
changes and release-policy changes. Retain scan evidence before its artifact
retention expires. Resolve untested applicability rather than converting
Not Run into Passed or into an automatic product defect.

### Best practices

Policies and repository checks support a foundation for OpenSSF practices, but
no full Baseline compliance or Best Practices badge is asserted. Any external
recognition requires its own actual criteria and review.

### Illustrative use cases

1. An API author marks an order-read operation as readonly with a required acting
   subject. The tool checks the declaration; the deployed API still authenticates
   the call and verifies current business permission.
2. A runtime reads high-risk approval intent and freezes its own approval request.
   ACC supplies the declaration, while the runtime and business system enforce
   the state transition and actual action.
3. An independent generator checks local OpenAPI references and emits capability
   metadata. Valid output is not evidence that an endpoint or runtime safely
   implements every relevant ACC profile.

These are design examples, not claims of deployed customer use.

### Related projects

BailingHub and other runtimes may implement ACC independently. They do not own
privileged normative behavior or receive security endorsement from listing.
OpenAPI carries the first binding; ACC does not replace its general validation.
MCP transports and policy/approval engines have separate responsibilities as
explained in [LANDSCAPE.md](LANDSCAPE.md) and the design rationale.
