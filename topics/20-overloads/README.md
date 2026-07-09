# 20 — Function overloads

> A function can advertise **multiple call signatures** (overloads) backed by a
> single implementation. Call sites infer the *last matching* signature, which
> lets you give precise return types that change per input shape — something a
> plain union return cannot do.

## Learning objectives

After this topic you can:

- Declare overload signatures in front of one implementation, and explain why
  the implementation signature is *invisible* to callers.
- Predict which overload TS picks at a given call site (it uses the first match
  in source order — order matters).
- Decide between three tools for "input shape determines output type":
  **overloads**, **conditional types**, and **generic + union returns** — and
  articulate the tradeoffs (inference precision vs composability vs complexity).

## Sub-exercises

1. `01-overload-basics` — declaring multiple signatures, picking by argument
   shape, and the invisibility of the implementation signature.
2. `02-overloads-vs-conditionals-vs-unions` — the same problem solved three
   ways; what each buys and costs.

## Resources

- TypeScript Handbook —*[Function Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)*.
- TypeScript Handbook —*[Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)* (the alternative).
- Matt Pocock / Total TypeScript — *"When to use function overloads"* guidance.
- Stefan Baumgartner / `effect` discussions — why many modern libraries prefer
  conditional/generic inference over declared overloads for composability.
