/**
 * SOLUTION — Recursive `Join` & `EventName` literal types
 *
 * Template literal types can mention THEMSELVES inside their own `${ }`. That
 * self-reference is what makes them Turing-ish: you can recurse over a tuple
 * or a string until a base case is reached.
 *
 * ── Join ───────────────────────────────────────────────────────────────────
 *
 * The pattern is a classic head/tail recursion over a tuple:
 *
 *   type Join<Parts, Sep> =
 *     Parts extends [infer Head extends string, ...infer Rest extends string[]]
 *       ? Rest["length"] extends 0
 *         ? Head                              // last element: no trailing sep
 *         : `${Head}${Sep}${Join<Rest, Sep>}` // glue + recurse on the tail
 *       : "";                                  // empty tuple -> empty string
 *
 *   • `infer Head extends string` simultaneously pulls out the first element
 *     AND constrains it to `string`, so `${Head}` is a legal placeholder.
 *   • `...infer Rest extends string[]` is the tail (a tuple of the remaining
 *     elements), constrained so the recursive `Join<Rest, Sep>` call is legal.
 *   • The `Rest["length"] extends 0` guard avoids a trailing separator: when
 *     only one element is left, we emit just `Head` rather than `Head + Sep`.
 *
 * ── EventName ──────────────────────────────────────────────────────────────
 *
 * `keyof E` gives the literal union of event keys (`"click" | "scroll"`).
 * Map each through `` `on${Capitalize<K & string>}` `` to get
 * `"onClick" | "onScroll"`. Distributive conditional types (Topic 07) do the
 * per-member mapping for free:
 *
 *   type EventName<E> = keyof E extends infer K
 *     ? K extends string
 *       ? `on${Capitalize<K>}`
 *       : never
 *     : never;
 *
 * (We `K extends string` to satisfy `Capitalize`, which only takes a string.
 * Non-string keys collapse to `never` and are dropped.)
 */

// explanation: head/tail recursion over a readonly tuple of strings. The
// `Rest["length"] extends 0` branch prevents a trailing separator.
type Join<Parts extends readonly string[], Sep extends string> =
  Parts extends [
    infer Head extends string,
    ...infer Rest extends string[],
  ]
    ? Rest["length"] extends 0
      ? Head
      : `${Head}${Sep}${Join<Rest, Sep>}`
    : "";

// explanation: `keyof E` is the event-name union. Distribute over it, Capitalize
// each member, and prefix with the literal "on". Non-string keys drop to never.
type EventName<E> = keyof E extends infer K
  ? K extends string
    ? `on${Capitalize<K>}`
    : never
  : never;

import { assert, describe, assertEquals, expectTypeOf } from "@lib";

// CHECKS — compile-time.

// Join concatenates with the separator:
expectTypeOf<Join<["a", "b", "c"], ".">>().toEqualTypeOf<"a.b.c">();
expectTypeOf<Join<["src", "app", "index.ts"], "/">>().toEqualTypeOf<
  "src/app/index.ts"
>();

// A single-element tuple: no separator emitted.
expectTypeOf<Join<["only"], "-">>().toEqualTypeOf<"only">();

// The empty tuple is the base case — the empty string literal.
expectTypeOf<Join<[], ".">>().toEqualTypeOf<"">();

// EventName derives "on<Capitalized>" per key of the event map:
expectTypeOf<
  EventName<{ click: MouseEvent; scroll: Event }>
>().toEqualTypeOf<"onClick" | "onScroll">();

// A single-event map collapses to a single literal (not a union):
expectTypeOf<EventName<{ submit: Event }>>().toEqualTypeOf<"onSubmit">();

// RUNTIME — value-level twins of Join and EventName, so we can exercise them.
function join<Sep extends string>(parts: readonly string[], sep: Sep): string {
  return parts.join(sep);
}

function eventNames<E extends Record<string, unknown>>(events: E): EventName<E>[] {
  return (Object.keys(events) as (keyof E & string)[]).map(
    (k) => `on${k.charAt(0).toUpperCase()}${k.slice(1)}` as EventName<E>,
  );
}

describe("03-join-event-name runtime checks", () => {
  // Join at runtime mirrors the type-level Join exactly:
  assert(join(["a", "b", "c"], ".") === "a.b.c", "join dots");
  assert(join(["src", "app", "index.ts"], "/") === "src/app/index.ts", "join slashes");
  assert(join(["only"], "-") === "only", "single element has no separator");
  assert(join([], ".") === "", "empty join is the empty string");

  // EventName derives handler names from an event map:
  const names = eventNames({ click: null as unknown as MouseEvent, scroll: null as unknown as Event });
  assertEquals(names.sort(), ["onClick", "onScroll"]);

  // Round-trip: a typed handler registry keyed by EventName.
  type Events = { click: MouseEvent; scroll: Event };
  const handlers: Partial<Record<EventName<Events>, ((e: unknown) => void) | undefined>> = {};
  handlers.onClick = (e) => assert(typeof e === "object", "click handler invoked");
  handlers.onClick?.({ x: 0 });
  assert("onScroll" in handlers === false, "onScroll not registered yet");
});
