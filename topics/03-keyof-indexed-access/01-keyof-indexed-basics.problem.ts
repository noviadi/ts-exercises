/**
 * PROMPT — `keyof T` and `T[K]` basics
 *
 * Two operators form the backbone of object type-level programming:
 *
 *   keyof T      → the union of T's keys
 *   T[K]         → the type of the property at key K  (K may be a union!)
 *
 * Tasks:
 *   1. Replace `TODO` so `UserKeys` is `keyof User` and `UserName` is the type
 *      of `User["name"]`.
 *   2. Implement the typed `get` function so `get(u, "name")` returns `string`
 *      and `get(u, "id")` returns `number`.
 *   3. Fix the CHECKS to reflect the true types.
 *
 * Run:  npx tsc --noEmit 01-keyof-indexed-basics.problem.ts
 */

type User = { id: number; name: string; active: boolean };

// TODO: make these the right types using keyof / indexed access.
type UserKeys = any;        // should be "id" | "name" | "active"
type UserName = any;        // should be string (User["name"])

// TODO: implement. Use a generic `K extends keyof T` and return type `T[K]`.
function get<T, K extends keyof T>(obj: T, key: K): any {
  return obj[key];
}

import { expectTypeOf } from "@lib";

const u: User = { id: 7, name: "Ada", active: true };

// CHECKS — fix these to describe the truth.

expectTypeOf<UserKeys>().toEqualTypeOf<"id" | "name" | "active">();
expectTypeOf<UserName>().toEqualTypeOf<string>();

// `get` should narrow its return type to the exact property:
expectTypeOf(get(u, "name")).toEqualTypeOf<string>();
expectTypeOf(get(u, "id")).toEqualTypeOf<number>();
expectTypeOf(get(u, "active")).toEqualTypeOf<boolean>();
