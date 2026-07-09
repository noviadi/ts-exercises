# 28 — Enums vs union literals

> TypeScript gives you three ways to spell "this value is one of A, B, C":
> a numeric `enum`, a string `enum`, and a **literal union** (usually built
> from an `as const` object). In modern TS, the literal union wins almost
> every time — it tree-shakes, costs nothing at runtime, and has no reverse-
> mapping gotchas. A real `enum` is defensible only in a few specific cases.

## TL;DR

- **Numeric enums** emit a runtime object AND a *reverse map* (`Enum[0] ===
  "A"`), which is almost never what you want and breaks `noUncheckedIndexedAccess`
  intuitions. Avoid.
- **String enums** emit a runtime object but no reverse map. Better, but
  still heavier than a union, and they don't compose with template-literal
  or `keyof` tricks.
- **`as const` literal unions** compile to *nothing* at runtime (just the
  values you use), survive tree-shaking, and participate fully in TS's type
  algebra (`keyof typeof`, template literals, distributive conditionals).
- Use **`satisfies`** to validate that a `const` object covers exactly the
  members of a union — a typed, refactor-safe replacement for an enum.

## Learning objectives

After this topic you can:

- Explain the runtime cost of numeric vs string enums and why literal unions
  avoid it.
- Spot the reverse-mapping gotcha and the `Enum[key]` indexing pitfall.
- Convert an enum to an `as const` object + `typeof` union without losing
  safety.
- Use `satisfies` to enforce that a const object matches a union exactly.
- Name the one or two cases where a real `enum` is still a reasonable choice.

## Sub-exercises

1. `01-unions-beat-enums` — runtime cost, reverse mapping, and the literal-
   union + `keyof typeof` rewrite.
2. `02-satisfies-union-from-const` — `satisfies` to validate a const object
   against a union, and when a real enum is defensible.

## Resources

- TypeScript Handbook — [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
  and [Literal types](https://www.typescriptlang.org/docs/handbook/literal-types.html).
- TypeScript Handbook — [`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator).
- Total TypeScript — *Why I don't use enums* guidance.
- Related kata: Topic 14 (`as const`), Topic 15 (`satisfies`).
