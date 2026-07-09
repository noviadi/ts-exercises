# 37 — Recursive & self-referential types

> A type alias can mention *itself*, which lets you describe structures of
> unbounded depth: JSON, trees, linked lists, the DOM. TypeScript handles this
> lazily, but it has rules — direct self-references are rejected, and type-level
> computations need a conditional to act as a *termination guard*.

## TL;DR

- A type alias can recurse through **object/union structure**:
  `type Json = ... | Json[] | { [k: string]: Json };` works directly.
- Direct self-reference `type Self = Self;` errors (`TS2456`); wrap recursion in
  a structure (object/array/union) or in a **conditional** to defer instantiation.
- **Mutual recursion** between two aliases is allowed: `Tree` references
  `TreeNode`, `TreeNode` references `Tree`.
- For recursive *type-level computation* (e.g. `DeepReadonly<T>`), the
  conditional `T extends object ? { ... } : T` is what makes recursion
  well-founded — it is the **termination guard**. Without it you get
  `TS2589` ("Type instantiation is excessively deep").

## Learning objectives

After this topic you can:

- Define a recursive `Json` type and explain why it needs an object/union wrapper.
- Read and write mutually-recursive type aliases (`Tree` ⇄ `TreeNode`).
- Spot when a recursive computation needs a conditional guard, and add one.
- Avoid the two classic errors: `TS2456` (circular alias) and `TS2589` (deep instantiation).

## Sub-exercises

1. `01-json-type` — the canonical recursive `Json` type, with a runtime guard.
2. `02-tree-mutual-recursion` — a binary `Tree<T>` mutually recursive with
   `TreeNode<T>`; a guarded recursive `DeepReadonly<T>` helper; why the
   conditional matters.

## Resources

- TypeScript Handbook — *[Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)* (recursive aliases).
- TypeScript Handbook — *[Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)* (distributive & lazy evaluation).
- type-challenges — *[TupleToNestedObject](https://github.com/type-challenges/type-challenges)* and recursive "Medium" puzzles.
- Microsoft/TypeScript — *[TS2589 / deferred conditional types](https://github.com/microsoft/TypeScript/pull/33255)*.
