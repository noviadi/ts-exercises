# 46 — Type-safe event emitter / router

> A typed event emitter ties each event **name** to its **payload type** via a
> map, so `on(name, cb)` and `emit(name, payload)` are both validated at
> compile time, and unknown event names are rejected outright. This is the
> foundational real-world pattern behind typed message buses, IPC routers, and
> framework event systems.

## Learning objectives

After this topic you can:

- Model an "event name → payload" relationship as an object map and use indexed
  access `Map[K]` to type a callback's argument from the event name alone.
- Reject unknown event names at the call site via `K extends keyof Map`, and
  explain why indexing the map with a non-key would yield `never` for the
  payload (the "unsatisfiable callback" guarantee).
- Generalise the whole emitter into a `TypedEmitter<M extends Record<string,
  unknown>>` that works for ANY event map — including events whose payload is
  `undefined` (no-payload events).

## Sub-exercises

1. `01-on` — a fixed 2-event map; `on(name, cb)` validates the callback arg.
   Unknown names rejected; demonstrate the `never`-payload guarantee.
2. `02-emit` — add `emit(name, payload)` that validates the payload shape
   against the map, with a runtime on→emit round-trip.
3. `03-generic-event-map` — generalise to `TypedEmitter<M>` and drive it with a
   brand-new event map (including a no-payload `undefined` event).

## Resources

- TypeScript Handbook —*[Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)*, *[Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)*.
- The `EventEmitter`/`EventEmitter2` typing discussions — canonical real-world example of name→payload maps.
- Effect / `@effect/schema` Event emissions — production-grade typed buses built on the same idea.
