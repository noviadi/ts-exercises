# 48 — Schema → type inference (Zod-like)

> Define a runtime **schema** (a value that describes a shape) and have
> TypeScript **infer the corresponding type** from it. This is the core idea
> behind Zod, `@effect/schema`, and `io-ts`: the schema is the single source of
> truth, and the type is derived — never hand-written.

## TL;DR

- A `Schema<T>` carries a phantom type parameter `T` (the type it describes).
  The parameter never exists at runtime; it's purely for the type system.
- `infer<S> = S extends Schema<infer T> ? T : never` pulls `T` back out.
- For `z.object({...})`, a **mapped type** walks each field's schema and infers
  its type, producing `{ [K]: infer<Fields[K]> }`.
- For a tagged schema **union** (string/number/boolean/array/object), a chain of
  conditional types — each with its own `infer` — recursively decodes the AST.

## Learning objectives

After this topic you can:

- Carry a type inside a value via a phantom type parameter.
- Extract that type with a conditional `infer`.
- Build an object-schema helper whose inferred type is a mapped type over its
  fields.
- Recursively infer types from a tagged-union AST, including arrays and nested
  objects.

## Sub-exercises

1. `01-z-object` — a Zod-like `z.string()` / `z.object({...})` whose inferred
   type is the matching object shape.
2. `02-infer-union` — `infer` over a tagged schema union (string / number /
   boolean / array / object) using nested conditionals + recursion.

## Resources

- Zod — the canonical TS schema library, `z.object({}).infer()` is exactly this
  pattern (<https://zod.dev>).
- `@effect/schema` — a more recent take using the same schema-as-value idea.
- TypeScript Handbook —*[ Conditional Types ](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)*
  (`infer`) and*[ Mapped Types ](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)*.
- Related: Topic 05 (`infer`), Topic 08 (mapped types), Topic 50 (capstone ORM
  uses these inference techniques).
