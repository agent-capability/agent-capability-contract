# Contributing

ACC is a contract. Changes should prioritize compatibility, clarity, and implementation neutrality.

Normative field or behavior proposals should follow the public process in [proposals/README.md](proposals/README.md) and begin from [proposals/TEMPLATE.md](proposals/TEMPLATE.md).

## What Belongs In ACC

Good candidates:

- portable governance fields;
- behavior that can be implemented by multiple runtimes;
- behavior that can be tested by a conformance checklist;
- clarifications that make implementations more consistent;
- examples that teach safe integration patterns.

Poor candidates:

- implementation-specific table names, console UI fields, or deployment assumptions;
- business-specific approval workflows;
- provider-specific model behavior;
- fields that duplicate binding-native request or response schemas;
- fields that silently change security behavior without testable semantics.

## Change Process

For wording and examples:

1. Update the relevant markdown file.
2. Keep terminology consistent with `SPEC.md`.
3. Add or adjust an example if the change affects implementers.

For schema or normative behavior:

1. Submit a proposal that explains the portable problem and why existing fields cannot solve it.
2. Complete layer-boundary, compatibility, security, and implementation-evidence review.
3. After acceptance, update `SPEC.md`.
4. Update `schemas/acc.v1.schema.json` if the field is machine-readable.
5. Add conformance notes.
6. Add an example.
7. Add a `CHANGELOG.md` entry.
8. Add machine-readable conformance vectors for portable parser or runtime behavior.

Submitting a proposal does not place it on the roadmap. Proposal authors may provide a self-assessment, but status is recorded through public governance review with rationale.

## Neutrality Review

Every contract, guidance, example, conformance, and registry change should answer:

1. Does this text work for an implementation with a different language, owner, architecture, storage model, and deployment topology?
2. Is every product-specific concept clearly labeled as an example rather than ACC behavior?
3. Are normative requirements separated from recommendations and optional platform features?
4. Can the behavior be tested without depending on one implementation's private state or UI?
5. Does the change preserve the boundary between ACC reach and business-system authority?
6. Would the same registry and contribution criteria apply to an unrelated implementation?

A proposal that fails this review belongs in implementation documentation, not ACC core.

## Compatibility Rule

ACC v1 should remain backward-compatible.

Do not change the meaning of an existing field in a patch or minor release. Add optional fields instead.

An optional field is not safely backward-compatible merely because an older parser ignores it. If the field affects exposure, approval, authority boundaries, or redaction, the proposal must show that ignoring it is fail-safe or provide a conservative fallback understood by older ACC v1 runtimes. Otherwise propose a new major compatibility family.

## Language

Use "agent" for the actor that may call a business capability.

Use "model" only when specifically discussing model selection, model output, or model-readable guidance.

Use implementation names only when discussing a concrete implementation, not when defining ACC itself.
