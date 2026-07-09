# 29 — `unique symbol`

> A plain `symbol` is a *wide* type: TypeScript knows only "this is some symbol"
> and treats every `symbol` value as interchangeable. A `unique symbol` is a
> *narrow, identity-bound* type — the type is pinned to one specific symbol
> instance. That single distinction is what makes TypeScript-brand nominal typing
> possible.

## TL;DR

- `Symbol()` returns the wide `symbol` type. Two calls are mutually assignable.
- `declare const s: unique symbol` binds `typeof s` to *that* symbol's identity.
- Two different `unique symbol` declarations are **not** equal types, even though
  both print as `unique symbol`.
- A `unique symbol` is the only kind of symbol you may use as a **computed
  property key inside a type** (`{ readonly [brand]: true }`) — a plain
  `symbol` is rejected there. This is the foundation of branded types (Topic 27).

## Learning objectives

After this topic you can:

- Explain *why* a plain `symbol` cannot distinguish two brands but a
  `unique symbol` can.
- Declare a `unique symbol` and use its type identity in `expectTypeOf` checks.
- Use a `unique symbol` as a symbol-keyed property in an object type.
- Build a nominal brand with a `unique symbol` key and prove it rejects
  cross-brand assignments at compile time.

## Sub-exercises

1. `01-unique-basics` — `unique symbol` vs plain `symbol`; symbol-keyed
   properties; identity comparisons.
2. `02-nominal-brand` — a `unique symbol` brand that makes `UserId` and `OrderId`
   mutually incompatible despite both wrapping `number`.

## Resources

- TypeScript Handbook — *[Symbols](https://www.typescriptlang.org/docs/handbook/symbols.html)* and the `unique symbol` notes in *[Type Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)*.
- TypeScript Handbook — *[Nominal Typing techniques](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)* (branding pattern).
- Type-Level TypeScript — the chapter on nominal/branded types.
