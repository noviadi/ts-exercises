/**
 * SOLUTION — Range of literal numbers & the recursion limit
 *
 * ── The counting primitive: `BuildTo<N>` ─────────────────────────────────────
 *
 *   type BuildTo<N, Acc = []> =
 *     Acc["length"] extends N ? Acc : BuildTo<N, [...Acc, unknown]>;
 *
 * Read it as a `while` loop:
 *
 *     let Acc = [];
 *     while (Acc.length !== N) Acc = [...Acc, unknown];
 *     return Acc;
 *
 * Two type-system features make this possible:
 *
 *   1. **Default type parameters** (`Acc = []`) — gives us a "mutable variable"
 *      threaded through the recursion. Callers don't see it.
 *   2. **Variadic spread in a tuple literal** (`[...Acc, unknown]`) — appends
 *      one element, growing the length by exactly 1 each step.
 *
 * The base case `Acc["length"] extends N` is what *terminates* the recursion.
 * Forget it and TS will error with `Type instantiation is excessively deep`
 * (its recursion brake fires around a few hundred to ~1000 instantiations).
 *
 * ── `Range<From, To>` ────────────────────────────────────────────────────────
 *
 * Now we walk an index `I` from `0` upward. At each step we decide:
 *
 *   • Have we reached `To`?        → stop, return `[]` (base case).
 *   • Are we already collecting?   → emit `I["length"]` and keep going.
 *   • Have we just hit `From`?     → start collecting, emit `I["length"]`.
 *   • Otherwise (below From)       → advance `I` without emitting.
 *
 * The `Collecting extends boolean` flag remembers "we've started" so that once
 * we pass `From` we keep emitting every step until `To`.
 *
 * ── The recursion / instantiation limit (read this) ─────────────────────────
 *
 * TypeScript enforces two related brakes:
 *
 *   • Conditional-type recursion depth: a handful of hundred nested
 *     instantiations (the exact number is internal and varies by version).
 *   • Tuple length cap: a tuple type may have at most **10 000** elements
 *     (`Type produces a tuple type that is too large to represent`).
 *
 * In PRACTICE you should stay well under ~1000 — both to avoid the hard caps
 * and because every step is a fresh type instantiation that slows the compiler.
 * `BuildTo<500>` is fine; `BuildTo<5000>` risks long compile times; anything
 * past 10000 is a hard error. If you need bigger ranges, chunk the work at the
 * value level, not in the type system.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: count up by appending one `unknown` per recursive step until the
// accumulator's length equals N. The `extends N` test IS the base case. We keep
// everything `readonly` to match the encoding convention from `01`.
type BuildTo<N extends number, Acc extends readonly unknown[] = readonly []> =
  Acc["length"] extends N ? Acc : BuildTo<N, readonly [...Acc, unknown]>;

// explanation: walk I from 0; emit I["length"] once Collecting turns true
// (which happens exactly when I["length"] === From). Stop when I hits To.
type Range<
  From extends number,
  To extends number,
  I extends readonly unknown[] = [],
  Collecting extends boolean = false,
> = I["length"] extends To
  ? []
  : Collecting extends true
    ? [I["length"], ...Range<From, To, [...I, unknown], true>]
    : I["length"] extends From
      ? [I["length"], ...Range<From, To, [...I, unknown], true>]
      : Range<From, To, [...I, unknown], false>;

// CHECKS — compile-time.
expectTypeOf<BuildTo<0>>().toEqualTypeOf<readonly []>();
expectTypeOf<BuildTo<3>>().toEqualTypeOf<readonly [unknown, unknown, unknown]>();
expectTypeOf<BuildTo<3>["length"]>().toEqualTypeOf<3>();

// Range semantics: [From .. To-1], Python-style (inclusive of From, exclusive of To).
expectTypeOf<Range<0, 0>>().toEqualTypeOf<[]>();
expectTypeOf<Range<0, 3>>().toEqualTypeOf<[0, 1, 2]>();
expectTypeOf<Range<2, 5>>().toEqualTypeOf<[2, 3, 4]>();
expectTypeOf<Range<5, 6>>().toEqualTypeOf<[5]>();

// A slightly larger range still typechecks comfortably (we are far below the cap).
expectTypeOf<Range<10, 15>>().toEqualTypeOf<[10, 11, 12, 13, 14]>();

// RUNTIME — materialise a Range as a real array so the behaviour is observable.
// (Range's elements are number literals; at runtime they're just numbers.)
describe("02-range-recursion-limit runtime checks", () => {
  const r: Range<2, 5> = [2, 3, 4];
  assert(r.length === 3, "Range<2,5> has 3 elements");
  assert(r[0] === 2 && r[2] === 4, "Range endpoints are correct");

  // BuildTo lets us size a fixed-length buffer at the type level.
  const buf: BuildTo<4> = [0, 0, 0, 0];
  assert(buf.length === 4, "BuildTo<4> describes a length-4 buffer");

  // The cap is real — uncomment to feel it (kept commented so the file
  // typechecks). This is the error you'd hit around 10 000 elements:
  //
  //   type TooBig = BuildTo<10000>;
  //   // error TS2590: Type produces a tuple type that is too large to represent.
});
