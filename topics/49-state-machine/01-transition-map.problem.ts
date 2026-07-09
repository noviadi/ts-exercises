/**
 * PROMPT — Transition map: reject illegal events at compile time
 *
 * A traffic light:
 *
 *   green  --TICK--> yellow
 *   yellow --TICK--> red
 *   red    --TICK--> green
 *   green  --STOP--> red      (only legal from green)
 *
 * Encode it as a type, then write `transition(state, event)` so that calling it
 * with an event that's ILLEGAL in the current state is a compile error.
 *
 * Your job:
 *   1. Fill in the `Transitions` type (states → events → next state).
 *   2. Derive `States`, `EventsFor<S>`, `Next<S,E>` from it.
 *   3. Type `transition` so its `event` parameter is bounded to `EventsFor<S>`.
 *   4. Uncomment the CHECKS, including the `@ts-expect-error` lines.
 *
 * Hint: `transition<S extends States, E extends EventsFor<S>>(s: S, e: E): Next<S, E>`.
 *
 * Run:  npx tsc --noEmit 01-transition-map.problem.ts
 */

// TODO: Transitions, States, EventsFor, Next, transition.

import { expectTypeOf } from "@lib";

// CHECKS — uncomment once your types/function exist.

// const a = transition("green", "TICK");
// expectTypeOf<typeof a>().toEqualTypeOf<"yellow">();

// const b = transition("green", "STOP");
// expectTypeOf<typeof b>().toEqualTypeOf<"red">();

// // 'STOP' is not legal from yellow:
// // @ts-expect-error  'STOP' is not a valid event in state 'yellow'
// transition("yellow", "STOP");

// // A bogus state is rejected too:
// // @ts-expect-error  'purple' is not a state
// transition("purple", "TICK");
