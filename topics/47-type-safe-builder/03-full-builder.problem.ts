/**
 * PROMPT — Full type-safe query builder
 *
 * Combine 01 + 02 with **column-name tracking**: the chosen columns live in a
 * tuple type parameter, `where()` validates the column AND the value type, and
 * the inferred result is exactly `Pick<Row, Cols>`.
 *
 * Design (study it — you'll fill the TODOs):
 *
 *   type Operators = "=" | ">" | "<" | ">=" | "<=";
 *
 *   class FullBuilder<
 *     Row,                                            // the table's row shape
 *     Cols extends readonly (keyof Row & string)[],  // chosen columns so far
 *     FromDone extends boolean                        // has from() run?
 *   > {
 *     select<const C extends readonly (keyof Row & string)[]>(...cols: C)
 *       : FullBuilder<Row, C, FromDone>          // record the literal columns
 *
 *     where<K extends keyof Row & string>(col: K, op: Operators, value: Row[K])
 *       : this                                    // value MUST match column type
 *
 *     toSQL(this: FullBuilder<Row, Cols, true>): string
 *   }
 *
 * Your job:
 *   1. Implement `select`, `where`, `toSQL`, and a `Result` type alias that
 *      computes `Pick<Row, Cols[number]>[]`.
 *   2. Provide a `db` factory so `db.users` returns a fresh builder.
 *   3. Make the CHECKS compile — including the `@ts-expect-error` lines that
 *      prove invalid columns / value types are rejected.
 *
 * Run:  npx tsc --noEmit 03-full-builder.problem.ts
 */

type Operators = "=" | ">" | "<" | ">=" | "<=";

type UserRow = { id: number; name: string; email: string; age: number };

// TODO: implement the class above. The `where` signature is the crucial bit —
// `value: Row[K]` ties the value's type to the column.

// TODO: a `db` object whose `users` property is a fresh FullBuilder<UserRow>.

// TODO: export a `Result<B>` type alias computing Pick<Row, Cols[number]>[].

import { expectTypeOf } from "@lib";

// CHECKS — these must hold once implemented.

// const q = db.users.select("name", "email").where("age", ">", 18);
// expectTypeOf<Result<typeof q>>().toEqualTypeOf<{ name: string; email: string }[]>();

// // Column name typo is a compile error:
// // @ts-expect-error  'naem' is not a column of UserRow
// db.users.select("naem");

// // Value type must match the column ('age' is number, not string):
// // @ts-expect-error  value for 'age' must be number
// db.users.where("age", ">", "eighteen");

// // Unknown operator is rejected:
// // @ts-expect-error  '~=' is not a valid operator
// db.users.where("age", "~=", 18);
