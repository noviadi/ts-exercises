# 03 — `keyof` & indexed access types

> Once you can ask TypeScript *"what keys does this type have?"* and *"what's
> the type of THIS key?"*, you can build `Pick`, `Partial`, `Record`, getters,
> and most of the standard utility types — by hand.

## TL;DR

```ts
type User = { id: number; name: string };

type K = keyof User;            // "id" | "name"      ← keyof
type N = User["name"];          // string             ← indexed access
type V = User["id" | "name"];   // number | string    ← union key lookup
function get<T, K extends keyof T>(o: T, k: K): T[K] { return o[k]; } // ← the idiom
```

- `keyof T` produces the **union of keys** of `T`.
- `T[K]` is **indexed access** — the type of the property at key `K`.
  `K` may be a single literal or a whole union.
- `K extends keyof T` is the **constraint** that ties a type parameter to "a
  real key of `T`", so `get(u, "name")` returns `string` and `get(u, "nope")`
  is a compile error.

## Learning objectives

After this topic you can:

- Read and write `keyof T` and `T[K]` fluently.
- Use a **union key** to extract several property types at once.
- Constrain a generic `K` with `extends keyof T` and explain *why* the
  constraint makes lookups sound (so `T[K]` is well-defined).

## Sub-exercises

1. `01-keyof-indexed-basics` — `keyof T`, `T[K]`, and the typed `get`.
2. `02-lookup-and-constraint` — union-key lookups, the `K extends keyof T`
   constraint, and a real event-map example.

## Resources

- TypeScript Handbook —*[ Indexed Access Types ](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)*.
- TypeScript Handbook —*[ Keyof Type Operator ](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)*.
- TypeScript Handbook —*[ Generic Constraints ](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)* (the `extends keyof` idiom).
- type-challenges — `Pick` / `Get` / `MyPick` "Easy" puzzles.
