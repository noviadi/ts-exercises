/**
 * PROMPT — Strip optionality with `-?`; build `Required<T>` by hand
 *
 * The second modifier a mapped type can flip is **optionality** (`?`). Same
 * `+`/`-` idea, applied to the `?` instead of `readonly`:
 *
 *     { [K in keyof T]?:      T[K] }   // === +? : makes every property optional
 *     { [K in keyof T]-?:     T[K] }   // removes `?` — every property becomes required
 *
 * ⚠️ Subtlety: writing `T[K]` alone does NOT strip `?`. The optional-ness is
 * a property of the *key*, not the value type, so you need `-?` to remove it.
 *
 * Your job:
 *   1. Implement `Required<T>`   — remove `?` from every property.
 *   2. Implement `Optional<T>`   — add `?` to every property.
 *   3. Implement `Bare<T>`       — remove BOTH `?` AND `readonly` from every property.
 *
 * Run:  npx tsc --noEmit 02-required-and-strip-optionality.problem.ts
 */

type User = {
  id: number;
  name?: string;
  readonly email?: string;
};

// TODO: implement these three mapped types.
type Required2<T> = any; // strip `?`
type Optional<T> = any; // add `?`
type Bare<T> = any; // strip BOTH `?` and `readonly`

import { expectTypeOf } from "@lib";

// CHECKS — fail until you've implemented them correctly.

expectTypeOf<Required2<User>>().toEqualTypeOf<{
  id: number;
  name: string;
  readonly email: string;
}>();

expectTypeOf<Optional<User>>().toEqualTypeOf<{
  id?: number | undefined;
  name?: string | undefined;
  readonly email?: string | undefined;
}>();

expectTypeOf<Bare<User>>().toEqualTypeOf<{
  id: number;
  name: string;
  email: string;
}>();
