/**
 * PROMPT — State tracking in type parameters
 *
 * In 01 the chain compiled in any order — `toSQL()` worked even before `from()`.
 * Now we encode *what has been done* in the builder's type parameters so invalid
 * orderings become compile errors.
 *
 * Design:
 *   class QueryS<SelectDone extends boolean, FromDone extends boolean>
 *     - `.select(...)`       → returns QueryS<true,  FromDone>
 *     - `.from(table)`       → returns QueryS<SelectDone, true>
 *     - `.where(cond)`       → returns this (state unchanged)
 *     - `.toSQL()`           → ONLY callable when FromDone is `true`
 *
 * Your job:
 *   1. Add the two boolean type parameters (with defaults `false`).
 *   2. Make each method return the correctly re-parameterised type. You'll need
 *      a cast through `unknown` because TS can't know the runtime object is now
 *      the *new* instantiation — that's expected; comment why.
 *   3. Give `toSQL` a `this:` parameter that requires `FromDone` to be `true`.
 *   4. Fix the CHECKS: a freshly-built `QueryS` cannot call `toSQL()` until
 *      `.from(...)` has run.
 *
 * Rules:
 *   - Keep runtime behaviour identical to 01.
 *   - Every `// @ts-expect-error` must point at a real error.
 *
 * Run:  npx tsc --noEmit 02-state-tracking.problem.ts
 */

class QueryS {
  private cols: string[] = [];
  private table: string | null = null;
  private conditions: string[] = [];

  select(...cols: string[]): QueryS {
    this.cols.push(...cols);
    return this;
  }

  from(table: string): QueryS {
    this.table = table;
    return this;
  }

  where(condition: string): QueryS {
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

import { expectTypeOf } from "@lib";

// CHECKS — after your fix, these should hold.

// Legal chain — from() enables toSQL():
const ok = new QueryS().select("a").from("users").where("x").toSQL();
expectTypeOf<typeof ok>().toBeString();

// A brand-new builder has NOT run from() yet, so toSQL() must be a compile error.
// Add `// @ts-expect-error  toSQL() requires .from() first` on the next line,
// once your types enforce it:
// new QueryS().toSQL();
