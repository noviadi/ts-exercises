/**
 * PROMPT — Generate getter/setter maps with `as` + template literals
 *
 * Combining the `as` clause with a **template literal** key lets you derive a
 * whole new vocabulary of keys from each source property. The classic:
 *
 *   { foo: number; bar: string }
 *      -> { getFoo: () => number; getBar: () => string }
 *      -> { setFoo: (v: number) => void; setBar: (v: string) => void }
 *
 * The recipe:
 *
 *   type Getters<T> = {
 *     [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
 *   };
 *
 * Your job:
 *   1. Implement Getters<T>   — one `getFoo` per property, returning T[K].
 *   2. Implement Setters<T>   — one `setFoo` per property, taking T[K].
 *   3. Implement Accessors<T> — a Getters & Setters intersection.
 *
 * Rules:
 *   - Use `as` + template literals only — no hand-listing of keys.
 *   - Setter returns `void` (the conventional "I just stored it" return).
 *
 * Run:  npx tsc --noEmit 02-getters-setters.problem.ts
 */

type Shape = { x: number; y: number; label: string };

// TODO: replace `any`.
type Getters<T> = any;
type Setters<T> = any;
type Accessors<T> = any;

import { expectTypeOf } from "@lib";

// CHECKS — fail until implemented correctly.
expectTypeOf<Getters<Shape>>().toEqualTypeOf<{
  getX: () => number;
  getY: () => number;
  getLabel: () => string;
}>();
expectTypeOf<Setters<Shape>>().toEqualTypeOf<{
  setX: (v: number) => void;
  setY: (v: number) => void;
  setLabel: (v: string) => void;
}>();
