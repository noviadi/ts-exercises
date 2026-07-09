# 33 — Decorators (stage 3)

> Decorators are the TC39 stage-3 proposal for **declaratively** modifying
> classes, methods, fields, accessors, and (in the future) function parameters.
> TypeScript has shipped native support since 5.0 — no `experimentalDecorators`
> flag needed. They are plain syntax: a `@name` prefix on a class member that
> calls a decorator *function* with a well-defined context object.

## Learning objectives

After this topic you can:

- Author stage-3 decorators for **methods**, **fields**, and **classes** using
  the standard shapes:

  ```ts
  type MethodDecorator = (target: Function, ctx: ClassMethodDecoratorContext) => Function | void;
  type FieldDecorator   = (target: undefined, ctx: ClassFieldDecoratorContext) => (initialiser: (v: unknown) => unknown) => unknown;
  type ClassDecorator   = (target: Function, ctx: ClassDecoratorContext) => Function | void;
  ```

- Replace a method with a wrapped one (the `@log` / `@memo` pattern) and have
  TypeScript correctly retain the original method's call signature.
- Use the `ctx.metadata` object and the **`Symbol.metadata`** convention to
  attach and later read type-erased metadata off a class — the bridge between
  declarative decorators and runtime reflection.

## Sub-exercises

1. `01-log-memo` — `@log` (method) and `@memo` (method) decorators, plus a
   `@sealed` class decorator. Pure stage-3, no legacy flag.
2. `02-metadata-symbol` — the `ctx.metadata` bag, the `Symbol.metadata`
   well-known key, and a tiny `getMetadata(Class)` helper that reads it.

## Resources

- TypeScript Handbook —*[Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)*
  (the stage-3 redesign, 5.0+).
- TC39 proposal —*[\[tc39/proposal-decorators\]](https://github.com/tc39/proposal-decorators)*.
- TypeScript 5.0 release notes — the `metadata` context field.
- `Symbol.metadata` —*[\[tc39/proposal-decorator-metadata\]](https://github.com/tc39/proposal-decorator-metadata)*.
