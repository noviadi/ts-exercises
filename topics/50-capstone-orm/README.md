# 50 — Capstone: type-safe mini ORM / API client

> The finale. Combine **schema inference** (Topic 48), **path/builder state**
> (Topic 47), **column-key validation**, and **exhaustiveness** (Topics 19/49)
> into one cohesive mini ORM: `db.table('users').where('id','=',...).select(...)`
> where column names, operators, value types, and the result shape are all
> inferred and validated — and `insert` validates the row against the table.

## TL;DR

- A `Tables` map is the single source of truth: `{ users: {id; name; ...}, ... }`.
- `db.table(name)` returns a builder generic over the table name, carrying the
  row type `Tables[T]`.
- `.where(col, op, value)` ties `value` to `Tables[T][col]` via a shared type
  variable — wrong column or wrong value type is a compile error.
- `.select(...cols)` captures a literal column tuple; `execute()` returns
  `Promise<Pick<Row, Cols>[]>` — exactly the requested shape.
- `.insert(row)` validates the row as `Omit<Row, 'id'>` (id is auto-generated).
- Exhaustiveness over `Tables` keys: adding a table without wiring it up is a
  compile error.

## Learning objectives

After this topic you can:

- Compose the techniques from Topics 47–49 into a realistic API.
- Tie multiple parameters together (column name ↔ value type) with shared
  generics.
- Derive a query's result type from the columns it selected, at zero runtime cost.
- Use exhaustive table handling so the schema map and the client can't drift.

## Sub-exercises

1. `01-table-where-select` — `db.table('users').where(col, op, val).select(...)`
   with column/operator/value validation and an inferred `Pick` result.
2. `02-full-client` — add `.insert(row)`, `.execute()` returning the inferred
   rows, and exhaustive handling of the table set.

## Resources

- Prisma / Kysely / Drizzle — production type-safe ORMs whose APIs this capstone
  mirrors.
- TypeScript Handbook —*[ Indexed Access ](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)*,
  *[ keyof ](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)*,
  *[ Conditional Types ](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)*.
- This kata: Topics 05, 08, 15 (`satisfies`), 19, 47, 48, 49 — all composed here.
