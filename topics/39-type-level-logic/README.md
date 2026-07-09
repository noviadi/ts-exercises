# 39 — Type-level booleans & conditionals

> The type system can do **boolean algebra**. Conditional types
> (`T extends U ? X : Y`) are the type-level `if`, and `boolean` is just the
> union `true | false` — so a conditional over a `boolean` behaves like a
> logic gate. This topic builds `Not`, `And`, `Or`, `Xor`, and a type-level
> `If<C, A, B>` purely in the type system, no runtime code.

## TL;DR

- `boolean` = `true | false`.
- A conditional type `B extends true ? X : Y` is an `if`.
- Short-circuit evaluation works at the type level: `And<A, B>` returns
  `false` the moment `A` is `false`, just like `&&`.
- **Distribution**: when the checked type is a naked type parameter, the
  conditional runs once per union member. That's why `Not<boolean>` widens
  back to `boolean` correctly.

## Learning objectives

After this topic you can:

- Implement `Not`/`And`/`Or`/`Xor` with conditional types and prove them
  with a full truth table via `expectTypeOf`.
- Write a type-level `If<C, A, B>` and use it to branch the type of a result.
- Explain distribution over `boolean` and why `Not<true | false>` is `boolean`.
- Spot the difference between a compile-time logic gate and a runtime `&&`.

## Sub-exercises

1. `01-boolean-gates` — `Not`, `And`, `Or`, `Xor` over `boolean`; truth-table
   `expectTypeOf` checks (4 input combinations per gate).
2. `02-type-level-if` — `If<C, A, B = never>` via a conditional type;
   default-branch `never`; distribution notes.

## Resources

- TypeScript Handbook — *[Conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)*.
- TypeScript Handbook — *[Distributive conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)*.
- type-challenges — *`If`* (easy) and *`Includes`* (where these gates compose).
- Type-Level TypeScript — *"Boolean Logic"* chapter.
