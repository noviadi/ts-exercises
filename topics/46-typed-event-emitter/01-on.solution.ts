/**
 * SOLUTION — `on`: validate the callback against the event's payload
 *
 * The whole pattern is one indexed-access type: `EventMap[K]`. Once `K` is
 * constrained to `keyof EventMap`, the compiler can look up the EXACT payload
 * type for whatever name the caller passes, and type the callback's parameter
 * with it. No overloads, no unions — the map does the dispatching.
 *
 * Rejecting unknown names: `K extends keyof EventMap` means passing `"bogus"`
 * fails the constraint outright — a hard compile error at the call site.
 *
 * The "never" guarantee: even if we DIDN'T constrain K, indexing the map with
 * a non-key yields `never` — a callback `(payload: never) => void` can never
 * be safely invoked with a real value, so the type system makes the unsound
 * path uninhabitable. We demonstrate that below.
 */

import { expectTypeOf } from "@lib";

type EventMap = {
  login: { userId: number };
  error: { message: string; code: number };
};

class Emitter {
  // explanation: a MAPPED type (not an index signature) over `keyof EventMap`.
  // Each property is the handler list for THAT event, and each list is typed
  // `(payload: EventMap[K]) => void` — so a login handler can't be pushed into
  // the error slot. `?` makes each slot lazily allocated.
  private readonly handlers = {} as {
    [K in keyof EventMap]?: Array<(payload: EventMap[K]) => void>;
  };

  // explanation: `K extends keyof EventMap` ties name → payload. The callback's
  // parameter is `EventMap[K]`, looked up by the very same `K` the caller chose.
  on<K extends keyof EventMap>(name: K, cb: (payload: EventMap[K]) => void): void {
    // explanation: TS can't correlate the generic key `K` across the mapped
    // container and the callback, so the slot would be typed `never[]`. We
    // assert the precise per-K handler-list type at the point of use — sound by
    // construction, because both `name` and `cb` carry the same `K`. (This is
    // the well-known "correlated records" limitation of homomorphic maps.)
    const existing = this.handlers[name];
    if (existing === undefined) {
      this.handlers[name] = [];
    }
    const list = (this.handlers[name] ?? []) as Array<
      (payload: EventMap[K]) => void
    >;
    list.push(cb);
  }
}

// --- CHECKS — callback args are precisely typed ----------------------------

const e = new Emitter();

e.on("login", (p) => {
  // explanation: `p` is `EventMap["login"]` = `{ userId: number }`.
  expectTypeOf<typeof p>().toEqualTypeOf<{ userId: number }>();
  return p.userId + 1;
});
e.on("error", (p) => {
  expectTypeOf<typeof p>().toEqualTypeOf<{ message: string; code: number }>();
  return p.message.toUpperCase();
});

// Unknown event names are rejected by the `K extends keyof EventMap` constraint:
// @ts-expect-error  "bogus" is not a known event
e.on("bogus", () => {});

// Wrong callback shape is rejected (payload type mismatch):
// @ts-expect-error  login payload is { userId: number }, not string
e.on("login", (p) => p.userId.length);

// --- The "never payload" guarantee ----------------------------------------

// explanation: if you index EventMap with something that is NOT a key (by
// intersecting with keyof, an unknown literal collapses to `never`), the
// payload type becomes `never`. That's the underlying reason unknown events
// are unsatisfiable — the map has no entry, so there's no value to emit.
type BogusPayload = EventMap[keyof EventMap & "bogus"];
expectTypeOf<BogusPayload>().toBeNever();

// 💡 `on` returns `void` here; we exercise the actual delivery in 02-emit.
