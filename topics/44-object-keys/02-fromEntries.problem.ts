/**
 * PROMPT — Typed `fromEntries`: rebuild an object type from entry pairs
 *
 * `Object.fromEntries` is typed generically and returns an index-signature
 * object (`{ [k: string]: T }`), erasing the precise literal keys. Write a
 * `fromEntries` that PRESERVES the literal keys, using a mapped type that
 * reads the key set straight off the entries tuple.
 *
 * Rules:
 *   - Don't change the `entries` input.
 *   - Fill in `FromEntries<E>` and implement `fromEntries`.
 *   - The CHECKS must compile, and the runtime `describe` must pass.
 *
 * Run:  npx tsc --noEmit 02-fromEntries.problem.ts
 */

import { describe, assert, expectTypeOf } from "@lib";

type Entry = readonly [PropertyKey, unknown];

// TODO: a mapped type that turns a tuple of entries into an object type whose
// keys are the literal first elements and whose values are the matching second
// elements.
type FromEntries<E extends readonly Entry[]> = TODO;

// TODO: implement so the return type is `FromEntries<E>`.
function fromEntries<E extends readonly Entry[]>(entries: E): TODO {
  // Hint: build the object imperatively and cast to FromEntries<E>.
}

const entries = [
  ["host", "localhost"],
  ["port", 8080],
  ["tls", true],
] as const;

// CHECKS — fail until both TODOs are filled in.
const obj = fromEntries(entries);
expectTypeOf<typeof obj>().toEqualTypeOf<{
  host: "localhost";
  port: 8080;
  tls: true;
}>();

describe("fromEntries round-trips values", () => {
  assert(obj.host === "localhost", "host preserved with literal type");
  assert(obj.port === 8080, "port preserved with literal type");
  assert(obj.tls === true, "tls preserved with literal type");
});
