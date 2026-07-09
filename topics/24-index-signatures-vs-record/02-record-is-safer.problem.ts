/**
 * PROMPT — `Record<K, V>` with a finite key union is safer
 *
 * When the set of keys is known (or even just bounded), `Record<K, V>` beats a
 * bare index signature:
 *
 *   - The key union is preserved, so editors give you **autocomplete** on the
 *     keys and **flag unknown keys** as errors.
 *   - Each key's value is precisely `V`, and known keys aren't widened to
 *     `V | undefined` by `noUncheckedIndexedAccess`.
 *
 * Tasks:
 *   1. Define `Env` as `Record<"HOME" | "PATH" | "USER", string>` (do NOT use
 *      an index signature).
 *   2. Fix the CHECKS to reflect what `Record` actually gives you.
 *   3. Annotate the line that genuinely errors (accessing a key that isn't in
 *      the union) with `// @ts-expect-error`.
 *
 * Run:  npx tsc --noEmit 02-record-is-safer.problem.ts
 */

// TODO: type Env as Record<"HOME" | "PATH" | "USER", string>.
type Env = TODO;

const env: Env = { HOME: "/h", PATH: "/bin", USER: "root" };

import { expectTypeOf } from "@lib";

// CHECKS — fix these to describe the real Record behaviour.
expectTypeOf<typeof env["HOME"]>().toEqualTypeOf<string | undefined>(); // ❓ known key
expectTypeOf<typeof env["PATH"]>().toEqualTypeOf<string>(); // ❓ known key
// env["SHELL"];  // ❓ an unknown key — should this error? uncomment + annotate.
