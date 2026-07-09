# 13 — Variadic tuple types

> A **variadic tuple** is a tuple type that contains a **spread of a generic
> type parameter** that is itself constrained to be a tuple/array — e.g.
> `[...T, number]` where `T extends readonly unknown[]`. This is what lets you
> write generic helpers like `concat`, `push`, `unshift`, and `tail` with
> *precise* return types instead of `any[]`.

## TL;DR

- `[...T]` inside a tuple type splices `T`'s element types in place. When `T`
  is generic, TS reasons about the *shape* of the resulting tuple.
- The constraint `T extends readonly unknown[]` (or `T extends readonly any[]`)
  is the canonical "this must be an array/tuple" bound.
- `[...T, ...U]` — a tuple may contain at most ONE generic spread, OR if two
  spreads, the *last* one must be a "rest" element so TS can compute the prefix.
- This is exactly the mechanism behind typing `Array.prototype.concat` and
  building precise `push`/`unshift` helpers.

## Learning objectives

After this topic you can:

- Write a `concat<T extends readonly unknown[], U extends readonly unknown[]>`
  whose return type is the spliced tuple `[...T, ...U]`.
- Type `push` and `unshift` so that the returned tuple has the exact new length
  and element types.
- Compose prefix + suffix spreads and explain the "at most one generic spread
  in the middle" rule that TS enforces.

## Sub-exercises

1. `01-spread-in-tuples-concat` — `[...T, ...U]` and a properly typed `concat`.
2. `02-generic-push-unshift` — type `push` and `unshift` precisely; the
   `readonly unknown[]` constraint.
3. `03-prefix-suffix-composition` — `[A, ...T, B]` composition and why a
   "middle" generic spread is forbidden.

## Resources

- TypeScript Handbook —*[Release Notes > Variadic Tuple Types (TS 4.0)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)*.
- TypeScript Handbook — *[Type Manipulation > Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)* and the "Tuple inference" example.
- type-challenges — `Concat`, `Push`, `Unshift`, `Tail` puzzles.
- Mike Parker / TypeScript wiki — the original design discussion of variadic tuples.
