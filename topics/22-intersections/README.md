# 22 — Intersection types & merging

> `A & B` is the type of values that satisfy BOTH `A` AND `B`. Members are
> merged (union of requirements), and when two members conflict on a property's
> TYPE, that property collapses to `never`. Intersections behave quite
> differently from `interface extends`, and the rule is subtle for functions.

## Learning objectives

After this topic you can:

- Predict the shape of `A & B` for object types, including overlapping keys.
- Explain why `{ a: string } & { a: number }` produces `a: never`, and why the
  equivalent `interface extends` instead overrides (last-wins) — not `never`.
- State the function-intersection rule: parameters become intersections
  (contravariance), so `(x: A) => void & (x: B) => void` accepts `A & B`.

## Sub-exercises

1. `01-merge-semantics` — how `A & B` merges members and identical-type props.
2. `02-conflicts-and-functions` — conflicting prop types collapse to `never`;
   intersections vs `interface extends`; intersecting functions.

## Resources

- TypeScript Handbook —*[Intersection Types](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#intersection-types)*.
- TypeScript Handbook —*[Interfaces vs Intersection Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-interface-and-type)*.
- TypeScript Handbook —*Function compatibility / parameter bivariance* (Topic 36
  covers variance in depth; here we touch just the intersection-of-params rule).
- type-challenges — many "Merge" / "Combine" puzzles hinge on these rules.
