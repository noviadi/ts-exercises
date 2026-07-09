/**
 * PROMPT — `z.object({})` with inferred type
 *
 * Build a tiny Zod-like schema API where the schema is a VALUE and its
 * TypeScript type is derived from it.
 *
 * Goal:
 *   const UserSchema = z.object({
 *     name:  z.string(),
 *     age:   z.number(),
 *     admin: z.boolean(),
 *   });
 *   type User = infer<typeof UserSchema>;
 *   //   ^? { name: string; age: number; admin: boolean }
 *
 * Your job:
 *   1. Define a `Schema<T>` interface with a phantom type parameter `T`
 *      (T exists only in the type system — there is no runtime field for it).
 *   2. Add `StringSchema`, `NumberSchema`, `BooleanSchema` leaf interfaces that
 *      extend `Schema<string|number|boolean>` and carry a `tag`.
 *   3. Add `ObjectSchema<F>` whose inferred type is `{ [K in keyof F]: infer<F[K]> }`.
 *   4. Implement the `z` helper with `string()`, `number()`, `boolean()`,
 *      `object(fields)`.
 *   5. Uncomment the CHECKS — they must compile.
 *
 * Hint: `infer<S> = S extends Schema<infer T> ? T : never`.
 *
 * Run:  npx tsc --noEmit 01-z-object.problem.ts
 */

// TODO: Schema<T>, *Schema leaves, ObjectSchema<F>, infer<S>, the `z` object.

import { expectTypeOf } from "@lib";

// CHECKS — uncomment once your `z` and `infer` exist.

// const UserSchema = z.object({
//   name: z.string(),
//   age: z.number(),
//   admin: z.boolean(),
// });
// type User = infer<typeof UserSchema>;
// expectTypeOf<User>().toEqualTypeOf<{ name: string; age: number; admin: boolean }>();

// // A leaf schema infers to its primitive:
// expectTypeOf<infer<ReturnType<typeof z.string>>>().toEqualTypeOf<string>();
// expectTypeOf<infer<ReturnType<typeof z.number>>>().toEqualTypeOf<number>();
