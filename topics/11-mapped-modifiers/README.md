# 11 — Mapped type modifiers (`+`/`-`)

> A mapped type `{ [K in keyof T]: ... }` rewrites each property of `T`. But
> what about the **modifiers** — `readonly` and `?` (optional)? By default a
> mapped type *keeps* the modifiers from the source. To add or remove them you
> use the `+`/`-` modifier operators: `+readonly`, `-readonly`, `+?`, `-?`.

## TL;DR

- `{ -readonly [K in keyof T]: T[K] }` → strips `readonly` from every key.
- `{ [K in keyof T]-?: T[K] }` → strips optionality (`?`) from every key.
- `+` is the default (so `+readonly` ≡ `readonly`, `+?` ≡ `?`); `-` is the new bit.
- These are exactly the mechanism behind the built-in `Mutable<T>` / `Writable<T>`
  and `Required<T>` helpers.

## Learning objectives

After this topic you can:

- Read and write the four modifier operations (`+readonly`, `-readonly`, `+?`, `-?`).
- Hand-build `Required<T>` (strip `?`) and `Mutable<T>` / `RemoveReadonly<T>`
  (strip `readonly`) from first principles.
- Explain why `-?` is the only way to *force* a property to be required, and why
  plain `T[K]` would *not* remove the `?`.
- Combine multiple modifiers in one mapped type.

## Sub-exercises

1. `01-add-remove-readonly` — `+readonly` vs `-readonly`; build `Freeze` and
   `Mutable` from scratch.
2. `02-required-and-strip-optionality` — `+?` vs `-?`; build `Required<T>` by
   hand, and combine `-readonly` + `-?` for a fully "bare" shape.

## Resources

- TypeScript Handbook — *[Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)* (the *Mapping Modifiers* section).
- TypeScript Handbook — *[Type Manipulation > Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers)*.
- type-challenges — the `Mutable` / `Required` "medium" puzzles.
- Total TypeScript — the deep dive on `-?` and why it is needed.
