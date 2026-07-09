# 12 — Tuples & readonly tuples

> A **tuple** is an array with a *fixed* length and a per-position type. It's
> the type-level way to say "this array is exactly N elements long, with these
> specific element types at each position". `[string, number]` is *not* the same
> type as `string[] | number[]` — the length is part of the type.

## TL;DR

- `[A, B, C]` is a 3-element tuple; `A[]` is a variable-length array. The
  tuple's `.length` is the literal type `3`, not `number`.
- **Labeled tuple elements** — `[first: string, second: number]` — give the
  positions names that show up in errors and IntelliSense (the labels do NOT
  become runtime properties).
- A `readonly` tuple (`readonly [A, B]`) cannot be assigned to a mutable
  `[A, B]`, and a `readonly` tuple is what `as const` produces.
- `as const` on an array literal freezes it into the narrowest possible
  `readonly` tuple of literal types.

## Learning objectives

After this topic you can:

- Choose between a tuple and an array based on whether length is fixed.
- Read and write labeled tuple types and explain why labels are purely cosmetic.
- Distinguish `readonly` tuples from mutable arrays and predict assignments
  between them.
- Predict the exact type produced by `as const` on an array/object literal.

## Sub-exercises

1. `01-fixed-length-and-labels` — fixed length, labeled elements, the `length`
   literal type, and the readonly-tuple vs mutable-array assignability rules.
2. `02-as-const-readonly-tuples` — `as const` widening vs narrowing, and how it
   turns an array literal into a `readonly` tuple of literal types.

## Resources

- TypeScript Handbook — *[Everyday Types > Tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)*.
- TypeScript Handbook —*[Type Manipulation > Tuples](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)* (`as const` release note).
- Total TypeScript — the "tuple types" and "as const" explainers.
