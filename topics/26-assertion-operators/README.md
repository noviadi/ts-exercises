# 26 — Definite & non-null assertions

> TypeScript gives you two "trust me" operators that *silently* override its
> flow analysis: the **non-null assertion** `x!` and the **definite-assignment
> assertion** `field!:`. They compile to nothing at runtime — they are pure
> type-system escape hatches. Used well, they remove boilerplate; used badly,
> they turn a real `null` into a `TypeError` in production.

## TL;DR

- `x!` says *"I know this isn't `null`/`undefined`, even though your flow
  analysis can't prove it."* It narrows `T | null | undefined` → `T`.
- `field!:` says *"this field will be initialised before anyone reads it, even
  though the constructor doesn't assign it."* It silences `strictPropertyInitialization`.
- Both are **lies to the compiler**. They are *not* checks — they emit zero
  runtime code. If the value really is `null`, your program crashes.
- The safe alternative is almost always an **assertion function** (Topic 17)
  like `assertNonNull(x)`, which both narrows *and* throws at runtime.

## Learning objectives

After this topic you can:

- Read `!` and `!:` and explain exactly what each one tells the compiler.
- Tell apart the three ways to "deal with a nullable": narrow it, assert it,
  or assert-function it — and pick the right one.
- Recognise the code smells that say "the `!` here is hiding a bug".
- Contrast assertion **operators** (compile-time only, unsound) with assertion
  **functions** (runtime + compile-time, sound).

## Sub-exercises

1. `01-assertion-operators` — `!`, `!:`, when they're acceptable, and the
   assert-function alternative that makes the same code verifiable.

## Resources

- TypeScript Handbook — [Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) and
  [Definite Assignment Assertions](https://www.typescriptlang.org/docs/handbook/2/classes.html#definite-assignment-assertion).
- TypeScript release notes — [non-null assertion operator `!`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator).
- Total TypeScript — *When to use `!`* guidance.
- Related kata: Topic 17 (Assertion functions) — the sound alternative.
