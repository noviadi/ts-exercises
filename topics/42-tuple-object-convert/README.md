# 42 — Tuple ↔ object conversions

> Real data often arrives as a list of `[key, value]` pairs (URL query params,
> `Object.entries`, form data, HTTP headers) and we want a typed object back —
> or vice versa. This topic builds the type-level machinery to convert between
> tuples and object types **without losing literal information**.

## TL;DR

```ts
type Entries = readonly (readonly [PropertyKey, unknown])[];

// pairs → object
type ObjectFromEntries<T extends Entries> = {
  [K in T[number][0]]: Extract<T[number], readonly [K, unknown]>[1];
};

// object/tuple → tuple of its keys / values (homomorphic mapped type)
type Keys<T extends readonly unknown[]>   = { [K in keyof T]: K };
type Values<T extends readonly unknown[]> = { [K in keyof T]: T[K] };
```

The trick in `ObjectFromEntries` is the mapped key set comes from
`T[number][0]` (the union of all *first elements*), and each property's value
type is recovered with `Extract<..., [K, unknown]>[1]` — find the matching
pair, read its second slot.

## Learning objectives

After this topic you can:

- Turn a tuple of `[K, V]` pairs into an **object type** preserving literal keys
  and values.
- Turn a tuple of literal keys into a self-mapped object (`TupleToObject`).
- Pull a tuple's keys / values back out as **literal tuples** (not unions) using
  a homomorphic mapped type over `keyof T`.
- Explain why `{ [K in keyof T]: ... }` over a *tuple* yields a *tuple*, and the
  difference between `T[number]` (a union) and a mapped-tuple (a tuple).

## Sub-exercises

1. `01-object-from-entries` — `ObjectFromEntries<T>` (pairs → object) and
   `TupleToObject<T>` (key tuple → object).
2. `02-keys-values` — `Keys<T>` and `Values<T>` as literal tuples; the
   tuple-vs-union contrast.

## Resources

- TypeScript Handbook — *[Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)*
  and *[Homomorphic mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers-via-homomorphism)*.
- `Object.fromEntries` on MDN — the runtime mirror of the type we build.
- type-challenges — `TupleToObject`, `ObjectFromEntries` puzzles.
