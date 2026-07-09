/**
 * SOLUTION — Generate getter/setter maps with `as` + template literals
 *
 * Three building blocks combine:
 *
 *   1. The `as` clause renames each iterated key.
 *   2. A template literal type `` `get${Capitalize<K & string>}` `` builds the
 *      new key name. For `K = "x"`, `Capitalize<"x">` is `"X"`, so the key
 *      is `"getX"`.
 *   3. The value side (`() => T[K]` or `(v: T[K]) => void`) closes over the
 *      ORIGINAL value type — so each accessor is precisely typed.
 *
 * `Capitalize` works only on `string`, so we intersect the key with `string`
 * (`K & string`) — for object types whose keys are literal strings, this is a
 * no-op; for any stray `number`/`symbol` keys, it narrows them out.
 */

type Shape = { x: number; y: number; label: string };

// explanation: rename each key `K` to `get<Capitalized>`, value is a thunk
// returning the original property type.
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

// explanation: same rename, but the value is a setter accepting T[K]. `void`
// is the conventional "command" return type — callers can't accidentally use
// the (possibly undefined) result.
type Setters<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (v: T[K]) => void;
};

// explanation: intersection of the two — every property now has BOTH a getter
// and a setter. Intersections compose cleanly here because the key sets
// (`get…` and `set…`) are disjoint, so there are no conflict worries.
type Accessors<T> = Getters<T> & Setters<T>;

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — compile-time.
expectTypeOf<Getters<Shape>>().toEqualTypeOf<{
  getX: () => number;
  getY: () => number;
  getLabel: () => string;
}>();
expectTypeOf<Setters<Shape>>().toEqualTypeOf<{
  setX: (v: number) => void;
  setY: (v: number) => void;
  setLabel: (v: string) => void;
}>();

// Accessors is the conjunction — every key is present:
expectTypeOf<Accessors<Shape>>().toExtend<Getters<Shape>>();
expectTypeOf<Accessors<Shape>>().toExtend<Setters<Shape>>();

// The function shapes are real: you can call them with the right types.
expectTypeOf<Accessors<Shape>["setX"]>().toBeCallableWith(42);
// explanation: the cleanest way to assert a function's RETURN type is to take
// its `ReturnType` and compare with `toEqualTypeOf` — `expect-type` has no
// dedicated `toReturnTypeOf` matcher in this version.
expectTypeOf<ReturnType<Accessors<Shape>["getLabel"]>>().toEqualTypeOf<string>();

// RUNTIME — actually build a typed accessor bundle and exercise it. The
// returned object literally satisfies the Accessors<Shape> contract.
function makeAccessors<T extends object>(source: T): Accessors<T> {
  const store = { ...source } as Record<keyof T, unknown>;

  const getters = {} as Getters<T>;
  const setters = {} as Setters<T>;

  for (const key of Object.keys(store) as (keyof T & string)[]) {
    const suffix = (key.charAt(0).toUpperCase() + key.slice(1)) as string;
    (getters as Record<`get${string}`, () => unknown>)[`get${suffix}`] = () =>
      store[key];
    (setters as Record<`set${string}`, (v: unknown) => void>)[
      `set${suffix}`
    ] = (v) => {
      store[key] = v;
    };
  }

  return { ...getters, ...setters } as Accessors<T>;
}

describe("02-getters-setters runtime checks", () => {
  const acc = makeAccessors<Shape>({ x: 1, y: 2, label: "origin" });

  assert(acc.getX() === 1, "getX reads initial value");
  assert(acc.getLabel() === "origin", "getLabel reads initial value");

  acc.setX(99);
  acc.setLabel("moved");
  assert(acc.getX() === 99, "setX then getX round-trips");
  assert(acc.getLabel() === "moved", "setLabel then getLabel round-trips");
});
