# Security Policy

## Supported Versions

Security-related corrections are maintained for the latest public ACC v1 release
and the current `main` branch. Older snapshots, forks, and independent
implementations may require their own fixes.

## Reporting A Vulnerability

Do not open a public issue when a report includes an exploit, undisclosed
security impact, credentials, private deployment details, or sensitive evidence.

Use this repository's private
[vulnerability reporting](https://github.com/agent-capability/agent-capability-contract/security/advisories/new)
channel instead.

Include, when applicable:

- the affected specification version, commit, schema, vector, or reference tool;
- a minimal reproduction or counterexample;
- the security invariant that may be violated;
- the likely impact on conforming parsers, generators, runtimes, or policy tools;
- sanitized logs or artifacts with all secrets and business data removed.

We aim to acknowledge a complete report within 3 business days. This project
does not currently operate a paid bug bounty program.

## ACC Security Scope

Reports appropriate for this repository include:

- normative ambiguity that can cause independent conforming implementations to
  make materially different security decisions;
- a schema or reference-validator bypass that accepts a declaration forbidden by
  the normative specification;
- unsafe behavior in repository-maintained conformance scripts or reference
  tooling;
- integrity or supply-chain issues in artifacts published by this repository.

Vulnerabilities in a specific ACC implementation belong to that implementation's
security channel unless the root cause is a portable ACC semantic defect.
Business authorization, tenant isolation, identity resolution, approval
workflows, and deployment policy remain responsibilities of their owning
systems, as described in the ACC design boundaries.

Ordinary hardening ideas, non-sensitive specification questions, and proposal
discussions may use public Issues or the proposal process.

## Disclosure And Credit

After a report is triaged, maintainers will coordinate a correction and public
disclosure when one is required. Normative changes still follow ACC governance
and compatibility rules. Reporter credit is preserved unless anonymity is
requested.
