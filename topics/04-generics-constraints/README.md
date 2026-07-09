# 04 — Generics & constraints (`extends`)

> Generics let one function/type describe a *family* of concrete types while
> keeping each call site fully typed. Constraints (`T extends U`) and defaults
> (`T = U`) are how you stop the family from including nonsense members.

## TL;DR

```ts
function id<T>(x: T): T { return x; }                    // basic
function len<T extends { length: number }>(x: T): number { return x.length; } // bound
function box<T = string>(v: T): T { return v; }          // default
function get<T, K extends keyof T>(o: T, k: K): T[K] { return o[k]; }         // the idiom
```

- A **type parameter** `<T>` is a placeholder inferred from each call site.
- A **constraint** `T extends U` bounds what T may be (so you can use U's
  members inside the body — e.g. `x.length` is legal once `T extends {length:number}`).
- A **default** `T = U` applies when inference can't pin T down.
- `T extends keyof U` is *the* idiom tying a key parameter to a real key of U.

## Learning objectives

After this topic you can:

- Declare and call generic functions; explain what TS infers at each call site.
- Bound a parameter with `T extends U` and know why the bound is what unlocks
  `x.length` / `x.toFixed()` / etc. inside the body.
- Provide **defaults** and reason about **multi-parameter inference**.
- Use the `K extends keyof T` idiom to keep lookups sound and per-call-site.

## Sub-exercises

1. `01-generic-functions` — declaring `<T>`, inference, multi-param, tuples.
2. `02-bounds-and-defaults` — `T extends U` bounds and `T = U` defaults.
3. `03-keyof-idiom` — the `K extends keyof T` idiom + multi-param inference.

## Resources

- TypeScript Handbook —*[ Generics ](https://www.typescriptlang.org/docs/handbook/2/generics.html)* (incl. generic constraints & defaults).
- TypeScript Handbook —*[ Keyof Type Operator ](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)* (for the `extends keyof` idiom).
- Total TypeScript — generics & inference walkthroughs.
- type-challenges — `First` / `Length` / `Pick` "Easy" puzzles.
