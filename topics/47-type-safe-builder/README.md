# 47 — Type-safe builder

> A builder whose **return type tracks accumulated state**: each chained call
> narrows what the *next* call is allowed to be, and invalid transitions become
> **compile errors**. This is the pattern behind real query builders (Knex,
> Kysely), fluent fetch clients, and configuration DSLs.

## TL;DR

- Chaining with `this` preserves the concrete type so further calls stay typed.
- Carrying **state in the type parameters** (e.g. `<SelectDone extends boolean,
  FromDone extends boolean>`) lets a method *return a different type* after it
  runs — `from()` flips `FromDone` from `false` to `true`.
- A `this:` parameter on a terminal method (`.toSQL()`) makes calling it
  **before the prerequisites are met** a compile error.
- Carrying the **selected columns as a tuple type** lets the final result be
  inferred as `Pick<Row, Cols>` — exactly the columns you asked for.

## Learning objectives

After this topic you can:

- Use polymorphic `this` for fluent chaining and explain when it beats a
  concrete return type.
- Encode builder state in type parameters and transition between states by
  returning a re-parameterised `this`.
- Gate methods with `this:` parameter constraints so invalid call orderings are
  rejected by the compiler.
- Track a list of chosen keys in a `readonly string[]` type parameter and derive
  a `Pick`-shaped result from it.

## Sub-exercises

1. `01-simple-chain` — a fluent `this`-returning query builder; the warm-up.
2. `02-state-tracking` — generic state booleans make `.toSQL()` callable only
   after `.from()`.
3. `03-full-builder` — column names tracked in the type; `.where()` validates
   column + value type; result inferred as `Pick<Row, Cols>`.

## Resources

- TypeScript Handbook —*[ Classes ](https://www.typescriptlang.org/docs/handbook/2/classes.html)*
  (the `this` type section) and*[ this types ](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-types)*.
- Kysely — a real type-safe SQL query builder whose API is built on exactly
  these ideas (<https://kysely.dev/>).
- Total TypeScript — fluent-builder patterns and `this` return types.
- Related: Topic 21 (`this:` parameter), Topic 48 (schema inference), Topic 50
  (capstone ORM that composes this builder).
