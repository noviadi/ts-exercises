/**
 * SOLUTION — Why literal unions beat enums
 *
 * Three reasons the `as const` + literal-union pattern wins:
 *
 *   1. RUNTIME COST.
 *      - A string enum compiles to an actual object (`{ Idle: "IDLE", ... }`)
 *        that ships in your bundle. Bundlers can drop it if unused, but
 *        anything you DO touch keeps the whole object alive.
 *      - An `as const` object + union only emits the *values you actually
 *        use*. The union type itself is erased. This matters for tree-shaking.
 *
 *   2. REVERSE-MAPPING GOTCHA.
 *      - Numeric enums generate a *reverse map* (`Priority[1] === "Low"`),
 *        doubling the object and letting you index with a number to get a
 *        string name. That's almost never wanted, and it interacts oddly
 *        with `noUncheckedIndexedAccess`.
 *      - Literal unions have no such reverse map.
 *
 *   3. COMPOSABILITY.
 *      - Literal unions compose with the whole type algebra: template
 *        literals (`` `status:${Status}` ``), `keyof typeof`, conditional
 *        types, mapped types. Enums are first-class *values* but their type
 *        algebra is clunkier (no template-literal membership, etc.).
 *
 * The rewrite below keeps the same API surface — `STATUS.Loading === "LOADING"`
 * and `Status === "IDLE" | "LOADING" | "DONE"` — at zero runtime cost.
 */

import { assert, describe, expectTypeOf } from "@lib";

// -----------------------------------------------------------------------------
// The enum version (kept here for comparison).
// -----------------------------------------------------------------------------

// explanation: `enum StatusEnum { ... }` is BOTH a type AND a runtime value.
// At runtime TS emits an object like:
//
//   var StatusEnum;
//   (function (StatusEnum) {
//     StatusEnum["Idle"] = "IDLE";
//     ...
//   })(StatusEnum || (StatusEnum = {}));
//
// String enums do NOT get a reverse map. Numeric ones do (see Priority below).
enum StatusEnum {
  Idle = "IDLE",
  Loading = "LOADING",
  Done = "DONE",
}

// -----------------------------------------------------------------------------
// The literal-union rewrite. Same surface, zero runtime object.
// -----------------------------------------------------------------------------

// `as const` makes the property types narrow to their literal values, instead
// of widening to `string`. Without `as const`, `STATUS.Loading` would be
// `string`; with it, `STATUS.Loading` is exactly `"LOADING"`.
const STATUS = {
  Idle: "IDLE",
  Loading: "LOADING",
  Done: "DONE",
} as const;

// `(typeof STATUS)[keyof typeof STATUS]` is the canonical "union of all
// values in the object" idiom:
//   - `typeof STATUS`         = the readonly shape `{ Idle: "IDLE"; ... }`.
//   - `keyof typeof STATUS`   = `"Idle" | "Loading" | "Done"`.
//   - indexing with that key union gives the union of value literals.
type Status = (typeof STATUS)[keyof typeof STATUS];

// -----------------------------------------------------------------------------
// Numeric enum — illustrates the reverse-map gotcha.
// -----------------------------------------------------------------------------

enum Priority {
  Low = 1,
  High = 2,
}
// explanation: at runtime, `Priority` is BOTH directions:
//   { Low: 1, High: 2, 1: "Low", 2: "High" }
// So `Priority[1] === "Low"`. That extra reverse map is the surprising bit.
// It also means `Priority[number]` is the *string* union `"Low" | "High"`,
// not the numeric one — a frequent source of confusion.

// -----------------------------------------------------------------------------
// CHECKS — runtime
// -----------------------------------------------------------------------------

describe("string enum emits a runtime object", () => {
  assert(StatusEnum.Loading === "LOADING");
  assert(typeof StatusEnum === "object");
});

describe("as const values are literal-narrow", () => {
  // `STATUS.Loading` is the literal "LOADING", not `string`:
  assert(STATUS.Loading === "LOADING");
  // The const object still exists at runtime (we use its members), but its
  // TYPE-level union `Status` is erased — no reverse map, no extra members.
});

describe("numeric enums have a reverse map", () => {
  assert(Priority[1] === "Low", "reverse mapping: Priority[1] === 'Low'");
  assert(Priority[2] === "High", "reverse mapping: Priority[2] === 'High'");
  // Contrast: there is no such indexing on the literal union. `STATUS["IDLE"]`
  // wouldn't even typecheck — STATUS is keyed by the *names*, not the values.
});

describe("template-literal composition", () => {
  // The union composes with template literals — handy for tagged strings,
  // typed routes, event names, etc. Enum members do not.
  type StatusTag = `status:${Status}`;
  const tag: StatusTag = `status:${STATUS.Done}`;
  assert(tag === "status:DONE");
});

// -----------------------------------------------------------------------------
// CHECKS — type-level
// -----------------------------------------------------------------------------

// Identity sanity.
expectTypeOf<StatusEnum>().toEqualTypeOf<StatusEnum>();

// The union is EXACTLY the three literals.
expectTypeOf<Status>().toEqualTypeOf<"IDLE" | "LOADING" | "DONE">();

// `STATUS.Loading` is the literal "LOADING", not `string`.
expectTypeOf<typeof STATUS.Loading>().toEqualTypeOf<"LOADING">();

// `keyof typeof STATUS` is the union of keys — useful for iteration that
// stays refactor-safe (rename a key and this type updates automatically).
expectTypeOf<keyof typeof STATUS>().toEqualTypeOf<"Idle" | "Loading" | "Done">();

// A raw string is NOT assignable to the union — the union is closed.
// @ts-expect-error  "IDLE" | "LOADING" | "DONE" does not include "ERROR"
const _bad: Status = "ERROR";
void _bad;

// Numeric enums: `Priority` itself (the type) is the union of NUMERIC
// members, NOT the strings. The reverse map is a value-level artefact.
expectTypeOf<Priority>().toEqualTypeOf<Priority.Low | Priority.High>();
