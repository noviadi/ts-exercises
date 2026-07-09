/**
 * SOLUTION — Nested ternary chains
 *
 * A nested conditional type is the type-system equivalent of an
 * `if / else if / else` ladder. The first `extends` that succeeds wins, and
 * the last branch is the catch-all `else`.
 *
 *   T extends A ? X      // if      (T assignable to A) → X
 *   : T extends B ? Y    // else if (T assignable to B) → Y
 *   : T extends C ? Z    // else if (T assignable to C) → Z
 *   : D                  // else                        → D
 *
 * Ordering matters: put the most specific tests first. `boolean` is really
 * `true | false`, and `null`/`object` interplay means an `{}` will satisfy
 * several checks, so we test primitives before falling through to "object".
 */

// explanation: walk down the union, asking "is T assignable to X?" for each
// kind. Because we return a string literal in each branch, the result is the
// exact literal type — not the widened `string` — which is what makes it
// useful for exhaustive switches later. The trailing "object" is the `else`.
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends bigint ? "bigint" :
  T extends symbol ? "symbol" :
  T extends undefined ? "undefined" :
  T extends null ? "null" :
  T extends ((...args: never[]) => unknown) ? "function" :
  "object";

// explanation: a minimal type-level ternary. Constraint `C extends boolean`
// guarantees the caller passes a type-level flag. `C extends true ? T : F`
// then selects the branch. When C is the literal `true`, you get T; for the
// literal `false`, you get F.
type If<C extends boolean, T, F> = C extends true ? T : F;

import { expectTypeOf } from "@lib";

// CHECKS — all pass.

expectTypeOf<TypeName<"hi">>().toEqualTypeOf<"string">();
expectTypeOf<TypeName<true>>().toEqualTypeOf<"boolean">();
expectTypeOf<TypeName<() => void>>().toEqualTypeOf<"function">();
expectTypeOf<TypeName<null>>().toEqualTypeOf<"null">();
expectTypeOf<TypeName<{ a: 1 }>>().toEqualTypeOf<"object">();

expectTypeOf<If<true, "yes", "no">>().toEqualTypeOf<"yes">();
expectTypeOf<If<false, "yes", "no">>().toEqualTypeOf<"no">();

// 💡 Note on ordering: `boolean` is `true | false` (a union). Because the
//    parameter here is checked naked, the conditional *distributes* over it
//    (Topic 07). That's why `TypeName<true>` cleanly yields `"boolean"` rather
//    than getting tangled up — each member of the union is classified on its
//    own and the results union back together. Distribution is doing work for
//    us here; in Topic 07 we'll see when we want to suppress it.
