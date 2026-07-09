/**
 * PROMPT — union-key lookups and the `K extends keyof T` constraint
 *
 * Indexed access gets powerful when the key is a UNION:
 *
 *   type V = User["id" | "name"]; // number | string
 *
 * And when a generic K is CONSTRAINED with `extends keyof T`, lookups become
 * provably safe — the compiler can guarantee `T[K]` is well-defined.
 *
 * Scenario: a tiny event map. Implement the lookup type and a typed `on`
 * function so registering a handler for `"click"` requires a `{x,y}` callback,
 * `"input"` requires `(string) => void`, etc.
 *
 * Tasks:
 *   1. Fill in `EventPayload<E>` using indexed access on `Events`.
 *   2. Implement `on<E>` so the callback's parameter type matches the payload.
 *   3. Fix the CHECKS to describe the true types.
 *
 * Run:  npx tsc --noEmit 02-lookup-and-constraint.problem.ts
 */

type Events = {
  click: { x: number; y: number };
  input: string;
  scroll: number;
};

// TODO: the payload type for event E, looked up from Events.
type EventPayload<E extends keyof Events> = any;

// TODO: register a handler whose parameter is Events[E].
function on<E extends keyof Events>(event: E, cb: (payload: any) => void): void {
  // (storage not modelled — pure types exercise)
}

import { expectTypeOf } from "@lib";

// CHECKS — fix to describe the truth.

// Single-key lookup:
expectTypeOf<EventPayload<"click">>().toEqualTypeOf<{ x: number; y: number }>();
expectTypeOf<EventPayload<"input">>().toEqualTypeOf<string>();

// Union-key lookup → union of the value types:
expectTypeOf<EventPayload<"input" | "scroll">>().toEqualTypeOf<string | number>();

// Constraint enforcement: EventPayload only accepts real event names.
// (Decide: keep as-is, or @ts-expect-error.)
expectTypeOf<EventPayload<"hover">>().toEqualTypeOf<never>();
