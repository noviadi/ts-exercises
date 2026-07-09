# 21 — `this` types & polymorphic `this`

> TypeScript lets you type the `this` of a method two ways: as a fixed `this:`
> parameter (a constraint / guard), and as the polymorphic `this` type (the
> "current subclass"), which powers fluent builders and F-bounded polymorphism.

## Learning objectives

After this topic you can:

- Add a `this:` parameter to a function/method to enforce that it is only
  called with the right receiver, and explain what it does to `this`'s type
  inside the body.
- Use polymorphic `this` as a return type so a base class's method returns the
  *subclass* type at the call site — enabling type-safe chaining.
- Recognise F-bounded polymorphism (`class Base<T extends Base<T>>`) and when
  it's worth the complexity vs a plain `this` return type.

## Sub-exercises

1. `01-this-parameter` — the `this:` parameter as a guard; what it protects.
2. `02-polymorphic-this` — `this` as a return type for fluent/chained builders
   and the F-bounded `Base<T extends Base<T>>` pattern.

## Resources

- TypeScript Handbook —*["this" types](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-types)*.
- TypeScript Handbook —*[`this` parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)*.
- TypeScript Handbook —*F-bounded polymorphism / "Polymorphic this"*.
- Eric Elliot / "Fluent APIs" — the JS pattern TS's `this` type makes safe.
