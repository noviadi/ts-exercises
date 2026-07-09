/**
 * SOLUTION — union-key lookups and the `K extends keyof T` constraint
 *
 * Two ideas, both built on indexed access:
 *
 *   ① UNION KEY: `T[K1 | K2]` is `T[K1] | T[K2]` — pass several keys, get the
 *      union of their value types. This is distributive over the key union.
 *
 *   ② CONSTRAINT: when you write `<K extends keyof T>`, you make `K` a *real
 *      key of T*. That is what lets `T[K]` be sound: the compiler can prove
 *      every value of `K` lands on a defined property, so the lookup never
 *      produces an undefined-behaviour type.
 *
 * Together they model an "event map": one type describes every event and its
 * payload, and a single generic `on<E>` enforces the right handler shape per E.
 */

type Events = {
  click: { x: number; y: number };
  input: string;
  scroll: number;
};

// explanation: `Events[E]` reads the payload type for whatever E the caller
// supplies. Because E is constrained to `keyof Events`, this is always defined.
type EventPayload<E extends keyof Events> = Events[E];

// A typed `on`: E is a real event name; the callback's parameter is exactly
// the payload for that event. Get either wrong and it's a compile error.
function on<E extends keyof Events>(
  event: E,
  cb: (payload: Events[E]) => void,
): void {
  // explanation: we don't model storage here — this is a pure-types exercise.
  // The body is irrelevant; the SIGNATURE is the deliverable.
  void event;
  void cb;
}

import { describe, expectTypeOf } from "@lib";

// CHECKS — these now pass and document the behaviour.

// Single-key lookup → the exact value type:
expectTypeOf<EventPayload<"click">>().toEqualTypeOf<{ x: number; y: number }>();
expectTypeOf<EventPayload<"input">>().toEqualTypeOf<string>();
expectTypeOf<EventPayload<"scroll">>().toEqualTypeOf<number>();

// Union key → union of value types (indexed access distributes over the union):
expectTypeOf<EventPayload<"input" | "scroll">>().toEqualTypeOf<string | number>();
expectTypeOf<EventPayload<"click" | "scroll">>().toEqualTypeOf<
  { x: number; y: number } | number
>();

// Constraint: EventPayload only accepts real event names. "hover" is not one,
// so this errors — and we mark the deliberate mistake:
// @ts-expect-error  "hover" does not satisfy `extends keyof Events`
expectTypeOf<EventPayload<"hover">>().toEqualTypeOf<never>();

// `on` enforces the per-event handler shape at the call site:
on("click", (p) => {
  // p is { x: number; y: number } here:
  expectTypeOf(p).toEqualTypeOf<{ x: number; y: number }>();
});
on("input", (p) => {
  expectTypeOf(p).toEqualTypeOf<string>();
});

// A wrong handler shape is a compile error:
// @ts-expect-error  click's payload is {x;y}, not a string
on("click", (_p: string) => {});

// RUNTIME — nothing meaningful to assert (pure-types), but keep it runnable.
describe("event map typechecks", () => {
  // If this file runs at all, the type-level contract held.
});

// 💡 Takeaways:
//   • `T[union]` distributes into a union of value types — invaluable for
//     building per-key maps (events, reducers, RPC routes).
//   • The `extends keyof T` constraint is not decorative: it is what makes
//     `T[K]` provably defined. Drop it and the lookup becomes unsound.
//   • This "event map" pattern scales straight up to typed emitters / routers
//     (Topic 46) and typed APIs (Topic 50).
