# 07 — Distributive conditional types

> When the type parameter on the left of `extends` is **naked** (used by
> itself, not wrapped in something), a conditional type *distributes* over
> unions: it runs once per union member and unions the results back together.
>
> ```ts
> type ToArray<T> = T extends unknown ? T[] : never;
> //   ToArray<"a" | "b">  ===  "a"[] | "b"[]   (distributed!)
> ```
>
> This is *why* `Exclude`, `NonNullable`, and friends filter unions. It is
> also the #1 source of "why did my conditional return a union?" surprises, so
> there's a standard trick — wrap `T` in a one-tuple — to turn it off.

## Learning objectives

After this topic you can:

- Explain the **NakedTypeParam** rule and predict when distribution fires.
- Implement `ToArray<T>` (distributed) and reason about its output.
- Disable distribution with the `[T] extends [U]` tuple-wrapper trick.
- Choose, for a given utility, whether you want distribution on or off.

## Sub-exercises

1. `01-distribution-over-unions` — observe distribution; state the NakedTypeParam rule.
2. `02-disable-distribution` — the `[T] extends [...]` trick; non-distributing
   `Exclude`.

## Resources

- TypeScript Handbook — *[Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)*.
- TypeScript Handbook — *the `[T] extends [U]` idiom* (community-documented; see type-challenges discussions).
- type-challenges — `GetRequired`, `GetOptional`, and any puzzle that breaks
  because of accidental distribution.
