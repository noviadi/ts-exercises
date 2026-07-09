/**
 * PROMPT — Mutual recursion + a guarded recursive helper
 *
 * Three small definitions to fill in.
 *
 *  1. A binary `Tree<T>` and a `TreeNode<T>` that are MUTUALLY recursive:
 *       - a Tree<T>   is a TreeNode<T> | null
 *       - a TreeNode<T> has { value: T; left: Tree<T>; right: Tree<T> }
 *
 *  2. A `DeepReadonly<T>` helper that recursively freezes every property. The
 *     recursion MUST be guarded by a conditional so it terminates — otherwise
 *     applying it to a recursive type like `Tree` blows up with TS2589.
 *
 * Your job: replace the `unknown`/`never` stubs, then make CHECKS compile.
 *
 * Run:  npx tsc --noEmit 02-tree-mutual-recursion.problem.ts
 */

// TODO: define Tree<T> and TreeNode<T> (mutually recursive).
type TreeNode<T> = never;
type Tree<T> = unknown;

// TODO: a guarded recursive DeepReadonly — fill the condition & branches.
type DeepReadonly<T> = unknown;

import { expectTypeOf } from "@lib";

// CHECKS
expectTypeOf<Tree<number>>().toExtend<TreeNode<number> | null>();
expectTypeOf<TreeNode<string>>().toExtend<{
  value: string;
  left: Tree<string>;
  right: Tree<string>;
}>();
expectTypeOf<DeepReadonly<{ a: { b: number } }>>().toExtend<{
  readonly a: { readonly b: number };
}>();
