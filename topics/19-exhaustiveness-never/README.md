# 19 — Exhaustiveness with `never`

> When you `switch` over a discriminated union, TypeScript can prove whether
> you've handled every member. The trick is the `never` type: after all real
> cases are narrowed away, whatever is left has type `never`. By writing a
> helper that *accepts* `never` and throws, you turn "I forgot a case" from a
> silent runtime bug into a **compile-time error**.

## Learning objectives

After this topic you can:

- Write `assertNever` / `assertUnreachable` and explain why its parameter must
  be typed `never`.
- Use it as the `default` of a switch to make the switch exhaustive.
- Explain the compile-time guarantee you get for free when a new union variant
  is added: the new member is no longer `never` in the leftover arm, so the
  call to `assertNever(value)` fails to typecheck.
- Distinguish an *exhaustive* switch (every case handled or `never`-defaulted)
  from one that merely returns a sensible default.

## Sub-exercises

1. `01-assert-never` — the `assertNever(x: never)` helper; switch exhaustiveness
   for a fixed Shape union.
2. `02-add-a-variant` — what happens at compile time when you extend the union
   with a new tag and forget to handle it; the guarantee the pattern buys you.

## Resources

- TypeScript Handbook — [*Narrowing: exhaustive checks*](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking).
- TypeScript Handbook — [`never` type](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type).
- Microsoft/TypeScript — the classic [`assertNever` helper](https://github.com/Microsoft/TypeScript/issues/13282).
- Total TypeScript — exhaustiveness patterns.
