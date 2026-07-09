# 45 — Curried function inference

> Typing `curry(fn)` so that partial application stays **fully inferred** —
> callers never annotate a single type parameter. This is the canonical test of
> whether you understand overload signatures, generic inference from a single
> function argument, and recursive conditional types over parameter tuples.

## Learning objectives

After this topic you can:

- Type a 2-argument `curry` so that `curry(fn)(a)(b)` and `curry(fn)(a, b)` both
  infer `A`, `B`, `R` from `fn` alone, via an overload-style return type.
- Generalise to an **N-argument** curry using a recursive conditional type over
  `Parameters<F>` / `ReturnType<F>`, supporting mixed-arity partial application
  (`c(1)(2,3)`, `c(1,2)(3)`, `c(1,2,3)`).
- Explain why the *implementation body* of a variadic curry can't be typed
  precisely (TS can't relate a runtime spread length to a variadic tuple) and
  how to seal that looseness behind one precise public signature.

## Sub-exercises

1. `01-curry-two-args` — the 2-argument case; full inference; both call shapes.
2. `02-curry-n-args` — the general N-argument recursive curry with mixed
   partial application.

## Resources

- TypeScript Handbook —*[Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)*, *[Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)*.
- type-challenges — the *"Curry"* puzzle (medium/hard) which this topic builds toward.
- Pierre-Henri S., *Type-Level TypeScript* — recursion over tuple types.
