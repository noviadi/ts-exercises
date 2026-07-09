# 05 — `infer` & conditional type inference

> `infer` is the **destructuring** of the type system. Inside a conditional
> type `T extends SomeShape ? X : Y`, you can declare a type variable with
> `infer U` and let TypeScript *figure out* what `U` must be for the match to
> succeed. It is the engine behind `ReturnType`, `Parameters`, `Awaited`, and
> almost every real-world utility type.

## Learning objectives

After this topic you can:

- Use `infer U` inside `extends` clauses to pull a type **out** of a structure.
- Reimplement `ReturnType<T>` and `Parameters<T>` from first principles.
- Unwrap the element type of a `Promise<T>` (and thenables generally).
- Build `Awaited<T>` as a **recursive** `infer` that flattens nested promises.
- Read the TS standard library's `lib.d.ts` and recognise these patterns.

## Sub-exercises

1. `01-return-type` — the warm-up: rebuild `ReturnType<T>` with one `infer`.
2. `02-parameters-and-promise` — tuple inference for `Parameters<T>`, and
   pulling `T` out of `Promise<T>`.
3. `03-awaited-step` — compose the ideas into a **recursive** `Awaited<T>` that
   unwraps `Promise<Promise<...<T>>>` all the way down.

## Resources

- TypeScript Handbook — *[Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)* and *[Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)*.
- TypeScript Handbook — *[Type Manipulation › Awaited](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)*.
- type-challenges — the `ReturnType` / `Parameters` / `Awaited` "easy" puzzles.
- Type-Level TypeScript — the "Infer" chapter.
