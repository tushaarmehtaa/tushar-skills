import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "../lib/json-ld.ts";

test("JSON-LD cannot terminate its script element", () => {
  const serialized = serializeJsonLd({ description: "</script><script>alert(1)</script>", separator: "\u2028\u2029" });

  assert.doesNotMatch(serialized, /</);
  assert.doesNotMatch(serialized, /\u2028|\u2029/);
  assert.deepEqual(JSON.parse(serialized), {
    description: "</script><script>alert(1)</script>",
    separator: "\u2028\u2029",
  });
});
