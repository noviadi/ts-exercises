/**
 * PROMPT — Key remapping and filtering with `as`
 *
 * Since TS 4.1, a mapped type can rename (or drop) keys mid-loop:
 *
 *   type Rename<T> = { [K in keyof T as NewKey<K>]: T[K] };
 *
 *   - `NewKey<K>` is any expression producing a string-ish type.
 *   - If it produces `never`, the key is REMOVED from the result. This is the
 *     idiomatic, modifier-preserving way to build `Omit`.
 *
 * Implement:
 *
 *   1. CapitalizedKeys<T>     — every key becomes Capitalize<K>.
 *      e.g. { foo: 1 } -> { Foo: 1 }
 *   2. UpperKeys<T>           — every key becomes Uppercase<K>.
 *      e.g. { foo: 1 } -> { FOO: 1 }
 *   3. RemoveField<T, Field>  — drop the key named `Field` (remap it to never).
 *      e.g. RemoveField<{ kind: "x"; value: 1 }, "kind"> -> { value: 1 }
 *
 * Hints:
 *   - Keys can be `string | number | symbol`. For the string-builtins to apply
 *     cleanly, intersect with `string`: `Capitalize<K & string>`.
 *   - `Field extends keyof T` so you can guard the rename with a conditional:
 *     `P extends Field ? never : P`.
 *
 * Run:  npx tsc --noEmit 01-remap-and-filter.problem.ts
 */

type Source = { foo: number; bar: string };

// TODO: replace `any` with the mapped types described above.
type CapitalizedKeys<T> = any;
type UpperKeys<T> = any;
type RemoveField<T, Field extends keyof T> = any;

import { expectTypeOf } from "@lib";

// CHECKS — fail until the three types are correct.
expectTypeOf<CapitalizedKeys<Source>>().toEqualTypeOf<{ Foo: number; Bar: string }>();
expectTypeOf<UpperKeys<Source>>().toEqualTypeOf<{ FOO: number; BAR: string }>();
expectTypeOf<RemoveField<{ kind: "x"; value: number }, "kind">>().toEqualTypeOf<{
  value: number;
}>();
