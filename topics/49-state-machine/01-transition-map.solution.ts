/**
 * SOLUTION — Transition map: reject illegal events at compile time
 *
 * The whole technique is "encode the machine as a type, then derive everything
 * else with `keyof` and indexed access". The machine is a plain object type:
 *
 *   type Transitions = {
 *     green:  { TICK: "yellow"; STOP: "red" };
 *     yellow: { TICK: "red" };
 *     red:    { TICK: "green" };
 *   };
 *
 * From that single definition:
 *   - States      = keyof Transitions                         ("green"|"yellow"|"red")
 *   - EventsFor<S> = keyof Transitions[S]                      (legal events in S)
 *   - Next<S,E>   = Transitions[S][E]                          (resulting state)
 *
 * The `transition` function bounds its type parameters so an illegal (state,
 * event) pair cannot even be expressed:
 *
 *   function transition<S extends States, E extends EventsFor<S>>(s: S, e: E): Next<S, E>
 *
 * `E extends EventsFor<S>` is the crux: E is constrained to the events that are
 * keys of `Transitions[S]`. Call `transition("yellow", "STOP")` and "STOP" does
 * NOT extend `keyof Transitions["yellow"]` (which is just "TICK") → compile error.
 */
import { assert, describe, expectTypeOf } from "@lib";

// The machine, as a type. The value literal `machine` below must satisfy it, so
// the runtime map and the type stay in sync.
type Transitions = {
  green: { TICK: "yellow"; STOP: "red" };
  yellow: { TICK: "red" };
  red: { TICK: "green" };
};

// Derived helpers — pure type-level.
type States = keyof Transitions;
type EventsFor<S extends States> = keyof Transitions[S];
type Next<S extends States, E extends EventsFor<S>> = Transitions[S][E];

// explanation: the generic constraint `E extends EventsFor<S>` is what makes
// illegal transitions unrepresentable. `s` and `e` are also used to index the
// runtime map; the cast asserts the lookup matches the (already-checked) type.
const machine: Transitions = {
  green: { TICK: "yellow", STOP: "red" },
  yellow: { TICK: "red" },
  red: { TICK: "green" },
};

function transition<S extends States, E extends EventsFor<S>>(s: S, e: E): Next<S, E> {
  // explanation: the type-level constraint above already rejects illegal (s, e)
  // pairs at the call site, so for any LEGAL call `machine[s][e]` always
  // resolves. The optional chaining is a defensive runtime guard: if the
  // function is ever reached with a bad state (e.g. via `as any`), it returns
  // `undefined` instead of throwing — matching how the @ts-expect-error demo
  // lines below behave at runtime. The cast re-asserts the type-level guarantee.
  return machine[s]?.[e] as Next<S, E>;
}

// CHECKS — every legal transition infers its exact target state.

const a = transition("green", "TICK");
expectTypeOf<typeof a>().toEqualTypeOf<"yellow">();

const b = transition("green", "STOP");
expectTypeOf<typeof b>().toEqualTypeOf<"red">();

const c = transition("yellow", "TICK");
expectTypeOf<typeof c>().toEqualTypeOf<"red">();

const d = transition("red", "TICK");
expectTypeOf<typeof d>().toEqualTypeOf<"green">();

// 'STOP' is not legal from yellow — compile error. The bare call would also
// return `undefined` at runtime (an illegal lookup), but it never throws, so the
// demo line is safe to ship alongside the runtime checks below.
// @ts-expect-error  'STOP' is not a valid event in state 'yellow'
transition("yellow", "STOP");

// 'STOP' is not legal from red either:
// @ts-expect-error  'STOP' is not a valid event in state 'red'
transition("red", "STOP");

// A bogus state is rejected by `S extends States`:
// @ts-expect-error  'purple' is not a state
transition("purple", "TICK");

// RUNTIME — the function actually advances the machine.
describe("traffic light transitions", () => {
  assert(transition("green", "TICK") === "yellow", "green→yellow");
  assert(transition("green", "STOP") === "red", "green→red (emergency)");
  assert(transition("yellow", "TICK") === "red", "yellow→red");
  assert(transition("red", "TICK") === "green", "red→green");

  // A full cycle: green → yellow → red → green.
  const cycle = transition(
    transition(transition("green", "TICK"), "TICK"),
    "TICK",
  );
  assert(cycle === "green", "full cycle returns to green");
});

// 💡 Takeaways:
//   • Encode the machine ONCE as a type; derive states, events, and next-state
//     with keyof + indexed access. No duplication.
//   • A bounded generic (`E extends EventsFor<S>`) turns "illegal transition"
//     into a compile error — the call site can't even express it.
//   • The runtime map satisfies the type, so type and value can't drift.
