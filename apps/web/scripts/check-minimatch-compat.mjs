import assert from "node:assert/strict";
import { minimatch } from "minimatch";

// Keep this override scoped to typescript-estree: other ESLint consumers still use minimatch 3.x.
assert.equal(typeof minimatch, "function");
assert.equal(minimatch("src/app/page.tsx", "**/*.tsx", { dot: true }), true);
assert.equal(minimatch(".next/types/app/page.ts", "**/*.ts", { dot: true }), true);
assert.equal(minimatch("src/app/page.ts", "**/*.tsx", { dot: true }), false);
