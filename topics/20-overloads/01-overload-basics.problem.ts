/**
 * PROMPT — Overload basics
 *
 * A `parse` function accepts EITHER a JSON string OR a `Uint8Array` of bytes.
 * Its return type must track the input: a string returns `unknown` (the parsed
 * JSON), but a `Uint8Array` is assumed to be already-structured data of a
 * *single* expected shape and returns `{ value: string }`.
 *
 * Below is one stubbed implementation. Your job:
 *   1. Add overload signatures ABOVE the function so callers see the precise
 *      per-shape return type instead of the loose implementation signature.
 *   2. Fix the CHECKS so they describe the real return type at each call site.
 *
 * Rules of the game:
 *   - The runtime body stays as-is.
 *   - Do NOT use `any`.
 *   - Remember: callers can only see the overload signatures, never the
 *     implementation signature itself.
 *
 * Run:  npx tsc --noEmit 01-overload-basics.problem.ts
 */

// TODO: add overload signatures here.

function parse(input: string | Uint8Array): unknown {
  // explanation: the implementation signature must be compatible with EVERY
  // overload, so its parameter type is the union and its return is the union.
  if (typeof input === "string") {
    return JSON.parse(input);
  }
  const bytes = input;
  // pretend we decode + parse bytes into a fixed shape:
  return { value: new TextDecoder().decode(bytes) };
}

import { expectTypeOf } from "@lib";

// CHECKS — these describe what callers SHOULD see. Make them true.

// parse('{"a":1}')           should return `unknown`
expectTypeOf(parse('{"a":1}')).toEqualTypeOf<unknown>(); // ❓

// parse(new Uint8Array())    should return `{ value: string }`
expectTypeOf(parse(new Uint8Array())).toEqualTypeOf<{ value: string }>(); // ❓
