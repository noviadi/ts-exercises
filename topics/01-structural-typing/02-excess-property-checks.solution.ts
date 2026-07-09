/**
 * SOLUTION — Excess property checks
 *
 * The exception to structural typing: when you assign an object **literal
 * directly** to a typed location (variable, argument, return), TypeScript runs
 * an *excess property check* and rejects unknown keys.
 *
 *   - It is a property of the LITERAL + the TARGET, not of variables.
 *   - Once the object is stored in a variable with its own inferred type, the
 *     check no longer applies — ordinary structural assignability takes over,
 *     which is *lenient* again.
 *
 * This is why the two calls below behave differently despite "same data".
 */

type Point = { x: number; y: number };

function draw(p: Point): void {}

// Direct literal → excess property check fires:
// @ts-expect-error  Object literal may only specify known properties, and 'z' does not exist in type 'Point'.
draw({ x: 1, y: 2, z: 3 });

// explanation: assign to a variable first. `p` is inferred as
// `{ x: number; y: number; z: number }`, which structurally satisfies `Point`
// (more props = still assignable). No fresh-literal check on `p`, so this compiles.
const p = { x: 1, y: 2, z: 3 };
draw(p);

// 💡 Takeaways:
//   • Fresh-literal excess checks catch typos at the call site — keep them.
//   • If you intentionally pass extra fields, route through a variable, or
//     explicitly type it as `Point` and pick the fields you need.
//   • Optional properties on the target also relax the check for known keys.

// `export {}` makes this file a module (it has no other imports/exports) so its
// `Point`/`draw` don't collide with the matching problem file at type-check time.
export {};

