/**
 * SOLUTION — The `metadata` symbol convention
 *
 * Each decorator context carries a `metadata` field — a single shared plain
 * object that TS instantiates once per class. Every decorator on that class
 * (method, field, accessor, or the class itself) sees the SAME object, so it
 * can act as a per-class "scratch space".
 *
 * After the class declaration finishes, that object is exposed as a static,
 * symbol-keyed property of the class: `MyClass[Symbol.metadata]`. The
 * `Symbol.metadata` well-known key is the formal contract between authors and
 * consumers of metadata-aware decorators.
 *
 *   Decorator writes  ─►  ctx.metadata.foo = …
 *   Consumer reads     ─►  MyClass[Symbol.metadata]?.foo
 *
 * No `reflect-metadata` npm package, no `emitDecoratorMetadata`, no
 * `experimentalDecorators`. This is plain stage-3 syntax.
 */

import { assert, describe, expectTypeOf } from "@lib";

// A "tags" entry is an array of method names registered as e.g. readable.
type TagsBag = { tags?: string[] };

// `@tagged(name)` — push `name` onto the metadata bag's `tags` array, lazily
// initialising it. We use `??=` so the first decorator on the class creates
// the array and subsequent ones append to it.
function tagged(name: string) {
  return function tagged(
    _target: unknown,
    ctx: ClassMethodDecoratorContext,
  ): void {
    const meta = ctx.metadata as TagsBag;
    (meta.tags ??= []).push(name);
  };
}

// explanation: `Symbol.metadata` is a static, symbol-keyed property the stage-3
// runtime adds to every decorated class. Reading it back gives the same object
// every decorator wrote to.
//
// ⚠️ Runtime caveat: `Symbol.metadata` is part of the TC39 decorator-metadata
// proposal and is NOT yet shipped natively by every host (Node <= 22 lacks it,
// and even newer Nodes may not expose it). The toolchains that lower decorators
// for us (swc/tsx/esbuild) therefore fall back to the cross-runtime-stable
// registered key `Symbol.for("Symbol.metadata")` — the SAME key we read here,
// so author and consumer agree regardless of native support. We cast through
// `{ [k: symbol]: ... }` because the bag's contents are intentionally untyped
// at the language level — `TagsBag` is OUR schema for what we wrote.
function getTags(
  Class: abstract new (...args: any[]) => unknown,
): readonly string[] {
  const key: symbol = Symbol.for("Symbol.metadata");
  const holder = Class as unknown as { [k: symbol]: TagsBag | undefined };
  const meta = holder[key];
  return meta?.tags ?? [];
}

class UserService {
  @tagged("read")
  getUser(id: string): { id: string } {
    return { id };
  }

  @tagged("read")
  listUsers(): { id: string }[] {
    return [];
  }

  @tagged("write")
  saveUser(_u: { id: string }): void {}
}

// CHECKS — compile-time.
expectTypeOf<ReturnType<typeof getTags>>().toExtend<readonly string[]>();

// Runtime: verify the bag actually accumulated all three tags, in source order.
describe("Symbol.metadata exposes decorator-written data", () => {
  const tags = getTags(UserService);
  assert(tags.length === 3, `expected 3 tags, got ${tags.length}`);
  assert(tags[0] === "read", "first tag is 'read'");
  assert(tags[1] === "read", "second tag is 'read'");
  assert(tags[2] === "write", "third tag is 'write'");

  // The bag is per-class: a different decorated class has its own metadata.
  class Other {
    @tagged("custom")
    m(): void {}
  }
  const otherTags = getTags(Other);
  assert(otherTags.length === 1, "Other has exactly one tag");
  assert(otherTags[0] === "custom", "and it is 'custom'");
});
