# 18 — Discriminated unions

> A **discriminated union** is a union of object types that all share a single
> property — the **discriminant** (a.k.a. tag) — with a *literal* value unique
> to each member. Checking that one property is enough for TypeScript to narrow
> to the right member in each branch, which is far more reliable than scattered
> `in` / `typeof` checks.

## Learning objectives

After this topic you can:

- Define a tagged union using a common literal property (e.g. `type` / `kind`).
- Narrow inside `switch`/`if` on the discriminant and access member-only fields
  safely.
- Explain *why* the discriminant must be a literal type — a `string` field does
  not discriminate.
- Build the canonical `Result<T, E> = Success<T> | Failure<E>` and map over it
  without runtime checks for "is this really an error?".

## Sub-exercises

1. `01-shapes` — tagged unions of shapes (`circle`/`square`); narrowing by the
   `type` tag to reach shape-specific fields.
2. `02-result` — the `Result<T, E> = Success | Failure` pattern and how the tag
   drives a typed `map`/`getOrElse` API.

## Resources

- TypeScript Handbook — [*Discriminated unions*](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) & [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
- TypeScript Handbook — [*Type narrowing techniques*](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
- Total TypeScript — discriminated-union patterns.
- Rust `Result` / Haskell `Either` — the origin of the `Result<T, E>` shape.
