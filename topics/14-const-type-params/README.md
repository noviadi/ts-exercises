# 14 — `const` type parameters & const assertions

> TypeScript **widens** literals (`"hi"` → `string`, `42` → `number`) the moment
> a value might be mutable. `as const` and `const` type parameters are the two
> ways to opt *out* of widening and keep the narrowest possible literal/tuple
> types — which is essential for type-safe routing, configs, and tuple-returning
> helpers.

## Learning objectives

After this topic you can:

- Explain *literal widening*: when it happens and why (immutability of the binding).
- Use `as const` to freeze object/array literals into readonly literal types.
- Distinguish `as const` (caller-side) from `<const T>` (implementation-side).
- Author helpers that infer literal tuples/unions *without* forcing callers to
  write `as const`.

## Sub-exercises

1. `01-literal-widening` — `as const` and the rules of literal widening.
2. `02-const-type-params` — `<const T>` on a function type parameter; rest-tuple
   inference without `as const` at the call site.

## Resources

- TypeScript Handbook — *[Const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters)* (TS 5.0 release notes).
- TypeScript Handbook — [*Literal types* & `as const`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).
- Total TypeScript — Matt Pocock's material on `as const` and `satisfies`.
