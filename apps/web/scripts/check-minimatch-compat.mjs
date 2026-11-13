import assert from "node:assert/strict";
import { escape, minimatch } from "minimatch";

// Keep this override scoped to typescript-estree: other ESLint consumers still use minimatch 3.x.
assert.equal(typeof minimatch, "function");
assert.equal(minimatch("src/app/page.tsx", "**/*.tsx", { dot: true }), true);
assert.equal(minimatch(".next/types/app/page.ts", "**/*.ts", { dot: true }), true);
assert.equal(minimatch("src/app/page.ts", "**/*.tsx", { dot: true }), false);

// GHSA-c859-jr93-m5j4: escaped user text must remain literal, not become negation/comment syntax.
for (const options of [{}, { windowsPathsNoEscape: true }]) {
  const bang = escape("!secret.txt", options);
  assert.equal(minimatch("!secret.txt", bang, options), true);
  assert.equal(minimatch("passwd", bang, options), false);

  const comment = escape("#notes.md", options);
  assert.equal(minimatch("#notes.md", comment, options), true);
  assert.equal(minimatch("notes.md", comment, options), false);
}

// Escaping a literal backslash+star must survive a caller-supplied brace expansion.
const escapedBackslash = `${escape("x\\\\*")}.{js,ts}`;
assert.equal(minimatch("x\\\\*.js", escapedBackslash), true);
assert.equal(minimatch("x\\\\*.ts", escapedBackslash), true);
assert.equal(minimatch("x\\\\anything.js", escapedBackslash), false);

// GHSA-c859-jr93-m5j4: braces supplied by untrusted literal text also trigger expansion.
const escapedUserBraces = escape("x\\\\*{,}");
assert.equal(minimatch("x\\\\*", escapedUserBraces), true);
assert.equal(minimatch("x\\\\anything", escapedUserBraces), false);

// GHSA-c859-jr93-m5j4 Windows-path + magical-braces regression.
const windowsBraceOptions = { windowsPathsNoEscape: true, magicalBraces: true };
const escapedBraces = escape("x{a,b}", windowsBraceOptions);
assert.equal(minimatch("x{a,b}", escapedBraces, windowsBraceOptions), true);
assert.equal(minimatch("xa", escapedBraces, windowsBraceOptions), false);
assert.equal(minimatch("xb", escapedBraces, windowsBraceOptions), false);
