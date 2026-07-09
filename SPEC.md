# CONTRIBUTING / AUTHORING SPEC — read this before generating any exercise

This document defines the **conventions every exercise folder must follow** so
the whole kata stays consistent, runnable, and verifiable. Every generated
folder obeys these rules exactly.

## Layout

```
topics/NN-kebab-name/
├── README.md                    # topic overview, objectives, resources, sub-exercise list
├── 01-short-name.problem.ts     # the learner's starter (has TODO blanks / failing type asserts)
├── 01-short-name.solution.ts    # the worked solution with rich explanation comments
├── 02-short-name.problem.ts     # (sub-exercises are independent, 1..5)
├── 02-short-name.solution.ts
└── ...
```

- `NN` = two-digit topic number, matching the order in the root `README.md`.
- Each **sub-exercise** is a pair: `K-short-name.problem.ts` + `K-short-name.solution.ts`.
- Sub-exercises are numbered `01`, `02`, … up to the count listed in the README.

## The two file roles

### `K-name.problem.ts` — the prompt the learner edits

- Top of file: a `/** PROMPT */` JSDoc block explaining the task and any rules.
- A clearly marked `// TODO:` region the learner replaces (e.g. a `type`/`function`
  stubbed with `any`, `unknown`, or `never`).
- At the bottom, a `// CHECKS` region with `expectTypeOf(...)` assertions that
  **fail to compile until the learner solves it** (this is the feedback loop).
- Do **not** use `@ts-nocheck`. Problem files are excluded from the root
  `tsconfig.json` (`topics/**/*.problem.ts`), so they never break `npm run
  typecheck` of the solutions — learners check their file with
  `npx tsc --noEmit <file>`.

### `K-name.solution.ts` — the worked answer

- Same structure, but solved.
- Heavy **`// explanation:`** comments walking through *why*, not just *what*.
  Teach the concept, reference the type-system mechanism.
- The `// CHECKS` region now passes; add runtime `assert(...)`/`describe(...)`
  checks where behaviour is involved so the file is runnable.
- A solution is correct only when BOTH pass:
  - `npm run typecheck` (compile-time `expectTypeOf`)
  - `npm run run topics/NN-.../K-name.solution.ts` (runtime asserts)

## Imports

- Type helpers: `import { expectTypeOf, assert, describe, assertEquals, IsEqual } from "@lib";`
  (`@lib` → `./src/lib.ts`; tsx + tsconfig both resolve it).
- Only import `expect-type` via `@lib`'s re-export — do not add new deps.
- Prefer zero third-party runtime deps. Pure-type exercises may have no imports
  at all beyond `@lib`.

## Type-assertion vocabulary (IMPORTANT)

Use **`expect-type`** (re-exported from `@lib`) for all compile-time assertions.
The exact API to use (verified against installed `expect-type@1.4.0`):

- `expectTypeOf<T>().toEqualTypeOf<U>()` — `T` is *identical* to `U`.
- `expectTypeOf<T>().toExtend<U>()` — `T` is *assignable to* `U` (a.k.a. `extends`).
  ⚠️ Do **NOT** use `toMatchTypeOf` — it is deprecated and its no-arg form fails
  to typecheck in this version. Always use `toExtend`.
- Prefix `.not.` to assert the negative, e.g. `expectTypeOf<T>().not.toExtend<U>()`
  (must then actually be true, or it errors).
- Type-predicate helpers: `.toBeAny()`, `.toBeNever()`, `.toBeUnknown()`,
  `.toBeVoid()`, `.toBeNullable()`, `.toBeNull()`, `.toBeUndefined()`,
  `.toBeString()`, `.toBeNumber()`, `.toBeBoolean()`, `.toBeArray()`,
  `.toBeObject()`, `.toBeFunction()`, `.toBeSymbol()`, `.toBeBigInt()`.
- For function shapes: `.toBeCallableWith(...)`, `.toBeConstructibleWith(...)`.
- For "this is a compile error here" in a *solution*, use a one-line
  `// @ts-expect-error  <reason>` directly above the offending line. Never leave
  a bare error; every `@ts-expect-error` must point at a real error, and the
  repo's `tsc --noEmit` must exit 0 on all `*.solution.ts`.

When you want a plain type-level `Equal`/`Not`/`IsAny`/`IsNever` (not a runtime
assertion), import `IsEqual`, `IsNever`, `IsAny`, `IsTuple` from `@lib`.

## Style rules (pedagogy)

1. **One concept per sub-exercise.** Each isolates a single idea.
2. **Build up.** Within a topic, `01` is the warm-up and later ones compose.
3. **Strict by default.** The repo enables `noUncheckedIndexedAccess`,
   `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`. Do not
   bypass them with `any`; if a step genuinely needs `any`, comment why.
4. **Show the mistake, then the fix.** In solutions, comment out a wrong line
   with `// @ts-expect-error` + a one-line note when the contrast teaches
   something (sparingly — only when genuinely illuminating).
5. **Ground it.** Cite the mechanism/feature and, where relevant, the resource
   in the folder `README.md`.
6. **No `console.log` spam** except the `describe(...)` pass/fail lines.

## Per-topic authoring checklist (for each generated folder)

- [ ] `README.md` with: TL;DR, learning objectives, sub-exercise list, resource links.
- [ ] `K-name.problem.ts` × (count) — prompt + TODO + failing CHECKS.
- [ ] `K-name.solution.ts` × (count) — solved + explanation + passing CHECKS (+ runtime if applicable).
- [ ] Every `solution.ts` typechecks cleanly under the strict tsconfig.
- [ ] Numbers, file names, and sub-exercise counts match the root README for that topic.
