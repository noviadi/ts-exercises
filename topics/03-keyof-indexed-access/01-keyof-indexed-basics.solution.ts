/**
 * SOLUTION — `keyof T` and `T[K]` basics
 *
 *   keyof T   → union of T's keys ("id" | "name" | "active")
 *   T[K]      → type at key K, where K : keyof T
 *
 * Together they let you write one fully-typed `get` that tracks each call
 * site: `get(u, "id")` returns `number`, `get(u, "name")` returns `string`.
 * This single idiom (`<T, K extends keyof T> => T[K]`) reappears everywhere
 * — `Pick`, `get`, lodash `_.get`, React `useReducer` action types, etc.
 */

type User = { id: number; name: string; active: boolean };

// explanation: `keyof` always yields the union of *string* keys for object
// types. For tuples it yields `"0" | "1" | ... | "length" | number-ish keys.
type UserKeys = keyof User; // "id" | "name" | "active"

// explanation: indexed access `T["name"]` reads the property's type just like
// `user.name` reads the value — but at the type level.
type UserName = User["name"]; // string

// The typed getter. Two type params: the object shape T, and a key K that must
// be one of T's real keys (the `extends keyof T` constraint). The return type
// `T[K]` is what makes the result track the specific key passed in.
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  // explanation: because K is constrained to keyof T, `obj[key]` is a sound
  // property access — NOT an index-signature lookup — so
  // noUncheckedIndexedAccess / noPropertyAccessFromIndexSignature don't add a
  // `| undefined` or complain. The value's type is exactly T[K].
  return obj[key];
}

import { assert, describe, expectTypeOf } from "@lib";

const u: User = { id: 7, name: "Ada", active: true };

// CHECKS — all passing; read them as executable documentation.

expectTypeOf<UserKeys>().toEqualTypeOf<"id" | "name" | "active">();
expectTypeOf<UserName>().toEqualTypeOf<string>();

// The return type of `get` is EXACT — it narrows per call site:
expectTypeOf(get(u, "name")).toEqualTypeOf<string>();
expectTypeOf(get(u, "id")).toEqualTypeOf<number>();
expectTypeOf(get(u, "active")).toEqualTypeOf<boolean>();

// And a bogus key is rejected at compile time:
// @ts-expect-error  "email" is not a key of User
get(u, "email");

// RUNTIME — the implementation behaves correctly at runtime too.
describe("get returns the right value", () => {
  assert(get(u, "id") === 7, "id");
  assert(get(u, "name") === "Ada", "name");
  assert(get(u, "active") === true, "active");
});

// 💡 Takeaways:
//   • `keyof T` + `T[K]` is the single most reused building block in TS
//     utility-type code. Memorise the shape `<T, K extends keyof T>`.
//   • Indexed access is sound ONLY because of the `extends keyof T` constraint;
//     without it, `T[K]` would be undefined-behaviour at the type level.
//   • `K` can be a whole union (see 02-lookup-and-constraint) — not just one key.
