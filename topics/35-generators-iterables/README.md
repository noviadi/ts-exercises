# 35 — Generators & iterables

> A `function*` (or `async function*`) produces a **generator object** — an
> object that is simultaneously `Iterable<T>` *and* `Iterator<T>`. This topic
> pins down the three closely-related interfaces from `lib.es2015.iterable`,
> what `yield` evaluates to, and how async iteration plugs into `for await`.

## TL;DR

- `Iterable<T>` — anything with a `[Symbol.iterator]()` method → usable in `for...of`.
- `Iterator<T>` — has a `.next()` returning `IteratorResult<T>` (`{ value: T; done: false } | { done: true }`).
- `IterableIterator<T>` — *both* of the above (this is what a generator is).
- `function*` → `Generator<T, TReturn, TNext>`; `async function*` → `AsyncGenerator<T>`.
- Inside the generator body, `yield expr` evaluates to a value of type `TNext`
  (whatever the *caller* passes to `.next(v)`); `return v` produces `TReturn`.

## Learning objectives

After this topic you can:

- Read and write the `Iterable<T>` / `Iterator<T>` / `IterableIterator<T>` interfaces from memory.
- Predict the inferred return type of a `function*` and an `async function*`.
- Type a range/generator helper so it is usable in `for...of` and `for await...of`.
- Explain *why* a generator satisfies `Iterable<T>` *and* `Iterator<T>`.

## Sub-exercises

1. `01-sync-generator` — type a `range()` generator; relate `Generator<T>` to
   `Iterable<T>` / `Iterator<T>` / `IterableIterator<T>`; inspect `yield`'s type.
2. `02-async-iteration` — `async function*`, `AsyncIterable<T>` /
   `AsyncIterator<T>`, and a typed async source consumed with `for await...of`.

## Resources

- TypeScript Handbook — *[Iterators and Generators](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)*.
- MDN — *[Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)*.
- TypeScript 4.6+ — *[Control flow analysis for destructuring discriminated unions & generator narrowing](https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/)*.
- `lib.es2015.iterable.d.ts` and `lib.es2018.asynciterable.d.ts` — the actual interface definitions.
