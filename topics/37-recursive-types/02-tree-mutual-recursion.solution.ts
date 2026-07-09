/**
 * SOLUTION — Mutual recursion + a guarded recursive helper
 *
 * This file makes three ideas concrete:
 *
 *  (A) MUTUAL RECURSION between two type aliases is fine. `Tree<T>` references
 *      `TreeNode<T>` and `TreeNode<T>` references `Tree<T>`. As long as each
 *      cycle goes through some structural wrapper (a property, a union, an
 *      array), TypeScript expands it lazily.
 *
 *  (B) Direct self-reference `type Self = Self;` is REJECTED (TS2456). The fix
 *      is to thread the recursion through a structure or — for type-level
 *      computation — through a CONDITIONAL, which is lazy.
 *
 *  (C) For a recursive *computation* like `DeepReadonly<T>`, the conditional
 *      `T extends object ? {...} : T` is the **termination guard**. Primitives
 *      fall through to the `: T` branch and stop the recursion; objects map
 *      their properties and recurse. Remove that guard and TS reports
 *      TS2589 ("Type instantiation is excessively deep").
 */

import { assert, describe, assertEquals, expectTypeOf } from "@lib";

// --- (A) Mutually recursive Tree<T> ⇄ TreeNode<T> ---

// explanation: Tree is "a node or nothing" — the union with `null` is the
// structural wrapper that lets the alias reference TreeNode without becoming
// trivially circular.
export type Tree<T> = TreeNode<T> | null;

// explanation: each child is a Tree<T> (so empty subtrees are representable as
// null). This is the back-edge of the mutual recursion: TreeNode → Tree → TreeNode.
export type TreeNode<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
};

// --- (B) Direct self-reference is rejected; show the mistake. ---
// We comment it out and mark it as a genuine error so the file still compiles.
// @ts-expect-error  TS2456: Type alias 'Self' circularly references itself.
type Self = Self;

// explanation: threading recursion through a generic parameter + conditional
// makes the alias lazy. TS defers expansion until someone instantiates it with
// a concrete argument, so this compiles cleanly:
type Boxed<T> = T extends never ? never : { value: T; next: Boxed<T> | null };

// --- (C) DeepReadonly with a conditional termination guard. ---
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T // functions: leave as-is (mapping `readonly` over a callable is nonsensical)
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> } // object: recurse on each key
    : T; // primitive: STOP — this is the termination guard.

// CHECKS — compile-time proof.
expectTypeOf<Tree<number>>().toExtend<TreeNode<number> | null>();
expectTypeOf<TreeNode<string>>().toExtend<{
  value: string;
  left: Tree<string>;
  right: Tree<string>;
}>();

// DeepReadonly descends through nested object types:
expectTypeOf<DeepReadonly<{ a: { b: number } }>>().toExtend<{
  readonly a: { readonly b: number };
}>();

// It also descends through our mutually-recursive Tree:
declare const frozenTree: DeepReadonly<Tree<string>>;
expectTypeOf<typeof frozenTree>().toExtend<
  | { readonly value: string; readonly left: DeepReadonly<Tree<string>>; readonly right: DeepReadonly<Tree<string>> }
  | null
>();

// RUNTIME — build a small Tree<string> and walk it. The values are readonly
// at the TYPE level; at runtime we just traverse (we never mutate).
describe("walk a mutually-recursive Tree<string>", () => {
  const tree: Tree<string> = {
    value: "root",
    left: { value: "L", left: null, right: null },
    right: { value: "R", left: null, right: null },
  };

  const collected: string[] = [];
  // A tiny pre-order traversal that mirrors the recursive type shape.
  const walk = (node: Tree<string>): void => {
    if (node === null) return;
    collected.push(node.value);
    walk(node.left);
    walk(node.right);
  };
  walk(tree);
  assertEquals(collected, ["root", "L", "R"]);
  assert(tree.left !== null && tree.left.value === "L", "left child preserved");
});

// 💡 Takeaways:
//   • Mutual recursion between aliases is allowed when each back-edge goes
//     through a property, union member, or array — never as a bare `type X = X`.
//   • For recursive type-level COMPUTATION, always include a conditional that
//     terminates on primitives. That conditional is the guard that prevents
//     "Type instantiation is excessively deep" (TS2589).
//   • Functions usually need an explicit carve-out (the first conditional arm)
//     — `readonly` over a callable type is meaningless and can recurse oddly.
