# 31 — Declaration files (ambient declarations)

> Not every value your code touches is written in TypeScript. `declare` lets you
> describe the SHAPE of values that exist at runtime but are invisible to the
> compiler — global variables injected by a script tag, a legacy `.js` module,
> a function a bundler shims in. These are **ambient** declarations: types with
> no runtime emission of their own.

## TL;DR

- `declare const x` / `declare function f` / `declare class C` — describe
  globals the runtime provides; the compiler treats them as existing but emits
  nothing for them.
- `declare module "name" { ... }` — describes a module's TYPE surface.
  Two flavours:
    - **Ambient module declaration** — types a module the compiler can't
      resolve (a truly untyped JS package). Under this repo's
      `moduleResolution: "Bundler"`, this requires a `.d.ts` file.
    - **Module augmentation** — MERGES new members into a module that already
      resolves (e.g. `@lib`). Works from inside a normal `.ts` module file.
- Ambient declarations change TYPES only. If you also need values, you must
  provide them at runtime — the `declare` is just a promise.
- This kata stays self-contained: we keep the ambient code inside the regular
  `.solution.ts` module (so we use augmentation of a resolvable module, and
  demonstrate the `.d.ts` requirement as a teaching point).

## Learning objectives

After this topic you can:

- Use `declare const`, `declare function`, and `declare class` to expose
  runtime-provided globals to TypeScript.
- Use `declare module "name" { ... }` to AUGMENT a resolvable module's type
  surface, and explain when a brand-new ambient module needs a `.d.ts`.
- Distinguish ambient declarations (no runtime code) from real implementations.
- Verify ambient types with `expectTypeOf` so a wrong shape is caught.

## Sub-exercises

1. `01-ambient-declare` — `declare const`/`declare function`/`declare class`
   for runtime-provided globals; verify their shapes at the type level.
2. `02-module-declaration` — augment the resolvable `@lib` module with a new
   interface and function; verify the widened surface, and see why a
   non-resolvable `declare module` fails under `moduleResolution: "Bundler"`.

## Resources

- TypeScript Handbook —*[Ambient Declarations / `declare`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#d-ts-files)*.
- TypeScript Handbook —*[`.d.ts` Templates](https://www.typescriptlang.org/docs/handbook/declaration-files/templates.html)* and *[Modules `.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html)*.
- Total TypeScript — notes on typing third-party JS libraries.
