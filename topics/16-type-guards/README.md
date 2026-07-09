# 16 — Type guards & predicates

> A **type guard** narrows a value's type at runtime. The built-in ones
> (`typeof`, `instanceof`, `Array.isArray`, `in`) cover most everyday cases;
> custom guards with the `value is T` return-type let you encapsulate complex
> checks and reuse the narrowing. This topic covers all of the above — and the
> sharp edge: the compiler *trusts* your predicates, so they must be honest.

## Learning objectives

After this topic you can:

- Write a custom guard using the `value is T` predicate return type.
- Use `Array.isArray` and combine multiple guards to refine a value step by step.
- Build a union guard (`value is A | B`) by composing checks.
- Explain why user-defined guards are **unsound** — and how to write them so
  the runtime and the type system agree.

## Sub-exercises

1. `01-predicates-and-array-isarray` — `x is T`, `Array.isArray`, built-ins.
2. `02-combining-guards` — custom `isString`/`isNonNull`, AND & OR composition.
3. `03-honest-guards` — the soundness hole; why a lying guard compiles; how to
   keep guards honest.

## Resources

- TypeScript Handbook — [*Narrowing* & `using type predicates*](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).
- TypeScript Handbook — [`instanceof` & `in` narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
- Total TypeScript — material on narrowing and custom guards.
