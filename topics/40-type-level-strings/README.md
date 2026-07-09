# 40 — Type-level string operations

> Template-literal types let the type system *parse* strings: `` `${infer
 * Head}${D}${infer Tail}` `` is a type-level regex match. Combined with
> recursion and tuples you can rebuild `String.prototype.split`, `.join`,
> `.replace`, `.trim`, and `.startsWith` — all at compile time, with no
> runtime code.

## TL;DR

- `` S extends \`${infer H}${D}${infer T}\` `` splits `S` on the first `D`.
- Recurse on `T` to consume all delimiters → `Split`.
- Variadic tuples (`[infer First, ...infer Rest]`) drive `Join`.
- A `${Whitespace}${infer Rest}` pattern trims; `${P}${string}` tests a prefix.
- Edge cases matter: empty delimiter, empty string, no match.

## Learning objectives

After this topic you can:

- Read and write `infer` positions inside template-literal types.
- Build recursive type-level parsers that terminate.
- Produce tuple-typed results (`Split`) and string-typed results (`Join`,
  `Replace`, `Trim`, `StartsWith`).
- Verify each against concrete literal strings via `expectTypeOf`, plus a
  runtime mirror so behaviour and type agree.

## Sub-exercises

1. `01-split-join` — `Split<S, D>` (→ tuple) and `Join<T, D>` (→ string),
   including the empty-string and no-delimiter cases.
2. `02-replace-trim-startswith` — `Replace<S, From, To>` (first match, with
   `From = ""` guard), `Trim<S>` (leading + trailing whitespace),
   `StartsWith<S, P>` (→ `true | false`).

## Resources

- TypeScript Handbook — *[Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)*.
- TypeScript Handbook — *[Conditional types with `infer`](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)*.
- type-challenges — *`Trim`*, *`Replace`*, *`Split`*, *`Capitalize`* (medium set).
- Type-Level TypeScript — *"Template Literal Types"* chapter.
