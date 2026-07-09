/**
 * SOLUTION — Exhaustive events + terminal states
 *
 * Two new ideas on top of 01:
 *
 *   ① TERMINAL STATES. A state with no outgoing events is encoded as `{}`.
 *      `keyof {}` is `never`, so `EventsFor<"archived">` = `never` — no event
 *      can ever satisfy `E extends never`, making every `send("archived", ...)`
 *      a compile error. The type system models "this state is a dead end".
 *
 *   ② EXHAUSTIVENESS via `never`. A `switch` over every state, with an
 *      `assertNever(s)` default, breaks at compile time if a new state is added
 *      to the machine without updating the switch. This is the same trick as
 *      Topic 19, applied to the machine's state union.
 *
 * Deriving the FULL event set (`AllEvents`) is a nice payoff: map each state to
 * its events and union them. That's a distributive conditional over `AllStates`.
 */
import { assert, describe, expectTypeOf } from "@lib";

// The machine. Terminal states (`archived`, `deleted`) map to `{}`.
type DocMachine = {
  draft: { SUBMIT: "review"; DELETE: "deleted" };
  review: { APPROVE: "published"; REJECT: "draft" };
  published: { ARCHIVE: "archived" };
  archived: {};
  deleted: {};
};

type AllStates = keyof DocMachine;

// explanation: the per-state legal events. For terminal states this is
// `keyof {}` = `never`, so no event can ever be passed.
type EventsFor<S extends AllStates> = keyof DocMachine[S];

// The full event set: for each state, take its events; union them all. We map
// over AllStates (a union), so the conditional distributes and unions the keys.
// explanation: `[DocMachine[S]]` (the `[T]` wrapper) prevents `S` from
// distributing in a way that loses members; here we WANT distribution over
// AllStates, so the plain `S extends AllStates ? keyof DocMachine[S] : never`
// form unions each per-state event union into one big union.
type AllEvents = AllStates extends infer S ? (S extends AllStates ? EventsFor<S & AllStates> : never) : never;

// Next-state lookup, as in 01.
type Next<S extends AllStates, E extends EventsFor<S>> = DocMachine[S][E];

// The runtime map (kept in sync with the type above).
const docMachine: DocMachine = {
  draft: { SUBMIT: "review", DELETE: "deleted" },
  review: { APPROVE: "published", REJECT: "draft" },
  published: { ARCHIVE: "archived" },
  archived: {},
  deleted: {},
};

function send<S extends AllStates, E extends EventsFor<S>>(s: S, e: E): Next<S, E> {
  return docMachine[s][e];
}

// The classic exhaustiveness helper (see Topic 19).
function assertNever(x: never): never {
  throw new Error(`Unexpected state: ${JSON.stringify(x)}`);
}

// explanation: this switch is exhaustive over `AllStates`. In the default branch
// `s` has been narrowed to `never` (every case handled), so `assertNever(s)`
// compiles. If a new state is later added to DocMachine, this stops compiling
// until you add its case — exactly the safety net we want.
type Label = "editing" | "in-review" | "live" | "stored" | "removed";
function statusLabel(s: AllStates): Label {
  switch (s) {
    case "draft":
      return "editing";
    case "review":
      return "in-review";
    case "published":
      return "live";
    case "archived":
      return "stored";
    case "deleted":
      return "removed";
    default:
      return assertNever(s);
  }
}

// CHECKS — type-level.

const submitted = send("draft", "SUBMIT");
expectTypeOf<typeof submitted>().toEqualTypeOf<"review">();

const rejected = send("review", "REJECT");
expectTypeOf<typeof rejected>().toEqualTypeOf<"draft">();

// A terminal state has no events — compile error. At runtime the illegal lookup
// returns `undefined` but does not throw, so the demo line ships safely.
// @ts-expect-error  'archived' is terminal — no events are legal
send("archived", "SUBMIT");
// @ts-expect-error  'deleted' is terminal — no events are legal
send("deleted", "ARCHIVE");

// The full event set is derived purely from the map:
expectTypeOf<AllEvents>().toEqualTypeOf<
  "SUBMIT" | "DELETE" | "APPROVE" | "REJECT" | "ARCHIVE"
>();

// RUNTIME — the machine advances and every state gets a label.
describe("document workflow", () => {
  assert(send("draft", "SUBMIT") === "review", "draft→review");
  assert(send("review", "APPROVE") === "published", "review→published");
  assert(send("review", "REJECT") === "draft", "review→draft");
  assert(send("published", "ARCHIVE") === "archived", "published→archived");
  assert(send("draft", "DELETE") === "deleted", "draft→deleted");

  assert(statusLabel("draft") === "editing", "draft label");
  assert(statusLabel("archived") === "stored", "archived label");
  assert(statusLabel("deleted") === "removed", "deleted label");

  // assertNever throws when fed something impossible:
  let threw = false;
  try {
    assertNever(undefined as unknown as never);
  } catch {
    threw = true;
  }
  assert(threw, "assertNever throws on the impossible");
});

// 💡 Takeaways:
//   • Terminal states = `{}`. `keyof {}` = `never`, which makes "no event legal"
//     fall out for free from the same `E extends EventsFor<S>` constraint.
//   • A switch with `assertNever` default turns "I forgot a state" into a
//     compile error — adopt it for every exhaustive handler over the state union.
//   • The full event set is derivable from the map with a distributive
//     conditional — the map is the single source of truth.
