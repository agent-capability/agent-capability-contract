# ACC v1 Machine-Readable Conformance Vectors

Status: Reference conformance corpus

Specification release: 1.0.2

Declaration compatibility family: ACC v1

This directory publishes portable declaration inputs, core runtime outcomes, and OpenAPI-specific default cases for the ACC v1 OpenAPI Binding Parser and Runtime profiles. Core-only consumers may reuse the vectors whose inputs do not depend on `http_method` or another binding-native signal.

The vectors complement the human checklist in [../README.md](../README.md). They do not prescribe an implementation API, database, queue, approval UI, logging backend, or hash algorithm, and passing them is not official certification.

## Files

- `vectors.schema.json`: schema for the corpus format.
- `vectors.json`: versioned parser and runtime cases.
- `../../scripts/check-conformance.mjs`: reference oracle used to verify that the corpus is internally consistent.

## Abstract Kinds

| Kind | Portable observation |
|---|---|
| `declaration` | Whether the ACC object is structurally valid and whether its major version is supported. |
| `exposure` | Whether a capability may be exposed for the supplied scope policy and trusted-subject availability. |
| `approval` | Whether valid invocation arguments allow execution, require approval, or must be rejected. |
| `risk-default` | The effective ACC risk when it is explicit or inferred from method and readonly hint. |
| `audit-hint` | Whether the broad ACC sensitivity hint is present. |

## Using The Corpus

An implementation may write an adapter that:

1. reads each vector applicable to its claimed Profile;
2. maps the abstract input into its public parser or runtime interface;
3. observes the abstract outcome;
4. compares it with `expected`;
5. publishes the ACC release, implementation version, passed vectors, skipped vectors, and known limitations.

Diagnostics may use implementation-specific wording. The corpus compares portable categories and decisions, not private error messages.

## Security Scope

The corpus deliberately avoids product-specific behavior. For example, approval evidence must remain bound to the reviewed capability and arguments, but ACC does not require one hash algorithm or persistence model. Such invariants belong in portable behavior vectors only after they are normative in [../../SPEC.md](../../SPEC.md).
