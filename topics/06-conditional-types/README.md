# 06 — Conditional types

> A conditional type is an **`if` statement for types**:
>
> ```ts
> type T = SomeType extends OtherType ? TrueBranch : FalseBranch;
> ```
>
> `extends` here means *is-assignable-to* (the same relation as structural
> typing — see Topic 01). The branches are types, and only one is selected.
> This is the foundation of `Exclude`, `Extract`, `NonNullable`, `ReturnType`,
> and every type-level program you'll write from here on.

## Learning objectives

After this topic you can:

- Read `T extends U ? X : Y` as "if `T` is assignable to `U`".
- Implement `Exclude<T, U>` and `NonNullable<T>` from scratch.
- Chain conditional types like `if / else if / else` to classify types.
- Reason about when the `true` vs `false` branch is chosen.

## Sub-exercises

1. `01-type-level-if` — the basic form; rebuild `Exclude` and `NonNullable`.
2. `02-nested-ternary-chains` — nested ternaries as an `if/else-if/else` ladder.

## Resources

- TypeScript Handbook — *[Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)*.
- TypeScript Handbook — *[Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)* (the prerequisite for Topic 07).
- type-challenges — `Exclude`, `NonNullable`, and the `If`/`Includes` puzzles.
