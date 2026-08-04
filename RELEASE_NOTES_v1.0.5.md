# ACC v1.0.5

ACC v1.0.5 is a compatible security-clarification and conformance-coverage
release for the ACC v1 declaration family.

## Contract Version

ACC declarations continue to use:

```yaml
x-agent-capability:
  version: 1
```

This release adds no core field, changes no JSON Schema rule, and requires no
declaration migration.

## Per-Invocation Approval Boundary

`approval.when` conditions evaluate one invocation at a time. They do not
express aggregate, rolling-window, cross-invocation, or sequence constraints.
A threshold such as `amount > 1000` therefore does not prevent multiple smaller
operations from creating a larger cumulative effect.

Deployments whose risk model includes cumulative effects must enforce those
constraints in the authoritative business or policy layer. The implementer's
guide includes a concrete decomposition example and preserves ACC's boundary
between portable declaration semantics and stateful business policy.

## Operator Semantics

The specification now states explicitly that:

- `in` requires an array comparison value and uses strict JSON equality;
- string `contains` uses substring matching;
- array `contains` uses strict JSON equality for elements;
- `exists` matches only a resolved, non-null JSON value.

These statements codify the existing reference-oracle behavior so independent
runtimes do not interpret the same declaration differently.

## Conformance Coverage

The reference corpus expands from 18 to 26 vectors. New vectors cover positive
and negative behavior for `in`, string and array `contains`, and present,
missing, and explicit-null `exists` inputs.

Passing the corpus remains reference evidence rather than official
certification.

## Continuous Integration

Repository checks, conformance vectors, and automated tests now run for pushes
and pull requests through a minimal read-only GitHub Actions workflow.
