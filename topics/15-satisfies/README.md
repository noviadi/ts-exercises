# 15 — The `satisfies` operator

> `expr satisfies T` checks that `expr` is assignable to `T` **without widening**
> `expr`'s type. It is the "validate, but don't narrow" operator — the right
> tool whenever you want to enforce a shape while preserving literal types for
> later type-safe access.

## Learning objectives

After this topic you can:

- Explain the three ways to assert a value's relationship to a type:
  annotation `: T`, assertion `as T`, and `satisfies T` — and when each applies.
- Use `satisfies` to validate an object map against a constraint while each
  entry retains its narrow literal type.
- Recognise why `satisfies` is the modern default for "I want to check this,
  not retype it."

## Sub-exercises

1. `01-satisfies-vs-annotation` — `satisfies` vs annotation vs `as`; literal
   preservation.
2. `02-config-map` — the config-map pattern: `Record` of routes where each
   entry keeps its own discriminator literal.

## Resources

- TypeScript Handbook — [*The `satisfies` operator*](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) (TS 4.9 release notes).
- Total TypeScript — Matt Pocock's "Use `satisfies` over type annotations" guidance.
