/**
 * PROMPT — `Infer` over a tagged schema-union AST
 *
 * In 01 the schema was a typed value carrying a phantom `T`. Now we flip it: the
 * schema is a plain **AST** (a discriminated union on `tag`), and we infer the
 * type purely with conditional types — no phantom parameter at all.
 *
 *   type SchemaAST =
 *     | { tag: "string" }
 *     | { tag: "number" }
 *     | { tag: "boolean" }
 *     | { tag: "array"; element: SchemaAST }
 *     | { tag: "object"; fields: { [k: string]: SchemaAST } };
 *
 *   type InferAST<S> = ...
 *
 * Your job:
 *   1. Write `InferAST<S>` as a chain of conditional types — one per `tag` —
 *      using `infer` to pull out the `element` / `fields` and recurse.
 *   2. Make the CHECKS compile. They cover nested arrays, arrays of objects,
 *      and objects of arrays — i.e. real recursion.
 *
 * Hint: each branch looks like
 *   S extends { tag: "array"; element: infer E } ? InferAST<E>[] : ...
 *
 * Run:  npx tsc --noEmit 02-infer-union.problem.ts
 */

// TODO: SchemaAST union + InferAST<S>.

import { expectTypeOf } from "@lib";

// CHECKS — uncomment once InferAST exists. Build the ASTs with `as const` so
// every `tag` is a literal.

// const ast = {
//   tag: "object",
//   fields: {
//     name:  { tag: "string" },
//     count: { tag: "number" },
//     on:    { tag: "boolean" },
//     tags:  { tag: "array", element: { tag: "string" } },
//     nested:{ tag: "array", element: { tag: "object", fields: { id: { tag: "number" } } } },
//   },
// } as const;
//
// type T = InferAST<typeof ast>;
// expectTypeOf<T>().toEqualTypeOf<{
//   name: string;
//   count: number;
//   on: boolean;
//   tags: string[];
//   nested: { id: number }[];
// }>();
