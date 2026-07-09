/**
 * PROMPT — Pitfalls of string index signatures
 *
 * A string index signature `{ [k: string]: T }` describes "a bag of `T`
 * values keyed by any string". That sounds flexible, but it throws away the
 * identity of the keys:
 *
 *   - TypeScript has NO idea which keys actually exist, so dot-access gives no
 *     autocomplete and is even forbidden under `noPropertyAccessFromIndexSignature`.
 *   - Reading any key returns `T` (or `T | undefined` under
 *     `noUncheckedIndexedAccess`), even keys you can prove are absent.
 *
 * Tasks:
 *   1. Examine `StringBag` below. Predict the type of each access in CHECKS.
 *   2. Replace every `TODO` with the correct assertion describing the REAL
 *      behaviour (be careful: keys you didn't define are NOT errors here —
 *      that's the whole trap).
 *
 * Rules:
 *   - Do NOT change the definition of `StringBag`.
 *   - The repo has `noPropertyAccessFromIndexSignature` ON, so dot-access on a
 *     value typed via an index signature must be commented with
 *     `// @ts-expect-error` where it genuinely errors.
 *
 * Run:  npx tsc --noEmit 01-index-signature-pitfalls.problem.ts
 */

type StringBag = { [k: string]: string };

const bag: StringBag = { a: "alpha", b: "beta" };

// TODO: what is the type of bag.a (dot-access) under noPropertyAccessFromIndexSignature?
// TODO: what is the type of bag["a"] (bracket) under noUncheckedIndexedAccess?
// TODO: what is the type of bag["totallyAbsent"]?

import { expectTypeOf } from "@lib";

// CHECKS — fix each to describe reality (use the value-form: expectTypeOf(bag[...])).
expectTypeOf(bag["a"]).toEqualTypeOf<string>(); // ❓ bracket read under noUncheckedIndexedAccess
expectTypeOf(bag["totallyAbsent"]).toBeNever(); // ❓ absent keys?
