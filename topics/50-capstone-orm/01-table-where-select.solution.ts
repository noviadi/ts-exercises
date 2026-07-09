/**
 * SOLUTION — table().where().select() with full validation (capstone, part 1)
 *
 * This composes every technique from the surrounding topics:
 *
 *   • A `Tables` schema map is the single source of truth (Topic 48 idea).
 *   • `Row<T> = Tables[T]` is plain indexed access (Topic 03).
 *   • `where<K extends keyof Row<T>>(col: K, op: Operators, value: Row<T>[K])`
 *     ties the value's type to the chosen column via a shared type variable K.
 *     Wrong column or wrong value type → compile error.
 *   • `select<const C extends ...>(...cols)` captures a literal column tuple
 *     (Topic 47's column-tracking trick).
 *   • `execute()` derives its return type as `Pick<Row<T>, C[number]>[]` — the
 *     exact shape asked for, at zero runtime cost (Topic 47 Result derivation).
 *
 * The `db.table(t)` factory hands out a FRESH builder per call, so there's no
 * shared mutable state between queries (the bug we hit and fixed in 47/03).
 */
import { assert, describe, expectTypeOf } from "@lib";

// ─── The schema (single source of truth) ─────────────────────────────────────
type Tables = {
  users: { id: number; name: string; email: string; age: number };
  posts: { id: number; title: string; authorId: number };
};
type TableName = keyof Tables;
type Row<T extends TableName> = Tables[T];
type Operators = "=" | ">" | "<" | ">=" | "<=";

// ─── The builder ─────────────────────────────────────────────────────────────
// explanation: two type parameters — the table name `T` (so column lookups are
// pinned to the right row) and `Sel`, the literal tuple of selected columns.
class QueryBuilder<
  T extends TableName,
  Sel extends readonly (keyof Row<T> & string)[] = [],
> {
  // Runtime accumulators — these carry no type information; the type params do.
  private _filters: string[] = [];
  private _select: (keyof Row<T> & string)[] = [];

  // `table` is stored both for toSQL() and to keep `T` anchored at runtime.
  constructor(private readonly table: T) {}

  // explanation: K is pinned to a real column name; `value: Row<T>[K]` forces
  // the value to match THAT column's type. This is the central safety move.
  where<K extends keyof Row<T> & string>(
    col: K,
    op: Operators,
    value: Row<T>[K],
  ): this {
    this._filters.push(`${col} ${op} ${JSON.stringify(value)}`);
    return this;
  }

  // explanation: `<const C>` captures the literal tuple of column names from the
  // spread arguments — select("name","email") → C = ["name","email"]. We then
  // carry C as the `Sel` parameter so execute() can derive the result shape.
  select<const C extends readonly (keyof Row<T> & string)[]>(
    ...cols: C
  ): QueryBuilder<T, C> {
    this._select.push(...cols);
    // Same honest cast as in Topic 47: the runtime object is unchanged; we're
    // re-viewing it under a new (Sel) type instantiation.
    return this as unknown as QueryBuilder<T, C>;
  }

  // The pay-off: the return type is derived purely from the type params. No
  // runtime cost — `Pick<Row<T>, Sel[number]>` is computed by the type system.
  // explanation: `Sel[number]` is the union of selected column names; Pick
  // narrows the row to exactly those. `[] as ...` is a stub — a real ORM would
  // run SQL here and return matching rows.
  async execute(): Promise<Pick<Row<T>, Sel[number]>[]> {
    return [] as Pick<Row<T>, Sel[number]>[];
  }

  toSQL(): string {
    const cols = this._select.length > 0 ? this._select.join(", ") : "*";
    const where =
      this._filters.length > 0 ? ` WHERE ${this._filters.join(" AND ")}` : "";
    return `SELECT ${cols} FROM ${this.table}${where}`;
  }
}

// ─── The factory ─────────────────────────────────────────────────────────────
// explanation: a function (not a shared object) so each call builds a fresh
// QueryBuilder — no leaked state between queries.
const db = {
  table<T extends TableName>(t: T): QueryBuilder<T> {
    return new QueryBuilder(t);
  },
};

// ─── CHECKS (type-level) ─────────────────────────────────────────────────────

const r1 = db.table("users").where("age", ">", 18).select("name", "email").execute();
expectTypeOf<Awaited<typeof r1>>().toEqualTypeOf<{ name: string; email: string }[]>();

// A different column selection yields a different inferred result shape:
const r2 = db.table("users").select("id", "name").execute();
expectTypeOf<Awaited<typeof r2>>().toEqualTypeOf<{ id: number; name: string }[]>();

// The posts table has its own columns, fully inferred:
const r3 = db
  .table("posts")
  .where("authorId", "=", 7)
  .select("title")
  .execute();
expectTypeOf<Awaited<typeof r3>>().toEqualTypeOf<{ title: string }[]>();

// String columns accept only strings; number columns only numbers:
const r4 = db.table("users").where("name", "=", "ada").select("name").execute();
expectTypeOf<Awaited<typeof r4>>().toEqualTypeOf<{ name: string }[]>();

// ─── Compile-error demonstrations ────────────────────────────────────────────
// (Each call creates a fresh, discarded builder — no runtime crash.)

// Wrong column name:
// @ts-expect-error  'naem' is not a column of users
db.table("users").select("naem");

// Value type must match the column ('age' is number):
// @ts-expect-error  'age' is number; value must be number
db.table("users").where("age", ">", "eighteen");

// String column rejects a number:
// @ts-expect-error  'name' is string; value must be string
db.table("users").where("name", "=", 42);

// Unknown operator:
// @ts-expect-error  '~=' is not a valid operator
db.table("users").where("age", "~=", 18);

// Unknown table:
// @ts-expect-error  'widgets' is not a table
db.table("widgets");

// ─── RUNTIME ─────────────────────────────────────────────────────────────────
describe("ORM read side", () => {
  const sql = db
    .table("users")
    .where("age", ">", 18)
    .where("name", "=", "ada")
    .select("name", "email")
    .toSQL();
  assert(
    sql === 'SELECT name, email FROM users WHERE age > 18 AND name = "ada"',
    `got: ${sql}`,
  );

  // execute() is a stub that returns [] — but it IS a Promise of the right type.
  void db.table("posts").select("title").execute().then((rows) => {
    assert(Array.isArray(rows), "execute returns an array");
  });
});

// 💡 Takeaways:
//   • A schema map + indexed access (`Row<T> = Tables[T]`) is the seed of a
//     type-safe ORM. Everything else is derivation.
//   • `where<K>(col: K, value: Row<T>[K])` ties two parameters together with one
//     type variable — the value becomes a function of the chosen column.
//   • `<const C>` on a rest param captures a literal tuple, which a derived
//     `Pick<Row, C[number]>` turns into the precise result shape.
//   • A factory function (not a shared object) keeps builders isolated.
//   • Sub-exercise 02 adds insert() + exhaustive table handling.
