# Contributing

ACC is a contract. Changes should prioritize compatibility, clarity, and implementation neutrality.

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
- fields that duplicate standard OpenAPI parameter schema;
- fields that silently change security behavior without testable semantics.

## Change Process

For wording and examples:

1. Update the relevant markdown file.
2. Keep terminology consistent with `SPEC.md`.
3. Add or adjust an example if the change affects implementers.

For schema or normative behavior:

1. Explain the problem and why existing fields cannot solve it.
2. Update `SPEC.md`.
3. Update `schemas/acc.v1.schema.json` if the field is machine-readable.
4. Add conformance notes.
5. Add an example.
6. Add a `CHANGELOG.md` entry.

## Compatibility Rule

ACC v1 should remain backward-compatible.

Do not change the meaning of an existing field in a patch or minor release. Add optional fields instead.

## Language

Use "agent" for the actor that may call a business capability.

Use "model" only when specifically discussing model selection, model output, or model-readable guidance.

Use implementation names only when discussing a concrete implementation, not when defining ACC itself.
