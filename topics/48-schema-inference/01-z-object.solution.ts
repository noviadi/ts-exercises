/**
 * SOLUTION — `z.object({})` with inferred type
 *
 * The trick that makes Zod-like libraries tick: a schema is an ordinary runtime
 * value (it has a `tag`, maybe validators) that ALSO carries a **phantom type
 * parameter** recording the TypeScript type it describes.
 *
 * The phantom parameter has to actually APPEAR in the interface for `infer` to
 * extract it. We plant it behind a `unique symbol` key (the branded-types trick
 * from Topic 27/29): the key never exists at runtime, but structurally it ties
 * each schema interface to the type it describes, so `S extends Schema<infer T>`
 * can recover `T`.
 *
 *   declare const _type: unique symbol;
 *   interface Schema<T> { readonly [_type]: T; }
 *
 *   type Infer<S> = S extends Schema<infer T> ? T : never;
 *
 * For objects, `ObjectSchema<F>` stores the field schemas and its inferred type
 * is a **mapped type** that runs `Infer` over each field:
 *
 *   { [K in keyof F]: Infer<F[K]> }
 */
import { assert, describe, expectTypeOf } from "@lib";

// The phantom brand. `unique symbol` guarantees no two declarations collide.
// explanation: this key is NEVER set at runtime — the helpers below cast through
// `unknown` to attach the type without supplying a value. Its only job is to
// make `Schema<T>` carry T structurally so conditional `infer` can find it.
declare const _type: unique symbol;

interface Schema<T> {
  readonly [_type]: T;
}

// Leaf schemas: each extends Schema<Primitive> and carries a literal `tag`.
// The tag is what lets us do tagged-union inference in sub-exercise 02.
interface StringSchema extends Schema<string> {
  readonly tag: "string";
}
interface NumberSchema extends Schema<number> {
  readonly tag: "number";
}
interface BooleanSchema extends Schema<boolean> {
  readonly tag: "boolean";
}

// The single extraction primitive: pull T out of any Schema<T>.
type Infer<S> = S extends Schema<infer T> ? T : never;

// Mapped-type inference: for each key K, pull the described type out of F[K].
// `F[K] extends Schema<unknown>` is guaranteed by the constraint below, so the
// `infer T` always succeeds.
type InferFields<F extends Record<string, Schema<unknown>>> = {
  [K in keyof F]: F[K] extends Schema<infer T> ? T : never;
};

// explanation: ObjectSchema is generic over `F` — the map of field-name →
// field-schema. Its inferred element type is the mapped type above, which runs
// `Infer` over every field. The constraint `Record<string, Schema<unknown>>`
// ensures every value is itself a schema.
interface ObjectSchema<F extends Record<string, Schema<unknown>>>
  extends Schema<InferFields<F>> {
  readonly tag: "object";
  readonly fields: F;
}

// The runtime API. Each leaf helper returns an object literal carrying only the
// `tag`; we cast through `unknown` to attach the phantom brand (there is no
// runtime value for `[_type]` — it's purely a type-system marker).
const z = {
  string(): StringSchema {
    return { tag: "string" } as unknown as StringSchema;
  },
  number(): NumberSchema {
    return { tag: "number" } as unknown as NumberSchema;
  },
  boolean(): BooleanSchema {
    return { tag: "boolean" } as unknown as BooleanSchema;
  },
  // explanation: the generic `F` is inferred from the argument, so each field's
  // concrete schema type (StringSchema, NumberSchema, ...) is preserved. That's
  // what lets InferFields map each one to the right primitive.
  object<F extends Record<string, Schema<unknown>>>(fields: F): ObjectSchema<F> {
    return { tag: "object", fields } as unknown as ObjectSchema<F>;
  },
};

// CHECKS — the inferred type matches the object literal exactly.

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  admin: z.boolean(),
});
type User = Infer<typeof UserSchema>;
expectTypeOf<User>().toEqualTypeOf<{ name: string; age: number; admin: boolean }>();

// Leaf schemas infer to their primitive:
expectTypeOf<Infer<ReturnType<typeof z.string>>>().toEqualTypeOf<string>();
expectTypeOf<Infer<ReturnType<typeof z.number>>>().toEqualTypeOf<number>();
expectTypeOf<Infer<ReturnType<typeof z.boolean>>>().toEqualTypeOf<boolean>();

// A single-field object schema infers correctly:
const OneSchema = z.object({ id: z.number() });
expectTypeOf<Infer<typeof OneSchema>>().toEqualTypeOf<{ id: number }>();

// RUNTIME — the schema carries its fields, so you can walk them at runtime too.
describe("schema runtime shape", () => {
  assert(UserSchema.tag === "object", "object tag");
  assert(
    Object.keys(UserSchema.fields).sort().join(",") === "admin,age,name",
    "fields preserved",
  );
  assert(UserSchema.fields.name.tag === "string", "name is string schema");
  assert(UserSchema.fields.age.tag === "number", "age is number schema");
});

// 💡 Takeaways:
//   • A phantom type parameter is the bridge between a runtime value and a
//     derived static type. The value describes; the type is inferred.
//   • For `infer` to find T, T must APPEAR in the interface — a `unique symbol`
//     brand is the standard way (no runtime cost, no name collisions).
//   • Object inference = a mapped type that runs `Infer` per field. The concrete
//     field-schema types must be PRESERVED by the helper's generic, or everything
//     collapses to `Schema<unknown>` and inference yields `unknown`.
