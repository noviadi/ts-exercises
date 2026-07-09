/**
 * PROMPT — Generalise to `TypedEmitter<M>` for any event map
 *
 * So far `Emitter` was hard-wired to one `EventMap`. Generalise it: a single
 * class `TypedEmitter<M extends Record<string, unknown>>` that works for ANY
 * payload map a caller brings — including events whose payload is `undefined`
 * (no-payload events).
 *
 * Rules:
 *   - Fill in the class generic signature, the `handlers` field, and both
 *     `on`/`emit` methods so they're parameterised by `M`.
 *   - Don't change the CHECKS or the runtime `describe`.
 *
 * Run:  npx tsc --noEmit 03-generic-event-map.problem.ts
 */

import { describe, assert, expectTypeOf } from "@lib";

// TODO: a generic emitter parameterised by an event map `M`.
class TypedEmitter<M extends Record<string, unknown>> {
  private readonly handlers = TODO;

  on(name: TODO, cb: TODO): void {
    // TODO
  }

  emit(name: TODO, payload: TODO): void {
    // TODO
  }
}

// A brand-new event map — proof the class is reusable, not tied to one map.
type AppEvents = {
  open: { path: string };
  data: { bytes: number };
  close: undefined; // a no-payload event
};

// CHECKS
const bus = new TypedEmitter<AppEvents>();

bus.on("open", (p) => {
  expectTypeOf<typeof p>().toEqualTypeOf<{ path: string }>();
});
bus.on("close", () => {});
bus.emit("open", { path: "/etc/hosts" });
bus.emit("data", { bytes: 9001 });
bus.emit("close", undefined);

// @ts-expect-error  "open" payload must be { path: string }
bus.emit("open", { path: 123 });
// @ts-expect-error  "data" is missing `bytes`
bus.emit("data", {});
// @ts-expect-error  "unknown" is not in AppEvents
bus.emit("unknown", null);

describe("TypedEmitter round-trip with a fresh map", () => {
  const b = new TypedEmitter<AppEvents>();
  let opened = "";
  let bytes = 0;
  let closed = false;
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
