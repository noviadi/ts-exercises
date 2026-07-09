/**
 * SOLUTION — `Infer` over a tagged schema-union AST
 *
 * In 01 the schema carried its type in a phantom parameter. Here the schema is
 * a plain **AST** — a discriminated union keyed on `tag` — and we recover the
 * described type with NOTHING but conditional types. This is the more "type
 * gymnastics" flavour: no runtime phantom, just `infer` + recursion.
 *
 * The shape of the trick, for each branch:
 *
 *   S extends { tag: "string" } ? string :
 *   S extends { tag: "array"; element: infer E } ? InferAST<E>[] :
 *   S extends { tag: "object"; fields: infer F } ? { [K in keyof F]: InferAST<F[K]> } :
 *   ...
 *
 * Each `infer` pulls out the sub-AST, and we recurse (`InferAST<E>`). The
 * object branch maps over the field keys, so the literal field names are
 * preserved in the output type.
 *
 * Why `as const` on the data? It freezes every `tag` to its literal ("string"
 * rather than `string`), which is what the conditionals match against. Without
 * it, `tag` would widen to `string` and no branch would ever fire.
 */
import { expectTypeOf } from "@lib";

// The schema AST: a recursive discriminated union on `tag`.
type SchemaAST =
  | { readonly tag: "string" }
  | { readonly tag: "number" }
  | { readonly tag: "boolean" }
  | { readonly tag: "array"; readonly element: SchemaAST }
  | { readonly tag: "object"; readonly fields: { readonly [k: string]: SchemaAST } };

// explanation: each conditional tests one `tag`. When it matches, `infer` pulls
// out the payload and we recurse. The object branch maps over keyof F, which
// preserves the literal field names. `-readonly` strips the readonly modifiers
// that `as const` introduced, so the inferred type is a normal mutable object.
type InferAST<S> =
  S extends { readonly tag: "string" } ? string :
  S extends { readonly tag: "number" } ? number :
  S extends { readonly tag: "boolean" } ? boolean :
  S extends { readonly tag: "array"; readonly element: infer E } ? InferAST<E>[] :
  S extends { readonly tag: "object"; readonly fields: infer F } ?
    F extends Record<string, unknown> ?
      { -readonly [K in keyof F]: InferAST<F[K]> }
    : never
  : never;

// CHECKS — build a non-trivial nested schema with `as const` and read its type.
const ast = {
  tag: "object",
  fields: {
    name: { tag: "string" },
    count: { tag: "number" },
    on: { tag: "boolean" },
    tags: { tag: "array", element: { tag: "string" } },
    nested: {
      tag: "array",
      element: {
        tag: "object",
        fields: { id: { tag: "number" } },
      },
    },
  },
} as const;

type T = InferAST<typeof ast>;
expectTypeOf<T>().toEqualTypeOf<{
  name: string;
  count: number;
  on: boolean;
  tags: string[];
  nested: { id: number }[];
}>();

// Standalone leaves:
expectTypeOf<InferAST<{ readonly tag: "string" }>>().toEqualTypeOf<string>();
expectTypeOf<InferAST<{ readonly tag: "number" }>>().toEqualTypeOf<number>();
expectTypeOf<InferAST<{ readonly tag: "boolean" }>>().toEqualTypeOf<boolean>();

// Array of array of string — exercises recursion through two array layers:
expectTypeOf<
  InferAST<{ readonly tag: "array"; readonly element: { readonly tag: "array"; readonly element: { readonly tag: "string" } } }>
>().toEqualTypeOf<string[][]>();

// A standalone object schema (not wrapped in an array):
const obj = {
  tag: "object",
  fields: { a: { tag: "string" }, b: { tag: "number" } },
} as const;
expectTypeOf<InferAST<typeof obj>>().toEqualTypeOf<{ a: string; b: number }>();

// 💡 Takeaways:
//   • A discriminated union + a chain of conditional types is the pure-type
//     equivalent of a `switch`: each `extends { tag: ... }` is one case.
//   • `infer E` inside the matched shape lets you recurse — that's how array and
//     object schemas compose to arbitrary depth.
//   • `as const` on the data is what makes every `tag` a literal the
//     conditionals can match. Without it the branches never fire and you get
//     `never`.
//   • Homomorphic mapped types copy modifiers from the source — `-readonly`
//     (and `-?`) reset them so the output is plain mutable.
