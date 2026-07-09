# 17 — Assertion functions

> An **assertion function** is a function that *throws* if a condition is false,
> and tells the type system about it. Unlike a type-guard predicate (`x is T`),
> which narrows only inside the `if (guard(x))` branch, an assertion function
> narrows the variable **for the rest of the current scope** after the call —
> because control cannot continue past it unless the assertion held.

## Learning objectives

After this topic you can:

- Distinguish the two assertion signatures: `asserts x` (just "truthy /
  non-nullish, throws otherwise") and `asserts x is T` (narrows to `T`).
- Explain why `asserts` mutates control flow *in place* (no `if` needed),
  unlike `x is T` which only narrows inside a branch.
- Build `assertDefined` / `assertNonNull` helpers and read off the narrowing
  they induce via `expectTypeOf<typeof x>`.
- Recognise that, like custom guards, assertion functions are *trusted* by the
  compiler — the body is not verified against the declared assertion.

## Sub-exercises

1. `01-asserts-is` — the `asserts x is T` form; how it narrows `unknown`/`T | null`
   to `T` after the call site.
2. `02-asserts-truthy` — the bare `asserts x` form (`assertDefined` /
   `assertNonNull`); the control-flow difference vs a plain predicate.

## Resources

- TypeScript Handbook — [*Assertion functions*](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions).
- TypeScript Handbook — [*Narrowing*](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) (compare with `using type predicates`).
- TypeScript PR — [`asserts` condition types](https://github.com/microsoft/TypeScript/pull/32695).
- Total TypeScript — material on narrowing and the `asserts` keyword.
