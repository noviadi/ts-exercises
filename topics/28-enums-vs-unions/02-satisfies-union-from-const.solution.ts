/**
 * SOLUTION — `satisfies` to validate a const object against a union
 *
 * The pattern, in one line:
 *
 *   const ROLE_LABELS = { admin: "Admin", ... } satisfies Record<Role, string>;
 *
 * `satisfies` does two things at once:
 *
 *   1. CHECKS — the expression must be assignable to `Record<Role, string>`.
 *      That means every key of `Role` must be present (miss one → error) and
 *      no extra keys are allowed (invent one → excess-property error).
 *   2. PRESERVES — the inferred type of `ROLE_LABELS` stays the LITERAL
 *      object shape, not the wider `Record<Role, string>`. So `ROLE_LABELS.admin`
 *      is the literal `"Admin"`, not just `string`. You get validation AND
 *      narrow types.
 *
 * This is the typed, refactor-safe replacement for an enum-as-lookup-table:
 * rename a member of `Role` and the compiler flags every place that needs to
 * follow. Add a new member of `Role` and `satisfies` immediately complains
 * that `ROLE_LABELS` is missing a case.
 *
 * WHEN A REAL `enum` IS STILL DEFENSIBLE
 * --------------------------------------
 * The few cases where an actual `enum` is reasonable:
 *
 *   - You need a runtime object that ITERATES in declaration order across
 *     modules (rare; usually `Object.entries(STATUS)` is fine).
 *   - You're interoperating with code or a runtime API that already uses
 *     enums (e.g. some ORMs, legacy libraries) and want frictionless interop.
 *   - You want reverse mapping (number → name) for logging/diagnostics.
 *
 * Otherwise — for almost all app code — prefer the `as const` object + union.
 */

import { assert, describe, expectTypeOf } from "@lib";

// The source-of-truth union. Renaming/adding here is the single place to edit.
type Role = "admin" | "editor" | "viewer";

// `satisfies` validates the object against `Record<Role, string>`:
//   - missing a Role key   → compile error
//   - extra unknown key    → compile error (excess property on the literal)
//   - wrong value type     → compile error
//
// `as const` is what keeps each VALUE as its literal type ("Admin", not
// `string`). On its own, `satisfies` only prevents widening BEYOND what the
// literal would naturally infer — and for object-literal properties that
// natural inference is `string`. Pairing `as const` with `satisfies` gives
// both guarantees: literal-narrow values AND a checked shape. This is the
// canonical "typed lookup table over a union" pattern.
const ROLE_LABELS = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
} as const satisfies Record<Role, string>;

// explanation: the inferred type is the literal-narrow object, NOT
// `Record<Role, string>`. That's the whole reason `satisfies` exists — an
// annotation `const ROLE_LABELS: Record<Role, string> = {...}` would have
// widened each value to `string` and lost the literal info.
//
// Try it: if you forget `viewer`, the satisfies check fails with
// "Property 'viewer' is missing". If you add `superuser`, it fails with an
// excess-property error. Both are the safety net we wanted from an enum.

// -----------------------------------------------------------------------------
// Exhaustive switch derived from the same union — the assertNever pattern.
// -----------------------------------------------------------------------------

/** A `never`-based exhaustiveness check. If `Role` grows, this errors. */
function labelFor(role: Role): string {
  switch (role) {
    case "admin":
      return ROLE_LABELS.admin;
    case "editor":
      return ROLE_LABELS.editor;
    case "viewer":
      return ROLE_LABELS.viewer;
    default:
      // explanation: at this point `role` is `never` if we handled every case.
      // If a new Role is added without a case above, `role` is no longer
      // `never` here and this assignment becomes a compile error — surfacing
      // the missing case at the call site. (See Topic 19 for the full pattern.)
      const _exhaustive: never = role;
      return _exhaustive;
  }
}

// -----------------------------------------------------------------------------
// CHECKS — runtime
// -----------------------------------------------------------------------------

describe("ROLE_LABELS covers each role", () => {
  assert(ROLE_LABELS.admin === "Admin");
  assert(ROLE_LABELS.editor === "Editor");
  assert(ROLE_LABELS.viewer === "Viewer");
});

describe("labelFor is exhaustive", () => {
  assert(labelFor("admin") === "Admin");
  assert(labelFor("viewer") === "Viewer");
});

describe("iteration over the union (no enum needed)", () => {
  // The classic enum use case — iterating members — works fine on the const
  // object via `Object.entries`. No runtime enum required.
  const all = Object.keys(ROLE_LABELS).sort();
  assert(all.join(",") === "admin,editor,viewer");
});

// -----------------------------------------------------------------------------
// CHECKS — type-level
// -----------------------------------------------------------------------------

// The const object IS assignable to `Record<Role, string>` (that's what
// `satisfies` guaranteed), AND it stays literal-narrow on its own type.
expectTypeOf<typeof ROLE_LABELS>().toExtend<Record<Role, string>>();

// Values keep their literal types (thanks to `as const`; `satisfies` alone
// would have left them as `string`):
expectTypeOf<typeof ROLE_LABELS.admin>().toEqualTypeOf<"Admin">();

// Keys are exactly the Role union — adding a non-Role key would break this.
expectTypeOf<keyof typeof ROLE_LABELS>().toEqualTypeOf<Role>();

// `satisfies` rejects a structurally wrong variant. Two demonstrations:
//
// (a) Missing a key — TS reports the error at the `satisfies` clause, so the
// directive on the line directly above it suppresses the diagnostic:
// @ts-expect-error  missing `viewer` — `satisfies Record<Role,string>` rejects it
const _missing = { admin: "Admin", editor: "Editor" } satisfies Record<
  Role,
  string
>;
void _missing;

// (b) Extra unknown key — excess-property errors are reported at the offending
// PROPERTY, so the directive must sit directly above that property line:
const _extra = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
  // @ts-expect-error  `superuser` is not a key of `Record<Role, string>`
  superuser: "Super",
} satisfies Record<Role, string>;
void _extra;
