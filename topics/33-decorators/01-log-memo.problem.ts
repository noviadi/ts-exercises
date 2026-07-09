/**
 * PROMPT — `@log` and `@memo` method decorators (stage-3)
 *
 * Stage-3 decorators are plain functions. A **method** decorator receives:
 *
 *   (target: Function, ctx: ClassMethodDecoratorContext) => Function | void
 *
 *   - `target`  — the method itself (a function value).
 *   - `ctx`     — a context object: `{ name, kind: "method", static, private,
 *                 access, metadata, addInitializer }`.
 *
 * Returning a new function **replaces** the method. Returning `void` leaves it
 * untouched.
 *
 * Your job:
 *   1. Implement `log` — a method decorator that wraps the method so each call
 *      prints `${name}(${args.join(",")}) -> <result>` and returns the result.
 *   2. Implement `memo` — a method decorator that memoises by `JSON.stringify(args)`.
 *   3. Implement `sealed` — a *class* decorator that calls `Object.seal` on the
 *      constructor (signature:
 *      `(target: Function, ctx: ClassDecoratorContext) => Function | void`).
 *
 * Rules:
 *   - Use the stage-3 shapes above — do NOT rely on the legacy
 *     `experimentalDecorators` signature `(target, key, descriptor)`.
 *   - Decorators must preserve the wrapped method's call signature, so callers
 *     don't lose type info.
 *
 * Run:  npx tsc --noEmit 01-log-memo.problem.ts
 */

// TODO: implement `log`, `memo`, `sealed` below using the stage-3 shapes.

class Calculator {
  @log
  square(n: number): number {
    return n * n;
  }

  @memo
  expensive(n: number): number {
    // pretend this is slow:
    return n * 2 + 1;
  }
}

@sealed
class Settings {}

import { expectTypeOf } from "@lib";

// CHECKS — should pass once the decorators are implemented.

// The decorated methods keep their original call signatures:
// expectTypeOf<Calculator["square"]>().toEqualTypeOf<(n: number) => number>();
// expectTypeOf<Calculator["expensive"]>().toEqualTypeOf<(n: number) => number>();
