/**
 * SOLUTION — `emit`: validate the payload against the map
 *
 * `emit` is the mirror of `on`: same `<K extends keyof EventMap>` constraint,
 * same `EventMap[K]` lookup — but now on the PAYLOAD argument instead of the
 * callback parameter. The caller cannot construct a payload of the wrong
 * shape for the event they named.
 *
 * With both methods in place we have a full typed round-trip:
 *
 *     bus.on("login", (p) => ...)    // p: { userId: number }
 *     bus.emit("login", { userId: 1 })   // payload validated to match
 *
 * Runtime: `emit` walks the handler list for `K` and invokes each with the
 * payload. Both sides agree on `EventMap[K]`, so the data flows through
 * without any cast.
 */

import { describe, assert, expectTypeOf } from "@lib";

type EventMap = {
  login: { userId: number };
  error: { message: string; code: number };
};

class Emitter {
  private readonly handlers = {} as {
    [K in keyof EventMap]?: Array<(payload: EventMap[K]) => void>;
  };

  on<K extends keyof EventMap>(name: K, cb: (payload: EventMap[K]) => void): void {
    // explanation: see 01-on — the cast restores the per-K correlation that
    // TS loses when indexing a homomorphic map with a generic key.
    const existing = this.handlers[name];
    if (existing === undefined) {
      this.handlers[name] = [];
    }
    const list = (this.handlers[name] ?? []) as Array<
      (payload: EventMap[K]) => void
    >;
    list.push(cb);
  }

  // explanation: identical `K` constraint to `on`; the payload is typed as
  // `EventMap[K]`, so the caller's literal object is checked against the
  // declared shape for THAT event (including excess-property checks, since the
  // payload is a fresh object literal at the call site).
  emit<K extends keyof EventMap>(name: K, payload: EventMap[K]): void {
    const list = (this.handlers[name] ?? []) as Array<
      (payload: EventMap[K]) => void
    >;
    for (const cb of list) cb(payload);
  }
}

// --- CHECKS — wrong payloads are rejected ---------------------------------

const e = new Emitter();

// @ts-expect-error  login.userId must be number, not string
e.emit("login", { userId: "1" });
// @ts-expect-error  error payload is missing `code`
e.emit("error", { message: "boom" });
// @ts-expect-error  "unknown" is not a known event
e.emit("unknown", {});

// The accepted shapes:
expectTypeOf<Parameters<Emitter["emit"]>>().toEqualTypeOf<
  [name: "login" | "error", payload: { userId: number } | { message: string; code: number }]
>();

// --- Runtime round-trip ----------------------------------------------------

describe("on + emit delivers typed payloads", () => {
  const bus = new Emitter();
  let lastUser = 0;
  let lastErr = "";
  bus.on("login", (p) => {
    lastUser = p.userId;
  });
  bus.on("error", (p) => {
    lastErr = p.message;
  });
  bus.emit("login", { userId: 42 });
  bus.emit("error", { message: "boom", code: 500 });
  assert(lastUser === 42, "login payload delivered to handler");
  assert(lastErr === "boom", "error payload delivered to handler");
});

// 💡 The payload is checked with EXCESS PROPERTY checks because it's a fresh
//    object literal passed directly to `emit`. Typo a field (`usrId`) and you
//    get a compile error — exactly the safety you want at an event boundary.
