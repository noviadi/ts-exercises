# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A TypeScript **exercise/kata** repo (not an app or library). 50 topics, ~109
sub-exercises. Each sub-exercise is a pair: `K-name.problem.ts` (a learner
prompt with `// TODO:` blanks + failing type-checks) and `K-name.solution.ts`
(the worked answer with `// explanation:` comments + passing checks). See
`README.md` for the topic list and `SPEC.md` for the authoring rules — both are
authoritative when adding/editing exercises.

## Commands

```bash
npm install
npm run typecheck      # tsc on ALL worked solutions — the clean baseline (must stay exit 0)
npm run test           # vitest run on solutions
npm run verify         # typecheck + test together

# Scope the checker to ONE file or ONE folder (honours @lib + strict flags):
npm run check -- topics/05-infer
npm run check -- topics/05-infer/01-return-type.problem.ts

npm run run topics/05-infer/01-return-type.solution.ts   # run one file's runtime asserts via tsx
```

**Why `npm run check` exists:** `tsc --noEmit <file>` (passing a file directly)
**ignores `tsconfig.json` entirely** — the `@lib` path alias stops resolving and
the strict flags vanish, so every file spuriously errors with `Cannot find module
'@lib'`. Never check a single file that way. `scripts/check.mjs` writes a
throwaway tsconfig that `extends` the root and narrows `include` to the target.

## Architecture: the two-tsconfig design (the big picture)

This is the part that requires reading several files to understand.

- `tsconfig.json` (root) — **what the editor uses.** `include` covers **every**
  `.ts` under `src/` and `topics/` (problems *and* solutions). Strictest flags
  are on (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noPropertyAccessFromIndexSignature`, `verbatimModuleSyntax`,
  `isolatedModules`). Because problems are included, the IDE shows the
  intentional TODO errors inline as guidance.
- `tsconfig.solutions.json` — **what `npm run typecheck`/`verify` use.**
  Extends the root but `include`s only `*.solution.ts` (excludes problems).
  This is what keeps a clean baseline even though the unsolved starters don't
  compile. `package.json` `typecheck`/`verify` point at `-p tsconfig.solutions.json`.

Consequence: the root config will report type errors in `*.problem.ts` files.
**Those are expected** — they're the exercises. Only treat it as a regression if
a `*.solution.ts` file errors, or a `*.problem.ts` gains a *syntax* error.

`src/lib.ts` is the single shared helper module, aliased as `@lib` via
`tsconfig.json` `paths` (+ a matching alias in `vitest.config.ts` and resolved
by `tsx`). It exports runtime `assert`/`describe`/`assertEquals`, type-only
helpers (`IsEqual`, `IsNever`, `IsAny`, `IsTuple`), and re-exports
`expectTypeOf` from `expect-type`.

## Conventions that bite if ignored

- **Assertion vocabulary:** use `expectTypeOf<T>().toEqualTypeOf<U>()` (identical)
  and `expectTypeOf<T>().toExtend<U>()` (assignable/extends), with a `.not.`
  prefix for negatives, plus the `.toBe*` predicates. **Never use
  `toMatchTypeOf`** — it's deprecated in the installed `expect-type@1.4.0` and
  its no-arg form fails to typecheck.
- **`expectTypeOf` is a value, not a type** — import it as
  `import { expectTypeOf } from "@lib";` (not `import type`). Use `import type`
  only for genuinely type-only imports (`IsEqual`, etc.).
- **`// @ts-expect-error` lines still execute at runtime under `tsx`.** A
  deliberate-error demo that reads a missing value (e.g. `getLength(null)`)
  will crash unless wrapped in a never-invoked function. Wrap such demos in
  `function _demo(): void { … }` + `void _demo;`.
- **Every topic `.ts` file must be a module** (have an `import`/`export`, or end
  with `export {};`). Files with no imports/exports are treated as *scripts* and
  their top-level declarations collide in the shared global scope when the whole
  repo is checked together. (Topic 01's excess-property files are the example.)
- Known `expect-type` sharp edges already worked around in the exercises — match
  the existing patterns, don't reinvent: `expectTypeOf<never>()` and
  `expectTypeOf<UnionWithDisjointKeys>()` are unreliable; prove those via a
  `[T] extends [...]` conditional or an annotated-const assignment instead.

## Authoring checklist (from SPEC.md)

Per topic folder `topics/NN-kebab/`: `README.md` (TL;DR, objectives,
sub-exercises, resource links) + one `K-name.problem.ts`/`K-name.solution.ts`
pair per sub-exercise. `01` is the warm-up; later ones compose. After editing,
run `npm run check -- <folder>` to confirm solutions stay clean and problems
fail only with the intended type-mismatch feedback (no syntax errors).
