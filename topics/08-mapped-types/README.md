# 08 — Mapped types

> A **mapped type** is a type-level `for` loop over the keys of another type:
> `{ [K in keyof T]: F<T[K]> }`. It is the engine behind `Partial`,
> `Readonly`, `Pick`, and `Record` — all of which you can (and will) rebuild by
> hand here.

## Learning objectives

After this topic you can:

- Read and write the `{ [K in keyof T]: ... }` syntax fluently.
- Re-implement `Partial`, `Readonly`, `Pick`, and `Record` from first
  principles and explain why they are *homomorphic* (they preserve the
  `readonly` / `?` modifiers of the source).
- Predict, by eye, the output type a mapped type produces for a given input.
- Distinguish a *homomorphic* mapped type (iterates `keyof T`) from a
  non-homomorphic one (iterates an arbitrary `K`), and know why the former
  preserves modifiers.

## Sub-exercises

1. `01-mapped-basics` — `{ [K in keyof T]: F<T[K]> }`: build `MyReadonly`,
   `MyPartial`, `Stringify`, `Nullable`.
2. `02-pick-record-homomorphic` — rebuild `Pick` and `Record`, and observe
   how a homomorphic mapped type silently carries `readonly`/`?` along.

## Resources

- TypeScript Handbook — *[Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)*.
- TypeScript Handbook — *[Homomorphic mapped types](https://www.typescriptlang.org/docs/handbook/type-manipulation/mapped-types.html)* (in the "Mapping Modifiers" trail).
- type-challenges — the `Easy` set (`Partial`, `Readonly`, `Pick`, `Record`).
- Type-Level TypeScript — *"Mapped Types"* chapter.
