/**
 * SOLUTION — Strip optionality with `-?`; build `Required<T>` by hand
 *
 * Optionality is the second modifier a mapped type can flip. The two operators:
 *
 *     [K in keyof T]-?   removes `?` (this is how the built-in `Required<T>` works)
 *     [K in keyof T]?    adds `?`    (the `+` is implicit; same as bare `?`)
 *
 * The crucial insight: the `?` is a property of the KEY, not of the value type.
 * So `{ [K in keyof T]: T[K] }` does NOT remove optionality — the resulting key
 * is still optional. You MUST write `-?` to force it required.
 *
 * Combining modifiers: you can write `-readonly` and `-?` together (in any
 * order) on the same `[K in keyof T]` clause. That's `Bare<T>` below — every
 * property required AND writable.
 */

import { assert, describe, expectTypeOf } from "@lib";

type User = {
  id: number;
  name?: string;
  readonly email?: string;
};

// explanation: `-?` is the load-bearing bit. Without it the key would stay
// optional even though we wrote `T[K]`. With it, every property becomes required.
// (We name it `Required2` only to avoid clashing with the built-in `Required`.)
type Required2<T> = {
  [K in keyof T]-?: T[K];
};

// explanation: bare `?` is sugar for `+?`. It makes every key optional.
// Note under `exactOptionalPropertyTypes`, an optional property's type is
// `T | undefined`, which is why the CHECKS spell out `| undefined` explicitly.
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// explanation: stack two minus modifiers on the same clause. Order doesn't
// matter: `-readonly [K in keyof T]-?` is the same as
// `[K in keyof T]-? -readonly`. This is the "fully bare" version of T.
type Bare<T> = {
  -readonly [K in keyof T]-?: T[K];
};

// CHECKS — all pass.

expectTypeOf<Required2<User>>().toEqualTypeOf<{
  id: number;
  name: string;
  readonly email: string;
}>();

expectTypeOf<Optional<User>>().toEqualTypeOf<{
  id?: number | undefined;
  name?: string | undefined;
  readonly email?: string | undefined;
}>();

expectTypeOf<Bare<User>>().toEqualTypeOf<{
  id: number;
  name: string;
  email: string;
}>();

// Negative checks for intuition:
//   1. Without `-?`, the result would still be optional. A plain identity mapped
//      type preserves the `?`:
type Identity<T> = { [K in keyof T]: T[K] };
expectTypeOf<Identity<User>["name"]>().toEqualTypeOf<string | undefined>();

//   2. `Required2<User>["email"]` is `string`, not `string | undefined`:
expectTypeOf<Required2<User>["email"]>().toEqualTypeOf<string>();

// Runtime: prove the value-level behaviour matches — required fields must exist.
describe("Required2 + Bare at runtime", () => {
  const input = { id: 1, name: "Ada", email: "a@b.c" } satisfies User;
  const required: Required2<User> = input;
  const bare: Bare<User> = input;
  bare.email = "x@y.z"; // legal: Bare stripped `readonly` too
  assert(required.id === 1, "required.id === 1");
  assert(required.name === "Ada", "required.name === Ada");
  assert(bare.email === "x@y.z", "bare.email is writable and updated");
});
