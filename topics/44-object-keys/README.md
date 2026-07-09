# 44 — `Object.keys` typing & safe iteration

> `Object.keys` returns **`string[]`**, not `(keyof T)[]`. This is a deliberate
> (and well-intentioned) lie of omission in the standard library: TypeScript
> *cannot prove* that a runtime object carries only the keys its static type
> declares, so it conservatively widens to `string`. The cost is that iterating
> `Object.entries`/`Object.keys` over a typed object throws away everything you
> know about both the keys *and* the values. This topic rebuilds honest,
> precise helpers and confronts where they're still lying.

## Learning objectives

After this topic you can:

- Explain *why* `Object.keys` returns `string[]` and why "just make it
  `keyof T[]`" is unsound (extra enumerable properties, prototype pollution).
- Write typed `keys`/`entries`/`fromEntries` wrappers that restore precise key
  and value types — and know exactly which promise each cast is making.
- Reconstruct an **object type from a list of entry pairs** with a mapped type
  that preserves literal keys.
- Reason about value-type honesty: why `entries`'s value type is the *union*
  `T[keyof T]`, and how runtime narrowing restores per-key types.

## Sub-exercises

1. `01-typed-keys-entries` — the unsoundness demonstrated, plus a typed `keys`
   returning `Array<keyof T>` and `entries` returning
   `Array<[keyof T, T[keyof T]]>`, with runtime honesty checks.
2. `02-fromEntries` — a `fromEntries` that rebuilds an object type from entry
   pairs (literal keys preserved) via a recursive mapped type.

## Resources

- TypeScript Handbook —*[Iterating over Object Keys](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)* and the `Object.keys`/`Object.entries` lib signatures.
- Total TypeScript (Matt Pocock) — the well-known *"`Object.keys` returns `string[]`"* explainer.
- Microsoft/TypeScript issue [#26955](https://github.com/microsoft/TypeScript/issues/26955) — the long-standing discussion on `keyof T[]` vs `string[]`.
