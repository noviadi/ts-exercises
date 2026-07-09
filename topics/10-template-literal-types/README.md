# 10 — Template literal types

> A **template literal type** is the type-level twin of a JS template string:
> `` `${Prefix}/${Suffix}` ``. Each placeholder can be a `string`, a `number`,
> or — most powerfully — a *union of string literals*, in which case TypeScript
> expands the template into the full cartesian product of all combinations.
> This is the engine behind typed route strings, event names, CSS property keys,
> and the `Capitalize`/`Uppercase` accessor patterns from Topic 09.

## Learning objectives

After this topic you can:

- Read and write the `` `${U & string}` `` syntax, and explain why each
  placeholder must be `string | number | bigint | boolean | null | undefined`
- (and most useful: a **union of string literals**).
- Predict the **cartesian-product** expansion when two unions are interpolated
  into one template, and use it to synthesise large literal unions from small
  inputs.
- Combine template literals with the intrinsic string-manipulation types
  (`Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`) to build path
  strings, dotted keys, and HTTP-style method+route unions.
- Write a `Join<Parts, Sep>` recursive literal type and an `EventName` style
  helper that maps a record of event payloads to their `"on<Event>"` string
  literals.

## Sub-exercises

1. `01-composition` — the warm-up: interpolate unions into a template, observe
   the cartesian product, and use `${U & string}` to constrain a generic.
2. `02-paths-and-casing` — build path strings (`a.b.c`) and HTTP method+route
   unions (`GET /users`) using `Capitalize`/`Uppercase` and template literals.
3. `03-join-event-name` — a recursive `Join<Parts, Sep>` literal type and an
   `EventName<Events>` helper that derives `"onClick" | "onScroll"` from an
   event-map.

## Resources

- TypeScript Handbook — *[Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)*.
- TypeScript Handbook — *[Intrinsic string manipulation types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#handbook-content)* (`Uppercase`/`Lowercase`/`Capitalize`/`Uncapitalize`).
- TypeScript 4.1 release notes — the original introduction of template literal types.
- type-challenges — `Join`, `Trim`, `Replace`, `CamelCase` and the `EventListener` puzzles.
