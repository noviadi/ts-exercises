/**
 * PROMPT — Simple fluent chain (`this` return)
 *
 * Below is a tiny SQL query builder. Every method should return `this` so calls
 * can be chained: `new QueryBuilder().select("a","b").from("users").toSQL()`.
 *
 * Right now the methods return `void`, so chaining is impossible.
 *
 * Your job:
 *   1. Change each method's return type to `this` and `return this` at the end.
 *   2. Make the CHECKS compile. The key lesson: a `this` return type keeps the
 *      *concrete* type flowing through the chain, so every later method stays
 *      callable and typed.
 *
 * Rules:
 *   - Do not change runtime bodies beyond adding `return this`.
 *   - Do not introduce generics yet (that's sub-exercise 02).
 *
 * Run:  npx tsc --noEmit 01-simple-chain.problem.ts
 */

class QueryBuilder {
  private cols: string[] = [];
  private table: string | null = null;
  private conditions: string[] = [];

  // TODO: return `this` (not `void`) so these chain.
  select(...cols: string[]): void {
    this.cols.push(...cols);
  }

  from(table: string): void {
    this.table = table;
  }

  where(condition: string): void {
    this.conditions.push(condition);
  }

  toSQL(): string {
    const cols = this.cols.length > 0 ? this.cols.join(", ") : "*";
    const where =
      this.conditions.length > 0 ? ` WHERE ${this.conditions.join(" AND ")}` : "";
    return `SELECT ${cols} FROM ${this.table ?? ""}${where}`;
  }
}

import { expectTypeOf } from "@lib";

// CHECKS — these should compile once methods return `this`.

const q = new QueryBuilder()
  .select("name", "age")
  .from("users")
  .where("age > 18");

// After chaining, the result is still a QueryBuilder with all methods:
expectTypeOf(q).toExtend<QueryBuilder>();
expectTypeOf<typeof q.select>().toBeFunction();
expectTypeOf<typeof q.toSQL>().toBeFunction();
