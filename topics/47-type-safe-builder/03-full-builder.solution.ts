/**
 * SOLUTION — Full type-safe query builder
 *
 * Everything from 01 (chaining via `this`) and 02 (state in type params) now
 * meets **column-name tracking**. The builder stores two pieces of static info:
 *
 *   - `Cols extends readonly (keyof Row & string)[]` — the literal tuple of
 *     columns passed to `.select(...)`. We capture them with a `<const>` type
 *     parameter on the rest argument.
 *   - `FromDone extends boolean` — the same state flag as in 02.
 *
 * The pay-off is twofold:
 *
 *   ① `.where(col, op, value)` constrains `col` to `keyof Row & string` AND
 *      makes `value: Row[K]` — so the value's type is tied to the specific
 *      column. `where("age", ">", "x")` is a compile error because `age` is a
 *      number.
 *   ② The final result type is derived as `Pick<Row, Cols[number]>[]` — i.e.
 *      "an array of objects having exactly the columns you selected".
 */

type Operators = "=" | ">" | "<" | ">=" | "<=";

type UserRow = { id: number; name: string; email: string; age: number };

class FullBuilder<
  Row,
  Cols extends readonly (keyof Row & string)[] = [],
  FromDone extends boolean = false,
> {
  // Runtime accumulators. These are NOT what carries the type — the type
  // parameters above do. The runtime fields just let toSQL() produce a string.
  private _cols: (keyof Row & string)[] = [];
  private _conditions: string[] = [];
  private readonly _table: string;

  constructor(table: string) {
    this._table = table;
  }

  // explanation: `<const C>` makes TS infer a *literal tuple* from the spread
  // arguments: select("name","email") → C = ["name","email"]. We stash C into
  // the Cols parameter so the eventual `Pick<Row, Cols[number]>` is precise.
  select<const C extends readonly (keyof Row & string)[]>(
    ...cols: C
  ): FullBuilder<Row, C, FromDone> {
    this._cols.push(...cols);
    // The same object viewed under a new instantiation — honest cast (see 02).
    return this as unknown as FullBuilder<Row, C, FromDone>;
  }

  // The heart of column/value safety: K is pinned to a real column name, and
  // `value: Row[K]` forces the value to match THAT column's type.
  where<K extends keyof Row & string>(
    col: K,
    op: Operators,
    value: Row[K],
  ): FullBuilder<Row, Cols, FromDone> {
    this._conditions.push(`${col} ${op} ${JSON.stringify(value)}`);
    return this as unknown as FullBuilder<Row, Cols, FromDone>;
  }

  // Terminal: only callable once FromDone is true (set by the factory, which
  // pre-binds the table — so every db.<table> builder starts FromDone=true).
  toSQL(this: FullBuilder<Row, Cols, true>): string {
    const cols = this._cols.length > 0 ? this._cols.join(", ") : "*";
    const where =
      this._conditions.length > 0
        ? ` WHERE ${this._conditions.join(" AND ")}`
        : "";
    return `SELECT ${cols} FROM ${this._table}${where}`;
  }
}

// explanation: derive the result type purely from the builder's type params.
// `Cols[number]` is the union of selected column names; Pick narrows Row to
// exactly those columns. We constrain Cols inside the conditional (`infer Cols
// extends readonly string[]`) rather than on the outer B, because writing
// `FullBuilder<unknown, ...>` would force Cols to satisfy `readonly never[]`
// (keyof unknown === never) — too narrow to be useful.
type Result<B> =
  B extends FullBuilder<infer Row, infer Cols, boolean>
    ? [Cols] extends [readonly string[]]
      ? Pick<Row, Cols[number] & keyof Row>[]
      : never
    : never;

// Factory: each access to `db.users` returns a FRESH builder. This matters
// because the builder mutates itself as you chain — a shared singleton would
// leak state between queries (and between the @ts-expect-error demo calls
// below, which DO execute at runtime even though tsx ignores the type error).
// A getter is the simplest way to hand out a clean instance each time.
const db = {
  // explanation: the explicit type arguments force FromDone=true so toSQL() is
  // immediately callable. A real ORM would generate this from a schema map
  // (see Topic 50).
  get users(): FullBuilder<UserRow, [], true> {
    return new FullBuilder<UserRow, [], true>("users");
  },
};

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — type-level proof of every guarantee.

const q = db.users.select("name", "email").where("age", ">", 18);

// Result is exactly { name: string; email: string }[] — the columns we selected.
expectTypeOf<Result<typeof q>>().toEqualTypeOf<{ name: string; email: string }[]>();

// toSQL() is callable (FromDone was set true by the factory):
expectTypeOf<typeof q.toSQL>().toBeFunction();

// Column name typo is a compile error:
// @ts-expect-error  'naem' is not a column of UserRow
db.users.select("naem");

// Value type must match the column ('age' is number, not string):
// @ts-expect-error  value for 'age' must be number
db.users.where("age", ">", "eighteen");

// String column accepts only strings:
// @ts-expect-error  value for 'name' must be string
db.users.where("name", "=", 42);

// Unknown operator is rejected:
// @ts-expect-error  '~=' is not a valid operator
db.users.where("age", "~=", 18);

// RUNTIME — the SQL string is well-formed.
describe("full builder runtime", () => {
  const sql = db.users.select("name", "email").where("age", ">", 18).toSQL();
  assert(
    sql === "SELECT name, email FROM users WHERE age > 18",
    `got: ${sql}`,
  );

  // A query with multiple conditions chains correctly:
  const sql2 = db.users
    .where("age", ">=", 21)
    .where("name", "=", "ada")
    .select("id")
    .toSQL();
  assert(
    sql2 === "SELECT id FROM users WHERE age >= 21 AND name = \"ada\"",
    `got: ${sql2}`,
  );
});

// 💡 Takeaways:
//   • Capture literal tuples with `<const C extends ...[]>` on rest params —
//     this is how you carry "the exact arguments the caller passed" into a type.
//   • Tie two parameters together with a shared type variable: `where<K>(col: K,
//     value: Row[K])` makes the value's type a function of the chosen column.
//   • Derive output types from input type params with no runtime cost:
//     `Pick<Row, Cols[number]>` is the whole result-shape inference.
//   • This is the kernel of Kysely / Prisma's typed query API. Topic 50 grows
//     it into a full ORM with insert + execute + exhaustive table handling.
