/**
 * PROMPT — `on`: validate the callback against the event's payload
 *
 * Given a fixed event map, type `on` so that the callback's argument is the
 * payload type for THAT event — looked up by name from the map.
 *
 * Rules:
 *   - Don't change `EventMap`.
 *   - Fill in the `on` signature and the `handlers` field type.
 *   - Unknown event names must be REJECTED at the call site.
 *
 * Run:  npx tsc --noEmit 01-on.problem.ts
 */

import { expectTypeOf } from "@lib";

type EventMap = {
  login: { userId: number };
  error: { message: string; code: number };
};

class Emitter {
  // TODO: a record of handler arrays, keyed by event name. Use a mapped type
  // over `keyof EventMap` so each slot only accepts callbacks for its payload.
  private readonly handlers = TODO;

  // TODO: `name` must be a key of EventMap; the callback's arg must be that
  // event's payload type.
  on(name: TODO, cb: TODO): void {
    // TODO: store the callback.
  }
}

// CHECKS — compile only when on() is correctly typed.
const e = new Emitter();

// Callback arg is precisely typed per event:
e.on("login", (p) => {
  // p: { userId: number }
  return p.userId + 1;
});
e.on("error", (p) => {
  // p: { message: string; code: number }
  return p.message.toUpperCase();
});

// Unknown event names are rejected:
// @ts-expect-error  "bogus" is not a known event
e.on("bogus", () => {});

// Wrong callback shape is rejected:
// @ts-expect-error  login payload is { userId: number }, not string
e.on("login", (p) => p.userId.length);
