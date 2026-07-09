/**
 * SOLUTION — Full client: insert + execute + exhaustive table handling
 *
 * The capstone. We fold in the last pieces:
 *
 *   • `db.insert<T>(table, row)` where `row: Omit<Row<T>, "id">`. Because `id`
 *     is auto-generated, the type system REJECTS it if you supply it, and
 *     REQUIRES every other column (Topic 11's `-readonly`/`-?` mapped modifiers
 *     and Topic 09's key filtering via `Omit`).
 *   • `tableName(t)` switches over EVERY table with an `assertNever` default
 *     (Topic 19) — adding a table to `Tables` later breaks this until you wire
 *     it up. That's exhaustiveness applied to the schema.
 *   • The read side is the builder from 01, reused verbatim.
 *
 * Together: schema inference (48) + builder state (47) + column/value tying
 * (50-01) + exhaustiveness (49/19) = a tiny but real type-safe ORM.
 */
import { assert, assertEquals, describe, expectTypeOf } from "@lib";

// ─── Schema (single source of truth) ─────────────────────────────────────────
type Tables = {
  users: { id: number; name: string; email: string; age: number };
  posts: { id: number; title: string; authorId: number };
};
type TableName = keyof Tables;
type Row<T extends TableName> = Tables[T];
type Operators = "=" | ">" | "<" | ">=" | "<=";

// ─── Read-side builder (same as 01, with a real runtime filter) ──────────────
// A structured filter record (not a pre-formatted string) so execute() can
// actually evaluate predicates over the in-memory store.
type Filter = { col: string; op: Operators; val: unknown };

class QueryBuilder<
  T extends TableName,
  Sel extends readonly (keyof Row<T> & string)[] = [],
> {
  private _filters: Filter[] = [];
  private _select: (keyof Row<T> & string)[] = [];
  constructor(private readonly table: T) {}

  where<K extends keyof Row<T> & string>(
    col: K,
    op: Operators,
    value: Row<T>[K],
  ): this {
    this._filters.push({ col, op, val: value });
    return this;
  }

  select<const C extends readonly (keyof Row<T> & string)[]>(
    ...cols: C
  ): QueryBuilder<T, C> {
    this._select.push(...cols);
    return this as unknown as QueryBuilder<T, C>;
  }

  // explanation: a real filter over the in-memory store. The type-level Sel
  // drives the return type; the runtime _filters drive the actual rows. We
  // evaluate each predicate; non-numeric comparisons with `>`/`<` etc. fall back
  // to `false` (matching how SQL would reject type mismatches at the boundary).
  async execute(): Promise<Pick<Row<T>, Sel[number]>[]> {
    const matched = store[this.table].filter((row) =>
      this._filters.every((f) => applyOp(row[f.col], f.op, f.val)),
    );
    const cols: (keyof Row<T> & string)[] =
      this._select.length > 0
        ? this._select
        : (Object.keys(store[this.table][0] ?? {}) as (keyof Row<T> & string)[]);
    return matched.map((row) => {
      const picked: Record<string, unknown> = {};
      for (const c of cols) picked[c] = row[c];
      return picked as Pick<Row<T>, Sel[number]>;
    });
  }

  toSQL(): string {
    const cols = this._select.length > 0 ? this._select.join(", ") : "*";
    const where =
      this._filters.length > 0
        ? ` WHERE ${this._filters
            .map((f) => `${f.col} ${f.op} ${JSON.stringify(f.val)}`)
            .join(" AND ")}`
        : "";
    return `SELECT ${cols} FROM ${this.table}${where}`;
  }
}

// Evaluate one comparison. Numbers use numeric ordering; mismatched types fail
// (return false) — the type system already prevents this at call sites.
function applyOp(left: unknown, op: Operators, right: unknown): boolean {
  if (op === "=") return left === right;
  if (typeof left !== "number" || typeof right !== "number") return false;
  switch (op) {
    case ">":
      return left > right;
    case "<":
      return left < right;
    case ">=":
      return left >= right;
    case "<=":
      return left <= right;
    default:
      return false;
  }
}

// ─── Exhaustive table handling ───────────────────────────────────────────────
// explanation: the `assertNever` default means this switch must list EVERY table
// in `Tables`. Add a third table to `Tables` and this stops compiling until you
// add its case — that's exhaustiveness protecting the schema from drift.
function assertNever(x: never): never {
  throw new Error(`Unexpected table: ${JSON.stringify(x)}`);
}
function tableSingular(t: TableName): string {
  switch (t) {
    case "users":
      return "user";
    case "posts":
      return "post";
    default:
      return assertNever(t);
  }
}

// ─── In-memory store (so runtime checks observe real data) ──────────────────
// explanation: typed loosely internally; the public API enforces the real types.
type AnyRow = { id: number; [k: string]: unknown };
const store: Record<TableName, AnyRow[]> = {
  users: [],
  posts: [],
};

// ─── The client ─────────────────────────────────────────────────────────────
const db = {
  // Read side — fresh builder per call.
  table<T extends TableName>(t: T): QueryBuilder<T> {
    return new QueryBuilder(t);
  },

  // Write side. `row: Omit<Row<T>, "id">` is the crux:
  // explanation: Omit removes the auto-generated `id`, so the caller must NOT
  // supply it (excess-property checks will reject `{ id: ... }`) and MUST supply
  // every remaining column. The return type is the full Row<T> — as if the store
  // generated and attached the id.
  insert<T extends TableName>(table: T, row: Omit<Row<T>, "id">): Row<T> {
    const id = store[table].length + 1;
    const created = { id, ...row } as Row<T>;
    store[table].push(created as unknown as AnyRow);
    return created;
  },
};

// ─── CHECKS (type-level) ─────────────────────────────────────────────────────

// Read side infers the requested shape:
const rowsPromise = db
  .table("users")
  .where("age", ">", 18)
  .select("name")
  .execute();
type Rows = Awaited<typeof rowsPromise>;
expectTypeOf<Rows>().toEqualTypeOf<{ name: string }[]>();

// Insert validates the row shape (id omitted) and returns the full row:
const created = db.insert("users", { name: "ada", email: "a@b.c", age: 36 });
expectTypeOf<typeof created>().toEqualTypeOf<{
  id: number;
  name: string;
  email: string;
  age: number;
}>();

// ─── Compile-error demonstrations ────────────────────────────────────────────

// supplying 'id' is rejected (it's auto-generated):
// @ts-expect-error  'id' is auto-generated; omit it
db.insert("users", { id: 1, name: "x", email: "y", age: 1 });

// missing a required column is rejected:
// @ts-expect-error  'email' is required
db.insert("users", { name: "x", age: 1 });

// wrong value type is rejected:
// @ts-expect-error  'age' must be number
db.insert("users", { name: "x", email: "y", age: "old" });

// posts has different required columns:
// @ts-expect-error  posts needs title and authorId, not email/age
db.insert("posts", { name: "x", email: "y", age: 1 });

// ─── RUNTIME ─────────────────────────────────────────────────────────────────
describe("full client round-trip", async () => {
  // Reset the in-memory store so the @ts-expect-error demo inserts above (which
  // DO execute at runtime under tsx) don't pollute this test's data.
  store.users.length = 0;
  store.posts.length = 0;

  // Insert two users, then read them back through the typed query builder.
  db.insert("users", { name: "ada", email: "ada@x.io", age: 36 });
  db.insert("users", { name: "lin", email: "lin@x.io", age: 17 });

  // Select users over 20, returning only their names.
  const over20 = await db
    .table("users")
    .where("age", ">", 20)
    .select("name")
    .execute();

  // The query is a real filter over the in-memory store:
  assert(over20.length === 1, `expected 1 adult, got ${over20.length}`);
  assertEquals(over20[0], { name: "ada" });

  // The SQL it corresponds to:
  const sql = db.table("users").where("age", ">", 20).select("name").toSQL();
  assert(sql === "SELECT name FROM users WHERE age > 20", `got: ${sql}`);

  // Exhaustive helper maps each table to a singular noun:
  assert(tableSingular("users") === "user", "users -> user");
  assert(tableSingular("posts") === "post", "posts -> post");
});

// 💡 Takeaways:
//   • `Omit<Row<T>, "id">` turns "this column is auto-generated" into a static
//     rule: callers can't supply id and must supply everything else.
//   • A switch over `keyof Tables` with an `assertNever` default makes the
//     schema map and the client impossible to drift apart silently.
//   • The same builder that infers the SELECT result also drives the runtime
//     query — types and behaviour share one source of truth.
//   • You've now composed inference (48), builder state (47), column tying
//     (50-01), and exhaustiveness (49/19) into a working mini ORM. That's the
//     capstone.
