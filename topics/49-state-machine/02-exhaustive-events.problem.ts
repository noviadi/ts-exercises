/**
 * PROMPT — Exhaustive events + terminal states
 *
 * A document workflow with TERMINAL states (no outgoing events):
 *
 *   draft     --SUBMIT-->  review
 *   draft     --DELETE-->  deleted
 *   review    --APPROVE--> published
 *   review    --REJECT-->  draft
 *   published --ARCHIVE--> archived
 *   archived  (terminal)
 *   deleted   (terminal)
 *
 * Your job:
 *   1. Encode `DocMachine` as a transitions type (terminal states map to `{}`).
 *   2. Derive `AllStates`, `AllEvents` (the union of every event across states).
 *   3. Write `send<S, E>(s, e)` that errors at compile time if `E` isn't legal
 *      in `S` (same trick as 01).
 *   4. Write `statusLabel(s)` that switches over EVERY state exhaustively, using
 *      `assertNever` in the default — so adding a state later is a compile error
 *      until you handle it.
 *
 * Hint: terminal states are `{}` — `keyof {}` is `never`, so no event extends it.
 *
 * Run:  npx tsc --noEmit 02-exhaustive-events.problem.ts
 */

// TODO: DocMachine, AllStates, AllEvents, send, assertNever, statusLabel.

import { expectTypeOf } from "@lib";

// CHECKS — uncomment once implemented.

// const s = send("draft", "SUBMIT");
// expectTypeOf<typeof s>().toEqualTypeOf<"review">();

// // A terminal state has no events:
// // @ts-expect-error  'archived' is terminal — no events legal
// send("archived", "SUBMIT");

// // The full event set is derived:
// expectTypeOf<AllEvents>().toEqualTypeOf<"SUBMIT" | "DELETE" | "APPROVE" | "REJECT" | "ARCHIVE">();
