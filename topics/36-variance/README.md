# 36 — Variance: covariance & contravariance

> When is a `Dog[]` assignable to an `Animal[]`? When is `(x: Dog) => void`
> assignable to `(x: Animal) => void`? "Variance" is the formal name for *how a
> type's subtyping relationship is inherited by compound types built from it*.
> TypeScript's answers are pragmatic and slightly unsound — know them.

## TL;DR

- **Covariance** — `Dog extends Animal` ⇒ `Dog[]` is a subtype of `Animal[]`
  (the compound type varies the *same way* as the element). TS arrays are
  covariant — convenient but unsound (you can push a `Cat` into a `Dog[]` viewed
  as `Animal[]`).
- **Contravariance** — under `strictFunctionTypes`, a function *parameter* varies
  the *opposite* way: `(x: Animal) => void` IS assignable to `(x: Dog) => void`,
  but `(x: Dog) => void` is NOT assignable to `(x: Animal) => void`.
- **Method bivariance** — a method declared with shorthand syntax
  (`interface R { visit(x: Animal): void }`) is checked *bivariantly* (both
  directions accepted). Method-shorthand is the historical loophole for OOP.
- **`readonly` arrays are covariant too** — `readonly Dog[]` → `readonly Animal[]`
  (and the immutability removes the unsoundness, so this one is actually safe).

## Learning objectives

After this topic you can:

- State the variance direction for arrays, `readonly` arrays, and function parameters.
- Predict whether a given function assignment compiles under `strictFunctionTypes`.
- Explain why method shorthand is bivariant and why that's a deliberate compromise.
- Spot the unsoundness in covariant mutable arrays and why `readonly` fixes it.

## Sub-exercises

1. `01-covariance-contravariance` — `Animal`/`Dog` hierarchy; covariance of
   arrays; contravariance of function parameters under `strictFunctionTypes`;
   method-shorthand bivariance.
2. `02-readonly-arrays-and-contravariance` — `readonly` array covariance (sound)
   vs mutable array covariance (unsound); a `forEach`-style visitor that proves
   function-param contravariance at a real call site.

## Resources

- TypeScript Handbook — *[Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)* (the "Comparing two functions" section).
- TypeScript release notes — *[`strictFunctionTypes`](https://www.typescriptlang.org/tsconfig#strictFunctionTypes)*.
- Stephan Boyer — *[Covariance and contravariance](https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance)* (theory).
- Microsoft/TypeScript — *[Method bivariance PR #18654](https://github.com/microsoft/TypeScript/pull/18654)*.
