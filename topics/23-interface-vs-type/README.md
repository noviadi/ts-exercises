# 23 — Interface vs alias & declaration merging

> `interface` and `type` overlap *a lot*, but they are not interchangeable.
> Each has a power the other lacks. Knowing which tool reaches for means you
> write types that compose cleanly instead of fighting the compiler.

## TL;DR

- **`interface`** uniquely supports **declaration merging** (two declarations of
  the same name become one) and **`extends`** of other interfaces (a clean,
  nominal-feeling inheritance story).
- **`type`** uniquely supports **unions**, **intersections**, **tuples**,
  **mapped/conditional types**, and **recursion** — none of which `interface`
  can express on its own.
- Rule of thumb: reach for `type` by default; reach for `interface` when you
  specifically need merging or want library consumers to be able to augment a
  shape (e.g. extending a framework's types).

## Learning objectives

After this topic you can:

- Demonstrate **declaration merging** of two interfaces with the same name.
- Explain when `interface extends` is more ergonomic than an intersection.
- Express a union, a recursive type, and a mapped type — and explain why only
  a `type` alias can do each.
- Choose between `interface` and `type` deliberately, not by habit.

## Sub-exercises

1. `01-declaration-merging` — where `interface` wins: merging + `extends`.
2. `02-type-alias-powers` — where `type` wins: unions, recursion, mapped types.

## Resources

- TypeScript Handbook —*[Everyday Types: Differences Between Type Aliases and Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)*.
- TypeScript Handbook —*[Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)*.
- Total TypeScript — Matt Pocock's guidance on "interface vs type".
