# 02 — `any` vs `unknown` vs `never` vs `void`

> Four types that look like "nothing" but sit at very different points of the
> type lattice. Knowing which is which is the difference between a codebase
> that protects you and one that silently lets bugs through.

## TL;DR — the lattice

```
              unknown        ← TOP type: every type is assignable TO it
                │
              ... (all the real types live here) ...
                │
              never          ← BOTTOM type: assignable TO every type
```

- **`any`** — the escape hatch. It is *both* top and bottom: assignable to and
  from everything. It **disables type checking**. Reach for it only at boundaries
  you genuinely cannot type (and even then, prefer `unknown`).
- **`unknown`** — the safe top. Any value assigns *in*, but you can't *use* it
  until you narrow (`typeof`, `in`, a guard). This is the type `JSON.parse`
  should have returned.
- **`never`** — the bottom. No value has it. It's the return type of functions
  that throw forever / never return, and it powers exhaustiveness checks.
- **`void`** — the return type meaning *"the caller must ignore this"*. It is
  **not** `undefined`; a `() => undefined` is assignable to `() => void` but
  not vice-versa.

## Learning objectives

After this topic you can:

- Explain the top/bottom lattice and where `any` cheats it (it's both).
- Use `unknown` to force narrowing at untrusted boundaries.
- Read `never` as "unreachable" and use it for exhaustiveness.
- Distinguish `void` from `undefined`, and exploit void-return covariance
  (why you may pass `() => T` where `() => void` is expected).

## Sub-exercises

1. `01-any-vs-unknown` — the safety top (`unknown`) vs the type-system opt-out (`any`).
2. `02-never-the-bottom` — `never` as "this can't happen"; exhaustiveness and unreachable code.
3. `03-void-vs-undefined` — `void` is a *contract*, not a value; the lattice recap.

## Resources

- TypeScript Handbook —*[ narrowing ](https://www.typescriptlang.org/docs/handbook/narrowing.html)* (the `unknown` section) and *[ `never` type ](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)*.
- Total TypeScript — Matt Pocock's *"Avoid `any`, use `unknown`"* guidance.
- TypeScript Handbook —*[ Type Compatibility ](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)* (the `void` return-type rule).
- type-challenges — any "Easy" `Expect` puzzle using `ExpectAny`/`ExpectUnknown`.
