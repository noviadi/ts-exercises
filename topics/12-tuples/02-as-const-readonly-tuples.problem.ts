/**
 * PROMPT — `as const` produces readonly tuples of literal types
 *
 * Without `as const`, an array literal like `["a", 1]` is inferred as the
 * *widened* mutable array `(string | number)[]`. Adding `as const`:
 *
 *   - freezes the array into a `readonly` TUPLE (fixed length),
 *   - narrows every value to its literal type.
 *
 * Compare:
 *     const x = ["a", 1];            // (string | number)[]
 *     const y = ["a", 1] as const;   // readonly ["a", 1]
 *
 * Your job:
 *   1. Below each TODO, predict the EXACT type that TS infers, then fix the
 *      `expectTypeOf` assertions so they describe reality.
 *   2. Where assignment would error, keep a `// @ts-expect-error <reason>`.
 *
 * Run:  npx tsc --noEmit 02-as-const-readonly-tuples.problem.ts
 */

// TODO: predict the inferred type, then fix the assertion.
const widened = ["a", 1];
expectTypeOf<typeof widened>().toEqualTypeOf<(string | number)[]>();

// TODO: predict the `as const` type.
const narrowed = ["a", 1] as const;
expectTypeOf<typeof narrowed>().toEqualTypeOf<(string | number)[]>();

// TODO: object literal with `as const` — every value is a literal, every array a readonly tuple.
const config = {
  level: "info" as const,
  ports: [8080, 8081],
} as const;
expectTypeOf<typeof config["ports"]>().toEqualTypeOf<number[]>();
expectTypeOf<typeof config["level"]>().toEqualTypeOf<string>();

import { expectTypeOf } from "@lib";
