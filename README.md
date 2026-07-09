# Advanced TypeScript Kata

A repo of **50 advanced TypeScript exercise topics** (≈110 individual sub-exercises)
designed for an experienced engineer who wants to *refresh and sharpen* their
TypeScript. Each topic reinforces strong fundamentals while climbing toward
genuine type-level programming and real-world type-safe library patterns.

Exercises are **isolated** (each file runs on its own) but **build up** in
complexity across a topic and across the whole track.

## How to use this repo

```bash
npm install            # typescript, expect-type, tsx, vitest
npm run typecheck      # verify ALL worked solutions typecheck cleanly (clean baseline)
npm run test           # run every solution's runtime describe/assert checks
npm run run topics/05-infer/01-return-type.solution.ts   # run one file's runtime checks
```

- **Learn:** open `topics/NN-.../K-name.problem.ts`, read the `PROMPT`, and fill
  the `// TODO:` regions. Your editor uses `tsconfig.json`, which type-checks the
  problem files too — so the intentional TODO errors show up *inline* and shrink
  to zero as you solve. (You can also run `npm run check:problem` from the CLI.)
- **Check yourself:** open the matching `K-name.solution.ts` for a fully
  commented worked answer.
- Every solution is verified two ways: **type checks** (`expectTypeOf` from
  `expect-type`) and, where behaviour is involved, **runtime checks**
  (`assert`/`describe` from `@lib`).

> **Two tsconfigs.** `tsconfig.json` (root) is what your editor uses — it checks
> *every* file, problems included. `tsconfig.solutions.json` checks only the
> worked solutions and is what `npm run typecheck`/`verify` run, so the repo
> always has a clean baseline even though the unsolved starters don't compile.

## The strictness policy

The `tsconfig.json` enables the toughest, modern settings on purpose:

- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noPropertyAccessFromIndexSignature`, `noImplicitOverride`,
  `verbatimModuleSyntax`, `isolatedModules`.

These are exactly the settings a production codebase should adopt, and the
exercises are written to satisfy them. See `SPEC.md` for authoring conventions.

---

## The 50 topics

> Each topic has 1–5 sub-exercises (count in parentheses). Important/foundational
> topics get more sub-exercises.

### Part I — Foundations, sharpened
| #  | Topic | Sub | What you'll internalize |
|----|-------|-----|--------------------------|
| 01 | [Structural typing & assignability](topics/01-structural-typing/) | 2 | TS is structurally (duck) typed; what "assignable" really means; excess property checks. |
| 02 | [`any` vs `unknown` vs `never` vs `void`](topics/02-top-and-bottom-types/) | 3 | Top type, bottom type, the safety of `unknown`, why `void`≠`undefined`. |
| 03 | [`keyof` & indexed access types](topics/03-keyof-indexed-access/) | 2 | `keyof T`, `T[K]`, lookup types, index signatures, constraints on `K extends keyof T`. |
| 04 | [Generics & constraints (`extends`)](topics/04-generics-constraints/) | 3 | Type parameters, `T extends U` bounds, defaults, multi-param inference. |
| 05 | [`infer` & conditional type inference](topics/05-infer/) | 3 | Pulling types out of structures: `ReturnType`, `Parameters`, `Promise<T>` element. |
| 06 | [Conditional types](topics/06-conditional-types/) | 2 | `T extends U ? X : Y` as a type-level `if`; nested/ternary chains. |
| 07 | [Distributive conditional types](topics/07-distributive-conditionals/) | 2 | Why `T extends any ? T[] : never` distributes over unions; the `[T]` trick to stop it. |
| 08 | [Mapped types](topics/08-mapped-types/) | 2 | `{ [K in keyof T]: ... }`; building `Partial`/`Readonly`/`Pick` by hand. |
| 09 | [Key remapping via `as`](topics/09-key-remapping/) | 2 | `{ [K in keyof T as NewKey]: T[K] }`; filtering keys; `Capitalize`/`Uppercase`. |
| 10 | [Template literal types](topics/10-template-literal-types/) | 3 | `` `${U & string}` ``, `Capitalized`, path strings, API route types. |

### Part II — Narrowing & runtime types
| #  | Topic | Sub | What you'll internalize |
|----|-------|-----|--------------------------|
| 11 | [Mapped type modifiers (`+`/`-`)](topics/11-mapped-modifiers/) | 2 | Adding/removing `readonly` and `?` (`-readonly`, `-?`). |
| 12 | [Tuples & readonly tuples](topics/12-tuples/) | 2 | Fixed-length arrays, labeled elements, `readonly` tuples vs arrays. |
| 13 | [Variadic tuple types](topics/13-variadic-tuples/) | 3 | `...T` spreads in tuples, `concat`/`push` typing, prefix/suffix. |
| 14 | [`const` type parameters & const assertions](topics/14-const-type-params/) | 2 | `as const`, `<const T>`, widening of literals. |
| 15 | [`satisfies` operator](topics/15-satisfies/) | 2 | Constraining without widening; preserving literal types safely. |
| 16 | [Type guards & predicates](topics/16-type-guards/) | 3 | `x is T`, narrowing, `Array.isArray`, custom guards you can trust. |
| 17 | [Assertion functions](topics/17-assertion-functions/) | 2 | `asserts x is T` / `asserts x`; control-flow effects. |
| 18 | [Discriminated unions](topics/18-discriminated-unions/) | 2 | Tagged unions, exhaustive handling, the single discriminant property. |
| 19 | [Exhaustiveness with `never`](topics/19-exhaustiveness-never/) | 2 | The `assertNever` pattern; compile-time guarantees on switch. |
| 20 | [Function overloads](topics/20-overloads/) | 2 | Overload signatures vs implementation; inference from call sites. |

### Part III — Objects, classes, modules
| #  | Topic | Sub | What you'll internalize |
|----|-------|-----|--------------------------|
| 21 | [`this` types & polymorphic `this`](topics/21-this-types/) | 2 | `this` parameters for method chaining, fluent builders, F-bounded polymorphism. |
| 22 | [Intersection types & merging](topics/22-intersections/) | 2 | `A & B`, merge semantics, conflicts, vs interface inheritance. |
| 23 | [Interface vs alias & declaration merging](topics/23-interface-vs-type/) | 2 | Where interfaces win (merging, extends), where aliases win (unions, recursion). |
| 24 | [Index signatures vs `Record`](topics/24-index-signatures-vs-record/) | 2 | Dynamic keys, why `Record<K,V>` is usually safer than an index sig. |
| 25 | [Control-flow narrowing operators](topics/25-narrowing-operators/) | 2 | `?.`, `??`, truthiness, `in`, `instanceof`, and how they shape types. |
| 26 | [Definite & non-null assertions](topics/26-assertion-operators/) | 1 | `!`, definite assignment `!:` — when they're acceptable and when they hide bugs. |
| 27 | [Branded / nominal types](topics/27-branded-types/) | 3 | Opaque types via brands, the "unique symbol" trick, cross-module safety. |
| 28 | [Enums vs union literals](topics/28-enums-vs-unions/) | 2 | Why `as const` unions usually beat enums; when enums are defensible. |
| 29 | [`unique symbol`](topics/29-unique-symbol/) | 2 | Nominal typing, symbol-keyed properties, brand uniqueness. |
| 30 | [Module & global augmentation](topics/30-module-augmentation/) | 2 | Patching `Array`, `Window`, third-party modules — safely and surgically. |
| 31 | [Declaration files (`.d.ts`)](topics/31-declaration-files/) | 2 | Ambient declarations, `declare`, typing untyped JS libraries. |
| 32 | [Mixins](topics/32-mixins/) | 2 | Class mixins via `applyMixins`, type-level constructor composition. |
| 33 | [Decorators (stage 3)](topics/33-decorators/) | 2 | Method/class decorators, `metadata` symbol, the TC39 proposal shape. |

### Part IV — Async, iteration, variance
| #  | Topic | Sub | What you'll internalize |
|----|-------|-----|--------------------------|
| 34 | [Async types: `Promise`, `Awaited`](topics/34-async-types/) | 2 | `Awaited<T>` recursion, why `Promise<Promise<T>>` flattens, thenable typing. |
| 35 | [Generators & iterables](topics/35-generators-iterables/) | 2 | `Iterable`/`Iterator`/`IterableIterator`, `yield` types, async iteration. |
| 36 | [Variance: covariance & contravariance](topics/36-variance/) | 2 | Why `Dog[]` ≠ subtype rules, method bivariance, function param checks. |

### Part V — Recursive & immutable type engineering
| #  | Topic | Sub | What you'll internalize |
|----|-------|-----|--------------------------|
| 37 | [Recursive & self-referential types](topics/37-recursive-types/) | 2 | JSON, trees, lazy recursion with conditions to avoid infinite errors. |
| 38 | [Immutability helpers](topics/38-immutability/) | 3 | `DeepReadonly`, `DeepPartial`, `Mutable`, `Writable` — recursive mapped types. |
| 39 | [Type-level booleans & conditionals](topics/39-type-level-logic/) | 2 | `Not`, `And`, `Or`, `Xor` purely in the type system. |
| 40 | [Type-level string operations](topics/40-type-level-strings/) | 2 | `Split`, `Join`, `Replace`, `Trim`, `StartsWith` with template literals. |
| 41 | [Type-level numbers via tuples](topics/41-type-level-numbers/) | 2 | Peano/tuple-encoded `Add`, `Length`, `Range`; recursion limits. |
| 42 | [Tuple ↔ object conversions](topics/42-tuple-object-convert/) | 2 | `ObjectFromEntries`, `TupleToObject`, `KeysToTuple`. |

### Part VI — Real-world type-safe patterns (capstones)
| #  | Topic | Sub | What you'll internalize |
|----|-------|-----|--------------------------|
| 43 | [Path-based get/set types](topics/43-path-types/) | 2 | `Get<T, "a.b.c">`, `Paths<T>`, type-safe dot navigation. |
| 44 | [`Object.keys` typing & safe iteration](topics/44-object-keys/) | 2 | The classic unsoundness and a typed `entries`/`keys` that's actually safe. |
| 45 | [Curried function inference](topics/45-curried-inference/) | 2 | Typing `curry(fn)` so partial application stays fully inferred. |
| 46 | [Type-safe event emitter / router](topics/46-typed-event-emitter/) | 3 | Map of event→payload, `on`/`emit` validated by key, `never` for unknown. |
| 47 | [Type-safe builder](topics/47-type-safe-builder/) | 3 | SQL/query or fetch client: method chaining whose return type tracks state. |
| 48 | [Schema → type inference (Zod-like)](topics/48-schema-inference/) | 2 | `z.object({})` → inferred type; `infer` over a schema union. |
| 49 | [Finite State Machine typing](topics/49-state-machine/) | 2 | State→event→state maps, illegal transitions rejected at compile time. |
| 50 | [Capstone: type-safe mini ORM/API client](topics/50-capstone-orm/) | 2 | Combines inference, paths, builders, and exhaustiveness into one design. |

---

## Resources these exercises are grounded in

- **TypeScript Handbook** (narrowing, type manipulation, release notes) — the canonical reference for every feature used here.
- **Total TypeScript** (Matt Pocock) — esp. `satisfies`, `as const`, `unknown`, the `Object.keys` problem, configuration best practices.
- **type-challenges** — the standard set of graded type puzzles (easy→extreme); many Part V topics are inspired by them.
- **Type-Level TypeScript** (Pierre-Henri S.) — the theory behind conditional, mapped, and recursive types.
- **Effect / `@effect/schema`** and **Zod** — the schemas-as-types pattern in Part VI.
- **TC39 / TypeScript release notes** — `using`/`await using`, decorators stage 3, `const` type parameters, explicit resource management — the modern surface.

See each topic folder's `README.md` for direct links and which specific feature it targets.
