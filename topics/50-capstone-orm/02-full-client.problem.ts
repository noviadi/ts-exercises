/**
 * PROMPT — Full client: insert + execute + exhaustive table handling
 *
 * Extend the 01 builder into a full client:
 *
 *   db.table("users").select("name").execute()    // -> Promise<{name:string}[]>
 *   db.insert("users", { name, email, age })      // validates the new row
 *   db.insert("users", {...})                      // 'id' is auto-generated
 *
 * Your job:
 *   1. Reuse the `Tables` map and the read-side builder from 01 (you may copy
 *      the essentials).
 *   2. Add `db.insert<T>(table, row)` where `row: Omit<Row<T>, 'id'>` — so the
 *      auto-generated `id` is rejected if supplied, and every other column is
 *      required.
 *   3. Add a `tableName(t)` helper that switches over EVERY table exhaustively
 *      (using `assertNever`) — so adding a table to `Tables` without updating it
 *      is a compile error.
 *   4. Uncomment the CHECKS, including the `@ts-expect-error` lines.
 *
 * Run:  npx tsc --noEmit 02-full-client.problem.ts
 */

// TODO: Tables, Row, the read builder, db.insert, db.table, tableName.

import { expectTypeOf } from "@lib";

// CHECKS — uncomment once implemented.

// const rows = await db.table("users").where("age", ">", 18).select("name").execute();
// expectTypeOf<typeof rows>().toEqualTypeOf<{ name: string }[]>();

// // insert validates the row shape (id is auto-generated, so omitted):
// const created = db.insert("users", { name: "ada", email: "a@b.c", age: 36 });
// expectTypeOf<typeof created>().toEqualTypeOf<{ id: number; name: string; email: string; age: number }>();

// // supplying 'id' is rejected:
// // @ts-expect-error  'id' is auto-generated; omit it
// db.insert("users", { id: 1, name: "x", email: "y", age: 1 });

// // missing a required column is rejected:
// // @ts-expect-error  'email' is required
// db.insert("users", { name: "x", age: 1 });

// // wrong value type is rejected:
// // @ts-expect-error  'age' must be number
// db.insert("users", { name: "x", email: "y", age: "old" });
