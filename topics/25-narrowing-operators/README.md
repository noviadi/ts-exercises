# 25 — Control-flow narrowing operators

> TypeScript's type checker follows your code's control flow and **narrows** a
> variable's type down each branch. Several operators trigger narrowing as a
> side-effect of their runtime behaviour — mastering them is what makes your
> code both safer and shorter.

## TL;DR

- **Optional chaining `?.`** short-circuits on `null`/`undefined` and narrows
  the rest of the chain.
- **Nullish coalescing `??`** falls back only on `null`/`undefined` (NOT on
  `0`, `""`, `false`) and narrows its left operand accordingly.
- **Truthiness narrowing** (`if (x)`) strips `undefined`/`null`/`""`/`0`/`false`
  from a union inside the truthy branch.
- **`in` operator** narrows by checking for a property's presence — the
  workhorse for discriminating object shapes without an explicit tag.
- **`instanceof`** narrows to a class/constructor's prototype — essential for
  typed `Error` subclasses and anything with a real `prototype`.

## Learning objectives

After this topic you can:

- Predict the narrowed type inside each branch of `?.`, `??`, `if (x)`.
- Use `in` to discriminate between object shapes that share no common tag.
- Use `instanceof` to narrow to a class and access its methods safely.
- Reason about *why* `??` and `||` narrow differently.

## Sub-exercises

1. `01-optional-chaining-nullish` — `?.`, `??`, and truthiness narrowing.
2. `02-in-instanceof` — `in` and `instanceof` narrowing across branches.

## Resources

- TypeScript Handbook —*[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)*.
- TypeScript Handbook —* [`typeof` / `in` / `instanceof` type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards)*.
- MDN —*[Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)*, *[Nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)*.
