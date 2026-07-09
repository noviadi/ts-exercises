/**
 * SOLUTION — Simple fluent chain (`this` return)
 *
 * The foundation of every type-safe builder is the polymorphic `this` return
 * type. `this` means "the type of the current value" — so inside a `QueryBuilder`
 * method, `return this` carries the *concrete* subclass/instantiation type
 * through the chain instead of widening to `QueryBuilder`.
 *
 * Why not just `: QueryBuilder`? Two reasons:
 *   ① If you subclass `QueryBuilder`, a `: QueryBuilder` return would erase the
 *      subclass; `: this` preserves it (this is "polymorphic this").
 *   ② In sub-exercise 02 we'll start varying type *parameters*; `this` is the
 *      seed of that whole technique.
 *
 * At runtime, `this` is erased — it's pure type-level plumbing. The emitted JS
 * just returns the object.
 */

class QueryBuilder {
  private cols: string[] = [];
  private table: string | null = null;
  private conditions: string[] = [];

  // explanation: `: this` (not `: QueryBuilder`) keeps the most-specific type
  // flowing. Mutate, then hand the same object back for the next call.
  select(...cols: string[]): this {
    this.cols.push(...cols);
    return this;
  }

  from(table: string): this {
    this.table = table;
    return this;
  }

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  toSQL(): string {
    const cols = this.cols.length > 0 ? this.cols.join(", ") : "*";
    const where =
      this.conditions.length > 0 ? ` WHERE ${this.conditions.join(" AND ")}` : "";
    return `SELECT ${cols} FROM ${this.table ?? ""}${where}`;
  }
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — chaining now typechecks, and the type stays concrete throughout.

const q = new QueryBuilder()
  .select("name", "age")
  .from("users")
  .where("age > 18");

// After chaining, the result is still a QueryBuilder with all methods:
expectTypeOf(q).toExtend<QueryBuilder>();
expectTypeOf<typeof q.select>().toBeFunction();
expectTypeOf<typeof q.toSQL>().toBeFunction();

// RUNTIME — prove the chain actually accumulated the pieces in order.
describe("query builder chain", () => {
  const sql = q.toSQL();
  assert(
    sql === "SELECT name, age FROM users WHERE age > 18",
    `expected well-formed SQL, got: ${sql}`,
  );

  // Empty builder degenerates to `SELECT * FROM <empty>` — fine for a warm-up.
  const empty = new QueryBuilder().toSQL();
  assert(empty === "SELECT * FROM ", `empty SQL, got: ${empty}`);
});

// 💡 Takeaways:
//   • `: this` + `return this` is the minimal fluent-builder pattern. It's
//     erased at runtime — pure type plumbing.
//   • Prefer `this` over the class name: it survives subclassing and composes
//     with the state-parameter trick coming next.
//   • This gives *no* compile-time enforcement of call order yet — that's
//     sub-exercise 02.
