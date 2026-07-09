/**
 * PROMPT — table().where().select() with full validation
 *
 * Build the read side of a type-safe ORM. Given a `Tables` schema map:
 *
 *   db.table("users")
 *     .where("age", ">", 18)        // col must exist; value must match col type
 *     .select("name", "email")      // cols must exist
 *     .execute()                     // -> Promise<{ name: string; email: string }[]>
 *
 * Your job:
 *   1. Define `Tables` (users + posts) and derive `TableName`, `Row<T>`.
 *   2. Write a `QueryBuilder<T, Sel>` class generic over the table name and the
 *      selected-columns tuple.
 *       - `.where<K>(col: K, op: Operators, value: Row<T>[K])` → ties value to col
 *       - `.select<const C>(...cols: C)` → records the literal column tuple
 *       - `.execute()` → returns `Promise<Pick<Row<T>, C[number]>[]>`
 *   3. Write the `db.table(t)` factory.
 *   4. Uncomment the CHECKS, including the `@ts-expect-error` lines.
 *
 * Run:  npx tsc --noEmit 01-table-where-select.problem.ts
 */

// TODO: Tables, TableName, Row, Operators, QueryBuilder, db.

import { expectTypeOf } from "@lib";

// CHECKS — uncomment once implemented.

// const r1 = db.table("users").where("age", ">", 18).select("name", "email").execute();
// expectTypeOf<Awaited<typeof r1>>().toEqualTypeOf<{ name: string; email: string }[]>();

// // Wrong column name:
// // @ts-expect-error  'naem' is not a column of users
// db.table("users").select("naem");

// // Value type must match the column:
// // @ts-expect-error  'age' is number; value must be number
// db.table("users").where("age", ">", "eighteen");

// // Unknown operator:
// // @ts-expect-error  '~=' is not a valid operator
// db.table("users").where("age", "~=", 18);
