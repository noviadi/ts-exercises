# 41 — Type-level numbers via tuples

> TypeScript's type system has *no numbers* — there is no type-level `+` or `for
> i in 0..10`. But tuples *do* carry a literal `length`, and that is enough to
> encode the naturals and do arithmetic on them purely in types.

## TL;DR

Encode the natural number `N` as a **tuple of length `N`**:

```ts
type Zero = [];                 // 0
type One   = [...Zero, unknown]; // [unknown]        — 1
type Two   = [...One, unknown];  // [unknown, unknown] — 2
```

Then `Add` is tuple concatenation, `Inc`/`Dec` are push/pop, and `Length`
reads `T["length"]` — all at the type level, no runtime involved.

## Learning objectives

After this topic you can:

- Represent natural numbers as tuple *lengths* and explain why that works.
- Implement `Inc`, `Dec`, `Add`, `Length` as pure type aliases.
- Build a `Range<From, To>` of literal number types using a recursive helper.
- Reason about TypeScript's **recursion / instantiation-depth limit** and write
  type-level loops that stay under it (≈ 1000 practical ceiling).

## Sub-exercises

1. `01-inc-dec-add-length` — encode naturals as tuples; implement `Inc`, `Dec`,
   `Add`, `Length` and prove them with `expectTypeOf`.
2. `02-range-recursion-limit` — a `BuildTo<N>` counter and a `Range<From, To>`
   of literal numbers; what blows up the compiler and how to stay safe.

## Resources

- TypeScript Handbook — *[Tuple types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)* and
  *[Conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)*.
- type-challenges — the `Range` and `TupleToUnion`-style puzzles.
- Type-Level TypeScript — *Recursion* and *Type-level programming* chapters.
- TypeScript repo / release notes — the `10000`-element tuple cap and the
  `Type instantiation is excessively deep` diagnostic.
