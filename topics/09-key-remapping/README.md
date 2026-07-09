# 09 — Key remapping via `as`

> The `as` clause in a mapped type lets you **rename keys** while iterating:
> `{ [K in keyof T as NewKey]: T[K] }`. If `NewKey` resolves to `never`, that
> key is **dropped** — which gives you a clean, type-safe `Omit`.

## Learning objectives

After this topic you can:

- Read and write the `as` clause: `{ [K in keyof T as F<K>]: T[K] }`.
- **Filter** keys by remapping unwanted ones to `never` (and explain why
  `never` disappears from a key union).
- **Rename** keys with intrinsic string-manipulation types
  (`Uppercase`, `Capitalize`, `Lowercase`, `Uncapitalize`) and with template
  literals.
- Generate well-typed accessor maps: turn `{ foo: number }` into
  `{ getFoo: () => number; setFoo: (v: number) => void }`.

## Sub-exercises

1. `01-remap-and-filter` — the `as` clause, `Capitalize`/`Uppercase`
   remapping, and filtering via `as never`.
2. `02-getters-setters` — generate a getter/setter pair per property using a
   template-literal key (`get${Capitalize<K>}`) in the `as` clause.

## Resources

- TypeScript Handbook —*[Key remapping in mapped types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types)* (4.1 release notes — the canonical introduction).
- TypeScript Handbook — *[Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)* (used heavily in the `as` clause).
- type-challenges — `Get`, `Omit`-by-hand, and accessor-map puzzles.
