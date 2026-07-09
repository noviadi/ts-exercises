# 49 — Finite State Machine typing

> A state machine is a map of `{ state → { event → next state } }`. The goal is
> to type `transition(state, event)` so that an **illegal** event for the current
> state is a **compile error** — not a runtime surprise. Exhaustiveness falls out
> of the same `keyof`-over-the-map trick.

## TL;DR

- Define the machine as a plain object *type* `{ [S]: { [E]: S' } }`. The keys
  ARE the states; each state's inner keys are the events legal there.
- `type EventsFor<S> = keyof Machine[S]` derives the legal events per state.
- `type Next<S, E> = Machine[S][E]` is the resulting state — only callable when
  `E` is actually legal in `S`.
- A `transition(state, event)` whose `E extends EventsFor<S>` constraint rejects
  illegal combos at the call site.

## Learning objectives

After this topic you can:

- Encode a finite-state machine as a TypeScript type and derive states/events
  from it with `keyof`.
- Make illegal `(state, event)` transitions a compile error via a bounded
  generic.
- Use `never` to model terminal states (no outgoing events) and prove
  exhaustiveness when the map changes.

## Sub-exercises

1. `01-transition-map` — a traffic-light machine; `transition(state, event)`
   rejects illegal events at compile time.
2. `02-exhaustive-events` — a document workflow with terminal states; derive the
   full event set; an exhaustive handler that breaks loudly if a state is added.

## Resources

- TypeScript Handbook —*[ Keyof ](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)*
  and*[ Indexed Access ](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)*.
- XState — the canonical TS state-machine library; its types are built on this
  exact pattern (<https://xstate.js.org/>).
- Related: Topic 19 (exhaustiveness with `never`), Topic 18 (discriminated
  unions), Topic 50 (capstone uses the transition-map idea).
