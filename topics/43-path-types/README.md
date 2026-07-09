# 43 — Path-based get/set types

> Dot-path navigation (`obj.a.b.c`) is everywhere in real code: form state,
> config, JSON configs, query builders. Making the **path string** and the
> **value at that path** type-safe is the capstone that ties together template
 *literal types*, `infer`, conditional types, and recursion.

## TL;DR

```ts
// Read the type at a dotted path inside T.
type Get<T, P extends string> =
  P extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T ? Get<T[Head], Tail> : undefined
    : P extends keyof T ? T[P] : undefined;

// Every dotted path that exists in T (a union of literal strings).
type Paths<T> = T extends readonly unknown[]
  ? never
  : T extends object
    ? { [K in keyof T & string]: K | `${K}.${Paths<T[K]>}` }[keyof T & string]
    : never;
```

`Get` splits the path on the first `.`, narrows the head with `Head extends
keyof T`, and recurses on the tail. `Paths` walks every property and accumulates
`"K"` and `"K." + Paths<T[K]>` into a union via the mapped-type-then-index trick.

## Learning objectives

After this topic you can:

- Implement `Get<T, "a.b.c">` that returns the exact value type at that path
  (or `undefined` when the path is invalid).
- Implement `Paths<T>` that emits the union of all valid dotted-path literals.
- Use template-literal `infer` to split a string on a separator at the type
  level, and accumulate path strings recursively.
- Spot where recursion bottoms out (a primitive leaf → `Paths` returns `never`,
  which collapses the `K.${never}` branch).

## Sub-exercises

1. `01-get-by-path` — `Get<T, P>`: navigate a nested object by a dotted string.
2. `02-paths-union` — `Paths<T>`: enumerate every valid dotted path as a union
   of string literals.

## Resources

- TypeScript Handbook —*[Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)*
  (the `${infer Head}.${infer Tail}` splitting trick).
- type-challenges — `Get`, `GetRequired`, `DeepPartial`-style recursive puzzles.
- `ts-toolbelt` / `fp-ts` `Path` modules — production-grade path types.
