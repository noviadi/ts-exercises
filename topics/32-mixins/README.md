# 32 — Mixins

> JavaScript's class system is single-inheritance: a class may `extend` exactly
> one superclass. **Mixins** are the TypeScript idiom that re-introduces
> *horizontal* reuse: a function that takes a class and returns a *new* class
> that adds behaviour. The same idea is named "traits" in Scala/Rust, "roles"
> in Perl 6, and "abstract subclasses" in the mixin pattern from the GoF book.

## Learning objectives

After this topic you can:

- Write the canonical mixin **shape**:

  ```ts
  type Mixin = <TBase extends new (...args: any[]) => Base>(
    Base: TBase,
  ) => class extends Base { /* extra members */ };
  ```

- Explain why the constraint `TBase extends new (...args) => Base` is what
  preserves the *derived* type of the class you mix into (so `instanceof` and
  static members survive).
- Compose mixins **at the type level** — the `MixinA & MixinB` intersection of
  constructors, and how to obtain `InstanceType<Composed>` for free.
- Apply `Timestamped` / `Tagged` mixins to a concrete class and reason about
  the resulting instance type.

## Sub-exercises

1. `01-timestamped-tagged` — the runtime mixin function applied to a real class;
   the `<TBase extends new (...args) => Base>` pattern; the resulting instance
   type.
2. `02-constructor-composition` — type-level composition of mixin *constructors*
   via intersection, `InstanceType<...>`, and why the order of application
   matters for `super()` chains.

## Resources

- TypeScript Handbook —*[Mixins](https://www.typescriptlang.org/docs/handbook/mixins.html)*.
- TypeScript Handbook —*[Type Manipulation: InstanceType / ConstructorParameters](https://www.typescriptlang.org/docs/handbook/utility-types.html)*.
- TC39 class features — the `class extends Base { … }` semantics mixins rely on.
- The original "Real Mixins with JavaScript Classes" article (Reg Braithwaite)
  for the cultural background of the `=> class extends` pattern.
