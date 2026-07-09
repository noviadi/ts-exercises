# 01 — Structural typing & assignability

> TypeScript is **structurally typed** (a.k.a. *duck typed*): two types are
> compatible when their *shapes* match, regardless of what they're named.
> This is the single most important mental model in TS — almost everything
> else (narrowing, generics, conditional types) is built on top of it.

## Learning objectives

After this topic you can:

- Explain *why* an object of a "different" type still assigns to another.
- Distinguish **assignability** from **identity**, and **excess property
  checks** from normal assignability.
- Predict, by reading types, whether the compiler will accept an assignment.
- Recognise when structural typing bites you (e.g. an empty `interface {}`
  accepting everything) and how nominal techniques (Topic 27) fix it.

## Sub-exercises

1. `01-assignability` — what's assignable to what, and why.
2. `02-excess-property-checks` — the one place TS is stricter than usual, and
   the fresh-object-literal rule that triggers it.

## Resources

- TypeScript Handbook — *[Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)*.
- Total TypeScript — the structural-typing explainer in the beginner/pro material.
- type-challenges — any "Easy" `Expect` puzzle relies on this model.
