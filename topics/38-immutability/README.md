# 38 — Immutability helpers

> The built-in `Readonly<T>` and `Partial<T>` only go **one level deep** —
> nested objects stay mutable. Real-world configs, ASTs, and Redux state want
> *deep* immutability. This topic rebuilds the three recursive mapped types
> every TS utility library ships: `DeepReadonly`, `DeepPartial`, and the
> inverse direction `Mutable<T>` (a.k.a. `Writable<T>`).

## TL;DR

- A recursive mapped type calls **itself** in the body: `{ readonly [K in keyof T]: DeepReadonly<T[K]> }`.
- Recursion must **terminate** at primitives and **short-circuit** at types
  where diving deeper is wrong (functions, dates, regexes…).
- Arrays need their own `T extends readonly unknown[]` branch so tuples keep
  their length and element order instead of collapsing to `{}`.
- `-readonly` (Topic 11) is the operator that powers `Mutable`/`Writable`.

## Learning objectives

After this topic you can:

- Write a recursive mapped type and explain *why* it terminates.
- Distinguish the array branch from the object branch and justify the
  `| readonly unknown[]` guard.
- Strip `readonly` recursively with `DeepMutable`.
- Predict where a naive `DeepReadonly` would corrupt a function or `Date`.

## Sub-exercises

1. `01-deep-readonly` — recursive `DeepReadonly<T>`; functions left as-is;
   arrays handled via `readonly unknown[]`.
2. `02-deep-partial` — recursive `DeepPartial<T>`; same termination rules.
3. `03-mutable-writable` — shallow `Mutable<T>`/`Writable<T>` (strip
   `-readonly`), then the deep variant `DeepMutable<T>`.

## Resources

- TypeScript Handbook — *[Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)* (recursion in the body).
- type-challenges — *`DeepReadonly`* (medium) and *`DeepMutable`* (medium).
- Type-Level TypeScript — *"Recursive Types"* chapter.
- TS Team, `Readonly<T>` source — the one-level original these extend.
