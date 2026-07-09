# 30 — Module & global augmentation

> Sometimes a library's shipped types don't quite cover your use case — you need
> an extra field on an exported interface, a new method on `Array.prototype`,
> or a project-wide global. TypeScript lets you *augment* existing types instead
> of forking them. This topic shows how to do it surgically and verify it
> actually widens the type.

## TL;DR

- **Module augmentation** — `declare module "pkg" { ... }` merges new members
  into an already-imported module's type surface. The file must be a module
  (have an `import`/`export`).
- **Global augmentation** — `declare global { ... }` merges into the global
  scope: built-in interfaces like `Array<T>`, `Window`, `Math`, etc.
- Augmentation only changes TYPES. If you add a method to `Array.prototype`,
  you must also provide the runtime implementation.
- Both rely on **interface declaration merging** (Topic 23) under the hood.

## Learning objectives

After this topic you can:

- Augment a third-party module with a new exported member and prove the
  compiler now sees it.
- Augment built-in globals (`Array.prototype`, `Window`) with new members.
- Distinguish the type-side augmentation from the runtime implementation that
  must accompany it.
- Verify augmentations with `expectTypeOf` so they can't silently regress.

## Sub-exercises

1. `01-module-augment` — augment the installed `expect-type` package with a new
   exported interface; verify the widened surface via a type-only import.
2. `02-global-augment` — add `Array.prototype.lastOr` and `Window.__kataBuild`
   via `declare global`, ship the runtime impl for `lastOr`, and assert both
   augmentations took effect.

## Resources

- TypeScript Handbook —*[Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)* (merging is the mechanism behind augmentation).
- TypeScript Handbook —*[Augmenting a Module](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-augmenting-a-module)* and *[Global Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation)*.
- Total TypeScript — Matt Pocock's notes on safely extending library types.
