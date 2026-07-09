/**
 * SOLUTION — Overload basics
 *
 * An overloaded function is a list of *call signatures* followed by ONE
 * implementation. The signatures are what the outside world sees; the
 * implementation signature is the bridge between those and the runtime body,
 * and it MUST be compatible with every overload.
 *
 *   function parse(input: string):       unknown;             // overload 1
 *   function parse(input: Uint8Array):   { value: string };   // overload 2
 *   function parse(input: string | Uint8Array): unknown {     // implementation
 *     // ...body...
 *   }
 *
 * Key rules:
 *   - The implementation signature is **invisible** to callers. Only the
 *     overload signatures appear in tooltips and drive call-site inference.
 *   - TS resolves overloads in **source order**, picking the FIRST signature
 *     that fits the arguments. So put the most specific signatures first; a
 *     catch-all earlier would shadow the ones below.
 *   - The implementation signature's parameters must be a superset (union) of
 *     each overload's, and its return type must cover each overload's. Inside
 *     the body you only have the loose implementation type to work with.
 */

// explanation: overload 1 — a string is JSON and parses to `unknown`.
function parse(input: string): unknown;
// explanation: overload 2 — bytes are assumed to decode to a fixed record.
function parse(input: Uint8Array): { value: string };
// explanation: implementation — union params (covers both), broad return (covers both).
// Callers NEVER see this signature; they only see the two above.
function parse(input: string | Uint8Array): unknown {
  if (typeof input === "string") {
    return JSON.parse(input);
  }
  const bytes = input;
  return { value: new TextDecoder().decode(bytes) };
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — these now describe reality.

// A string argument matches overload 1 → return type is `unknown`.
expectTypeOf(parse('{"a":1}')).toEqualTypeOf<unknown>();

// A Uint8Array argument matches overload 2 → return type is `{ value: string }`.
expectTypeOf(parse(new Uint8Array())).toEqualTypeOf<{ value: string }>();

// The implementation signature is invisible: from the outside there is NO
// single `(string | Uint8Array) => unknown` overload. So a call with a value
// whose type is the *union* `string | Uint8Array` cannot be matched against
// either signature — overload resolution needs ONE signature to fit, and the
// union fits neither. This is the classic weakness of overloads vs a
// conditional-types solution (see 02-).
// explanation: we keep `maybe` as a `declare const` (no real value) inside a
// never-invoked function so that (a) TS does NOT control-flow-narrow it to a
// concrete string — which would let the overload set match — and (b) the
// reference doesn't crash at runtime.
function _unionArgDemo(maybe: string | Uint8Array) {
  // @ts-expect-error  No overload matches `string | Uint8Array` — overloads need a single signature to fit.
  parse(maybe);
}
void _unionArgDemo;
describe("parse runtime behaviour", () => {
  assert(parse('{"a":1}') !== undefined, "string path returns parsed value");
  const fromBytes = parse(new Uint8Array([104, 105])); // "hi"
  assert((fromBytes as { value: string }).value === "hi", "byte path decodes");
});

// 💡 Takeaways:
//   • Overloads give precise per-shape return types where a union return can't.
//   • The implementation signature is internal only — make it a permissive union.
//   • Resolution is positional (first match wins); order your signatures.
