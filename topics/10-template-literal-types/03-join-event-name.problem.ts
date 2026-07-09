/**
 * PROMPT — Recursive `Join` & `EventName` literal types
 *
 * Template literal types can be **recursive**: the type can mention itself
 * inside its own `${ }`, which lets you join a tuple of strings, derive event
 * names from a record, and much more.
 *
 * Two classic shapes:
 *
 *   1. `Join<Parts, Sep>` — concatenate a tuple of string literals with a
 *      separator, all at the type level:
 *
 *        Join<["a", "b", "c"], ".">  =>  "a.b.c"
 *
 *      Recipe: peel the head off the tuple with `infer Head, infer Next, ...rest`
 *      (or `infer Head extends string` + the rest), emit `${Head}${Sep}${Join<Rest>}`,
 *      and stop when the tuple is empty.
 *
 *   2. `EventName<E>` — given an event-map record, derive the literal union of
 *      `"on<Capitalized>"` handler names:
 *
 *        EventName<{ click: Event; scroll: Event }>
 *          =>  "onClick" | "onScroll"
 *
 *      Recipe: `keyof E` gives the key union; map each through
 *      `` `on${Capitalize<K & string>}` ``.
 *
 * Your job:
 *   1. Implement `Join<Parts, Sep>`  (Parts is a readonly tuple of strings,
 *      Sep is a single literal like `"."` or `"/"`).
 *   2. Implement `EventName<E>`      (E is a record of event-name → payload).
 *
 * Hints:
 *   - For recursion on a tuple, destructure with `Parts extends [infer Head, ...infer Rest]`
 *     and recurse on `Rest`. Add `Head extends string` so `${Head}` is valid.
 *   - The base case is the empty tuple `[]` → produce `""`.
 *   - Be careful: a single-element tuple shouldn't get a trailing separator.
 *
 * Run:  npx tsc --noEmit 03-join-event-name.problem.ts
 */

// TODO: replace each `any`.
type Join<Parts extends readonly string[], Sep extends string> = any;
type EventName<E> = any;

import { expectTypeOf } from "@lib";

// CHECKS — fail until correct.
expectTypeOf<Join<["a", "b", "c"], ".">>().toEqualTypeOf<"a.b.c">();
expectTypeOf<Join<["src", "app", "index.ts"], "/">>().toEqualTypeOf<
  "src/app/index.ts"
>();
expectTypeOf<Join<["only"], "-">>().toEqualTypeOf<"only">();
expectTypeOf<Join<[], ".">>().toEqualTypeOf<"">();

expectTypeOf<EventName<{ click: MouseEvent; scroll: Event }>>().toEqualTypeOf<
  "onClick" | "onScroll"
>();
