/**
 * PROMPT — Get<T, "a.b.c">: type-safe dot-path navigation
 *
 * Given a nested object type `T` and a dotted string path `P`, return the type
 * of the value living at that path:
 *
 *   Get<{ user: { age: number } }, "user.age">  →  number
 *   Get<{ a: { b: { c: 1 } } }, "a.b.c">        →  1
 *
 * If the path doesn't exist, return `undefined`.
 *
 * Mechanism: split `P` on the FIRST `.` using a template-literal infer:
 *
 *   P extends `${infer Head}.${infer Tail}` ? ... : ...
 *
 *   - If it splits: narrow `Head extends keyof T`, then recurse on the tail
 *     against `T[Head]`.
 *   - If it doesn't split (no dot): `P` is the final key, so return `T[P]` if
 *     `P extends keyof T`, else `undefined`.
 *
 * Your job: implement `Get` so the CHECKS compile.
 *
 * Rule: pure type alias, no `any`.
 *
 * Run:  npx tsc --noEmit 01-get-by-path.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement.
type Get<T, P extends string> = TODO;

// CHECKS — make these compile.
type Config = {
  host: string;
  port: number;
  db: { url: string; pool: { size: number; timeout: number } };
};

expectTypeOf<Get<Config, "host">>().toEqualTypeOf<string>();
expectTypeOf<Get<Config, "db.url">>().toEqualTypeOf<string>();
expectTypeOf<Get<Config, "db.pool.size">>().toEqualTypeOf<number>();
expectTypeOf<Get<Config, "db.pool.timeout">>().toEqualTypeOf<number>();

// Invalid paths → undefined.
expectTypeOf<Get<Config, "missing">>().toEqualTypeOf<undefined>();
expectTypeOf<Get<Config, "db.missing.deep">>().toEqualTypeOf<undefined>();
