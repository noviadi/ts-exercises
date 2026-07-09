# 27 — Branded / nominal types

> TypeScript is *structurally* typed: two types with the same shape are
> interchangeable, even if they have different names. That's a problem when
> two concepts share a runtime representation but must NOT be mixed — a
> `UserId` and an `OrderId` are both strings, but passing a `UserId` where an
> `OrderId` is wanted is a bug the compiler should catch. **Branding** fakes
> nominal typing on top of structural typing.

## TL;DR

- A **brand** is a phantom property that exists only in the type system.
  The runtime value is still a plain `string` (or `number`).
- The **intersection trick** is the simplest brand:
  `type UserId = string & { readonly __brand: "UserId" }`.
- A **`unique symbol`** brand is stronger: the brand property is keyed by a
  `unique symbol` that cannot be spelled at a call site, so the brand can
  only be created through your sanctioned constructor.
- Branding gives you cross-module safety: an `EmailAddress` is not
  assignable to a `UserId`, even though both erase to `string`.

## Learning objectives

After this topic you can:

- Explain why `type UserId = string` does **not** protect against mixing IDs.
- Implement the intersection-brand pattern and a matching "smart
  constructor".
- Implement the `unique symbol` brand and explain why it's stricter.
- Use brands to make illegal state unrepresentable across module boundaries,
  while keeping the runtime representation zero-cost.

## Sub-exercises

1. `01-intersection-brand` — the `string & { __brand }` trick, with a smart
   constructor and cross-ID rejection at the type level.
2. `02-unique-symbol-brand` — the `unique symbol` flavour, which makes the
   brand unforgeable from outside the module.
3. `03-cross-module-safety` — `EmailAddress` vs `UserId`: validating at the
   boundary, then carrying a proof in the type.

## Resources

- TypeScript Handbook — [Symbols](https://www.typescriptlang.org/docs/handbook/symbols.html) and
  [Unique Symbols](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#unique-symbol).
- *Nominal typing techniques in TypeScript* — the intersection-brand post
  that popularised `string & { __brand: ... }`.
- Related kata: Topic 29 (`unique symbol`), Topic 01 (structural typing —
  the foundation branding deliberately subverts).
