/**
 * SOLUTION — State tracking in type parameters
 *
 * The leap from 01: the builder now carries **two booleans in its type
 * parameters** recording whether `select` and `from` have been called. Each
 * method returns a *different* generic instantiation of the class, reflecting
 * the new state.
 *
 *   class QueryS<SelectDone extends boolean, FromDone extends boolean>
 *
 *   select(...) : QueryS<true, FromDone>
 *   from(...)   : QueryS<SelectDone, true>
 *
 * Because the return type literally changes (from `QueryS<false,false>` to
 * `QueryS<false,true>`), we cast through `unknown` — at runtime it's the *same*
 * object; we're just telling the type system "view this object under a new
 * type-parameter instantiation". This is the standard, honest escape hatch for
 * builder state machines.
 *
 * The enforcement comes from `toSQL`'s `this:` parameter:
 *
 *   toSQL(this: QueryS<SelectDone, true>): string
 *
 * Calling `toSQL()` on `QueryS<_, false>` fails the `this:` constraint — a
 * compile error. The moment `.from()` runs, the type becomes `QueryS<_, true>`
 * and `toSQL()` becomes callable.
 */
class QueryS<
  SelectDone extends boolean = false,
  FromDone extends boolean = false,
> {
  // explanation: PHANTOM FIELD. The type parameters SelectDone/FromDone don't
  // otherwise appear in any member, so without this every instantiation would
  // be *structurally identical* and the `this:` gate on toSQL() would be
  // meaningless. By carrying them in a private field's type, two instantiations
  // that differ only in state (e.g. QueryS<false,false> vs QueryS<false,true>)
  // become structurally INCOMPATIBLE — private members must match by name AND
  // type. Now the `this:` constraint actually rejects illegal call orders.
  // `!:`` is a definite-assignment assertion: there's no runtime value, this
  // field exists only in the type system.
  private readonly _phantom!: [SelectDone, FromDone];

  private cols: string[] = [];
  private table: string | null = null;
  private conditions: string[] = [];

  // explanation: returning `QueryS<true, FromDone>` declares "after select, the
  // SelectDone flag is true". The cast is necessary because TS sees only one
  // runtime object; it can't prove the same object is now the new instantiation.
  select(...cols: string[]): QueryS<true, FromDone> {
    this.cols.push(...cols);
    return this as unknown as QueryS<true, FromDone>;
  }

  from(table: string): QueryS<SelectDone, true> {
    this.table = table;
    return this as unknown as QueryS<SelectDone, true>;
  }

  // explanation: `where` doesn't change the state flags, so its return type is
  // exactly the current instantiation. `this` already carries SelectDone/FromDone.
  where(condition: string): QueryS<SelectDone, FromDone> {
    this.conditions.push(condition);
    return this as unknown as QueryS<SelectDone, FromDone>;
  }

  // The gate: this method may only be invoked on an instance where FromDone is
  // `true`. On `QueryS<_, false>` the `this:` constraint fails → compile error.
  toSQL(this: QueryS<SelectDone, true>): string {
    const cols = this.cols.length > 0 ? this.cols.join(", ") : "*";
    const where =
      this.conditions.length > 0 ? ` WHERE ${this.conditions.join(" AND ")}` : "";
    return `SELECT ${cols} FROM ${this.table ?? ""}${where}`;
  }
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — the type-level guarantees now hold.

// Legal chain — from() flips FromDone to true, so toSQL() is callable:
const ok = new QueryS().select("a").from("users").where("x").toSQL();
expectTypeOf<typeof ok>().toBeString();

// The type of an intermediate value reflects its state. After select().from()
// we have QueryS<true, true>:
const partial = new QueryS().select("a").from("t");
expectTypeOf<typeof partial>().toEqualTypeOf<QueryS<true, true>>();

// Fresh builder is QueryS<false, false> — toSQL() is forbidden:
// @ts-expect-error  toSQL() requires .from() first (FromDone is still false)
new QueryS().toSQL();

// select() alone is NOT enough — FromDone is still false:
// @ts-expect-error  toSQL() requires .from() first
new QueryS().select("a").toSQL();

// RUNTIME — behaviour unchanged; the gates are pure type-level.
describe("state-tracked builder runtime", () => {
  const sql = new QueryS().select("a", "b").from("users").where("a > 1").toSQL();
  assert(sql === "SELECT a, b FROM users WHERE a > 1", `got: ${sql}`);

  let threw = false;
  try {
    // @ts-expect-error  toSQL() requires .from() first
    new QueryS().toSQL();
  } catch {
    threw = true;
  }
  assert(threw === false, "toSQL on fresh builder doesn't throw at runtime — it's a type gate");
});

// 💡 Takeaways:
//   • Encode finite builder state as boolean (or string-literal) type params.
//   • Each state-changing method returns a *re-parameterised* type; the
//     `as unknown as X` cast is the honest bridge between runtime identity and
//     a changed type instantiation.
//   • A `this:` parameter on a terminal method turns "wrong call order" into a
//     compile error — no runtime cost.
