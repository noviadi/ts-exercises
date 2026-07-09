# 24 — Index signatures vs `Record`

> `{ [k: string]: T }` and `Record<K, V>` look similar. They are not. One throws
> away everything you know about the keys; the other keeps that knowledge and
> gives you autocomplete + safety for free.

## TL;DR

- An **index signature** `{ [k: string]: T }` says "any string key maps to `T`"
  — TS no longer knows *which* keys exist, so you get **no autocomplete** and
  every lookup is typed `T` even for keys that don't exist (with
  `noUncheckedIndexedAccess`, it becomes `T | undefined`).
- A **`Record<K, V>` with a finite key union** (`Record<"a" | "b", V>`) keeps
  the key set known: you get **autocomplete on the keys**, and accesses are
  checked against the real key set.
- `noPropertyAccessFromIndexSignature` goes further: it forbids dot-access
  (`obj.key`) on values whose type comes from an index signature, forcing you
  to use bracket notation (`obj["key"]`) — a deliberate speed-bump.

## Learning objectives

After this topic you can:

- Explain why a string index signature **erases** literal keys.
- Show the autocomplete + safety difference between index signatures and
  `Record` with a finite key union.
- Describe what `noPropertyAccessFromIndexSignature` does and why a codebase
  turns it on.
- Reach for `Record<K, V>` (or a mapped type) instead of a bare index
  signature whenever the key set is known or bounded.

## Sub-exercises

1. `01-index-signature-pitfalls` — the pitfalls of `{ [k: string]: T }`.
2. `02-record-is-safer` — why `Record<K, V>` with a finite key union wins.

## Resources

- TypeScript Handbook —*[Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)*.
- TypeScript Handbook —*[Utility types: `Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)*.
- TypeScript release notes / `tsconfig` reference —[`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig/#noPropertyAccessFromIndexSignature).
