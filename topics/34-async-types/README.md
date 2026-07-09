# 34 — Async types: `Promise<T>` and `Awaited<T>`

> An `async` function never returns its declared value directly — it returns a
> `Promise` of it. And promises **do not nest**: a `Promise<Promise<T>>`
> resolves to `Promise<T>` at runtime. TypeScript's `Awaited<T>` recursive
> conditional type mirrors that flattening in the type system, and it is the
> single most important type-level tool for reasoning about async code.

## Learning objectives

After this topic you can:

- Read and write `Promise<T>` as the return type of `async` functions, and
  explain what TS infers when an `async` function returns a non-promise vs an
  inner promise.
- Implement `Awaited<T>` from scratch using a recursive conditional type with
  `infer`, and explain why `Promise<Promise<T>>` flattens to `T`.
- Distinguish a real `Promise<T>` from a generic **thenable** (`{ then: ... }`)
  and explain why `Awaited` deliberately accepts thenable-shaped types.
- Predict the inferred return type of `async () => X` for every shape of `X`.

## Sub-exercises

1. `01-async-return-type` — what an `async` function's return type actually is;
   `Promise<T>` vs `Promise<void>` vs `Promise<Awaited<T>>`.
2. `02-awaited-recursion` — implement `Awaited` yourself, prove the
   `Promise<Promise<T>>` flattening at the type level, and reason about
   thenable typing.

## Resources

- TypeScript Handbook —*[Promise types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#the-awaited-type-and-improvements-to-promise-types)* (the `Awaited` arrival).
- TypeScript Handbook —*[Type Manipulation: Awaited](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)*.
- MDN —*[Promise resolution](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)* — the runtime flattening procedure (`Thenable` assimilation).
- TC39 spec —*Promise Resolve Functions* (`Promise.resolve`'s recursive thenable assimilation).
