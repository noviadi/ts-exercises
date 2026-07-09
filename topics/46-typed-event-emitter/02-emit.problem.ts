/**
 * PROMPT — `emit`: validate the payload against the map
 *
 * Add an `emit` method that takes an event name and its payload, validated
 * against `EventMap`. Together with `on`, this gives a full typed round-trip.
 *
 * Rules:
 *   - Reuse the same `EventMap`.
 *   - Fill in `emit`'s signature and body. The payload type must be derived
 *     from the event name.
 *   - Don't change the runtime `describe` block — it must pass as-is.
 *
 * Run:  npx tsc --noEmit 02-emit.problem.ts
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
    const list = this.handlers[name] ?? (this.handlers[name] = []);
    list.push(cb);
  }

  // TODO: payload must be EventMap[K] for the given name.
  emit(name: TODO, payload: TODO): void {
    // TODO: invoke every registered handler for `name` with `payload`.
  }
}

// CHECKS
const e = new Emitter();

// @ts-expect-error  login.userId must be number, not string
e.emit("login", { userId: "1" });
// @ts-expect-error  error payload is missing `code`
e.emit("error", { message: "boom" });
// @ts-expect-error  "unknown" is not a known event
e.emit("unknown", {});

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
