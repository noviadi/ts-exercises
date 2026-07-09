/**
 * SOLUTION — Generalise to `TypedEmitter<M>` for any event map
 *
 * The jump from 02 to here is small in CODE but big in IDEA: we lift the fixed
 * `EventMap` into a TYPE PARAMETER `M`, constrained by `Record<string,
 * unknown>` (every event name maps to *some* payload type — including
 * `undefined` for no-payload events). Every `EventMap[K]` from before becomes
 * `M[K]`, and the mapped handlers type becomes `{ [K in keyof M]?: ... }`.
 *
 * Because the handlers field is a MAPPED type over `keyof M` (not an index
 * signature), accessing `this.handlers[name]` for `name: K extends keyof M`
 * yields `Array<(payload: M[K]) => void> | undefined` — precise, and dot/bracket
 * access is allowed under `noPropertyAccessFromIndexSignature`.
 *
 * No-payload events: declare the payload type as `undefined`. Then
 * `emit("close", undefined)` is the only legal call, and the callback receives
 * `undefined` — typed end to end.
 */

import { describe, assert, expectTypeOf } from "@lib";

class TypedEmitter<M extends Record<string, unknown>> {
  // explanation: mapped over `keyof M`. Each slot's handler list is parameterised
  // by the same `K`, so a handler registered for event `K` must accept `M[K]`.
  private readonly handlers = {} as {
    [K in keyof M]?: Array<(payload: M[K]) => void>;
  };

  on<K extends keyof M>(name: K, cb: (payload: M[K]) => void): void {
    // explanation: same correlated-records cast as in 01-on / 02-emit — TS
    // can't prove the per-K correlation through a generic index, so we assert
    // the precise handler-list type at the point of use.
    const existing = this.handlers[name];
    if (existing === undefined) {
      this.handlers[name] = [];
    }
    const list = (this.handlers[name] ?? []) as Array<
      (payload: M[K]) => void
    >;
    list.push(cb);
  }

  emit<K extends keyof M>(name: K, payload: M[K]): void {
    const list = (this.handlers[name] ?? []) as Array<
      (payload: M[K]) => void
    >;
    for (const cb of list) cb(payload);
  }
}

// --- A brand-new event map — proof the class is fully reusable -------------

type AppEvents = {
  open: { path: string };
  data: { bytes: number };
  close: undefined; // a no-payload event
};

const bus = new TypedEmitter<AppEvents>();

bus.on("open", (p) => {
  // explanation: `p` is `AppEvents["open"]` = `{ path: string }`.
  expectTypeOf<typeof p>().toEqualTypeOf<{ path: string }>();
});
// explanation: for `close`, payload is `undefined` — the callback takes
// `(p: undefined) => void`, which a zero-arg arrow satisfies.
bus.on("close", () => {});
bus.emit("open", { path: "/etc/hosts" });
bus.emit("data", { bytes: 9001 });
bus.emit("close", undefined);

// Wrong payloads / unknown names rejected:
// @ts-expect-error  "open" payload must be { path: string }
bus.emit("open", { path: 123 });
// @ts-expect-error  "data" is missing `bytes`
bus.emit("data", {});
// @ts-expect-error  "unknown" is not in AppEvents
bus.emit("unknown", null);

// --- Runtime round-trip ----------------------------------------------------

describe("TypedEmitter round-trip with a fresh map", () => {
  const b = new TypedEmitter<AppEvents>();
  let opened = "";
  let bytes = 0;
  let closed = false as boolean;
  b.on("open", (p) => {
    opened = p.path;
  });
  b.on("data", (p) => {
    bytes = p.bytes;
  });
  b.on("close", () => {
    closed = true;
  });
  b.emit("open", { path: "/x" });
  b.emit("data", { bytes: 7 });
  b.emit("close", undefined);
  assert(opened === "/x", "open payload delivered");
  assert(bytes === 7, "data payload delivered");
  assert(closed === true, "close (no-payload) event delivered");
});

// 💡 Extensions you'd add in production: `off(name, cb)` for unsubscribe (same
//    `<K extends keyof M>` signature), a typed `once`, and making the handler
//    list typed `Set<...>` so removal is O(1). The map-parameterised core is
//    exactly what you see here — every real-world typed bus is a variation.
