import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import test from "node:test";

const helperSource = fileURLToPath(new URL("../scripts/detect-required-gate-suites.mjs", import.meta.url));

const contentSuiteFiles = {
  ".github/workflows/content-publication-safety.yml": "name: synthetic safety workflow\n",
  "scripts/check-content-publication-safety.mjs": "// synthetic checker\n",
  "tests/content-publication-safety.test.mjs": "// synthetic test\n",
  "tests/fixtures/content-safety/public-item.valid.json": "{}\n",
  "tests/fixtures/content-safety/hidden-answer.invalid.json": "{}\n",
  "tests/fixtures/content-safety/duplicate-key-hidden-answer.invalid.json": "{}\n",
  "tests/fixtures/content-safety/malformed-json.invalid.json": "{}\n",
  "tests/fixtures/content-safety/missing-classification.invalid.json": "{}\n",
  "tests/fixtures/content-safety/missing-provenance.invalid.json": "{}\n",
};

const publicContentSuiteFiles = {
  "content/items/manifest.json": "{\"schemaVersion\":1,\"items\":[]}\n",
  "content/items/example.json": "{}\n",
  "scripts/check-public-content-manifest.mjs": "// synthetic checker\n",
  "tests/public-content-manifest.test.mjs": "// synthetic test\n",
};

const contentGraphSuiteFiles = {
  "packages/content-contract/package.json": "{\"name\":\"@codeforge/content-contract\",\"private\":true}\n",
  "packages/content-contract/tsconfig.json": "{\"compilerOptions\":{\"strict\":true}}\n",
  "packages/content-contract/src/index.ts": "export {};\n",
  "tests/content-contract/content-graph.test.mjs": "import test from 'node:test'; test('synthetic', () => {});\n",
};

function writeFiles(root, files) {
  for (const [relativePath, contents] of Object.entries(files)) {
    const target = join(root, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents);
  }
}

function writeSymlinks(root, links) {
  for (const [relativePath, target] of Object.entries(links)) {
    const linkPath = join(root, relativePath);
    mkdirSync(dirname(linkPath), { recursive: true });
    symlinkSync(target, linkPath);
  }
}

function scenario(baseFiles, removePaths = [], currentFiles = {}, options = {}) {
  const { baseSymlinks = {}, currentSymlinks = {} } = options;
  const root = mkdtempSync(join(tmpdir(), "codeforge-required-gate-"));
  mkdirSync(join(root, "scripts"), { recursive: true });
  copyFileSync(helperSource, join(root, "scripts/detect-required-gate-suites.mjs"));
  writeFiles(root, baseFiles);
  writeSymlinks(root, baseSymlinks);
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["config", "user.name", "Gate Regression Test"], { cwd: root });
  execFileSync("git", ["config", "user.email", "gate-test@example.invalid"], { cwd: root });
  execFileSync("git", ["add", "--all"], { cwd: root });
  execFileSync("git", ["commit", "-m", "synthetic base"], { cwd: root, stdio: "ignore" });
  const baseTree = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();

  for (const relativePath of removePaths) {
    rmSync(join(root, relativePath), { recursive: true, force: true });
  }
  writeFiles(root, currentFiles);
  writeSymlinks(root, currentSymlinks);
  const outputPath = join(root, "github-output.txt");
  const result = spawnSync(process.execPath, [join(root, "scripts/detect-required-gate-suites.mjs")], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, BASE_TREE: baseTree, GITHUB_OUTPUT: outputPath },
  });
  let output = "";
  try {
    output = readFileSync(outputPath, "utf8");
  } catch {
    // A failed closed check must not emit a successful suite-presence result.
  }
  return { result, output, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

test("no protected suite in current tree or base may be skipped", () => {
  const run = scenario({});
  try {
    assert.equal(run.result.status, 0, run.result.stderr);
    assert.match(run.output, /content_present=false/);
    assert.match(run.output, /public_content_present=false/);
    assert.match(run.output, /web_present=false/);
  } finally {
    run.cleanup();
  }
});

test("removing every content-safety file still fails closed against the base tree", () => {
  const run = scenario(contentSuiteFiles, [
    ".github/workflows/content-publication-safety.yml",
    "scripts/check-content-publication-safety.mjs",
    "tests/content-publication-safety.test.mjs",
    "tests/fixtures/content-safety",
  ]);
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content safety suite is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("deleting the entire web app still fails closed against the base tree", () => {
  const webFiles = {
    "apps/web/package.json": "{\"name\":\"synthetic\"}\n",
    "apps/web/package-lock.json": "{}\n",
    "apps/web/.nvmrc": "24\n",
    "apps/web/app/page.tsx": "export default function Page() { return null; }\n",
  };
  const run = scenario(webFiles, ["apps/web"]);
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Web app is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("a partial content suite fails closed instead of being treated as absent", () => {
  const run = scenario({
    "scripts/check-content-publication-safety.mjs": "// synthetic checker\n",
  });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content safety suite is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("a complete content suite is detected and emitted for the required job", () => {
  const run = scenario(contentSuiteFiles);
  try {
    assert.equal(run.result.status, 0, run.result.stderr);
    assert.match(run.output, /content_present=true/);
    assert.match(run.output, /public_content_present=false/);
    assert.match(run.output, /web_present=false/);
  } finally {
    run.cleanup();
  }
});

const webSuiteFiles = {
  "apps/web/package.json": "{\"name\":\"synthetic\"}\n",
  "apps/web/package-lock.json": "{}\n",
  "apps/web/.nvmrc": "24\n",
  "apps/web/app/page.tsx": "export default function Page() { return null; }\n",
};

test("a partial web app fails closed instead of being treated as absent", () => {
  const run = scenario({
    "apps/web/app/page.tsx": "export default function Page() { return null; }\\n",
  });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Web app is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("a complete web app is detected and emitted for the required job", () => {
  const run = scenario(webSuiteFiles);
  try {
    assert.equal(run.result.status, 0, run.result.stderr);
    assert.match(run.output, /web_present=true/);
  } finally {
    run.cleanup();
  }
});

test("a candidate-only public content file fails closed until the full manifest suite exists", () => {
  const run = scenario({}, [], {
    "content/items/example.json": "{}\n",
  });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Public content is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("removing the public manifest/checker/tests cannot make the required gate skip", () => {
  const run = scenario(publicContentSuiteFiles, [
    "content/items",
    "scripts/check-public-content-manifest.mjs",
    "tests/public-content-manifest.test.mjs",
  ]);
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Public content is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("a partial public content suite fails closed", () => {
  const run = scenario({}, [], {
    "scripts/check-public-content-manifest.mjs": "// synthetic checker\n",
  });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Public content is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("complete public content and publication-safety suites are detected together", () => {
  const run = scenario({ ...contentSuiteFiles, ...publicContentSuiteFiles, ...contentGraphSuiteFiles });
  try {
    assert.equal(run.result.status, 0, run.result.stderr);
    assert.match(run.output, /public_content_present=true/);
    assert.match(run.output, /content_present=true/);
    assert.match(run.output, /content_graph_present=true/);
    assert.match(run.output, /web_present=false/);
  } finally {
    run.cleanup();
  }
});


test("public content cannot be introduced without the publication-safety suite", () => {
  const run = scenario(publicContentSuiteFiles);
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content safety suite is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});


test("removing publication-safety assets cannot leave public content on a manifest-only gate", () => {
  const run = scenario(
    { ...contentSuiteFiles, ...publicContentSuiteFiles },
    [
      ".github/workflows/content-publication-safety.yml",
      "scripts/check-content-publication-safety.mjs",
      "tests/content-publication-safety.test.mjs",
      "tests/fixtures/content-safety",
    ],
  );
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content safety suite is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("a complete content graph contract is detected for the required gate", () => {
  const run = scenario(contentGraphSuiteFiles);
  try {
    assert.equal(run.result.status, 0, run.result.stderr);
    assert.match(run.output, /content_graph_present=true/);
  } finally {
    run.cleanup();
  }
});

test("removing the content graph contract cannot make the required gate skip it", () => {
  const run = scenario(contentGraphSuiteFiles, ["packages/content-contract", "tests/content-contract"]);
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content graph contract is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("a partial content graph contract fails closed", () => {
  const run = scenario({}, [], {
    "packages/content-contract/src/index.ts": "export {};\\n",
  });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content graph contract is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("public content requires the versioned content graph contract", () => {
  const run = scenario({ ...contentSuiteFiles, ...publicContentSuiteFiles });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content graph contract is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});


test("a symlinked required content checker fails closed", () => {
  const run = scenario({}, [], {
    "scripts/benign-checker.mjs": "// benign no-op\\n",
  }, {
    currentSymlinks: {
      "scripts/check-content-publication-safety.mjs": "benign-checker.mjs",
    },
  });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content safety suite is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("a symlinked required-suite parent directory fails closed", () => {
  const run = scenario({}, [], {
    "alternate-github/workflows/content-publication-safety.yml": "name: benign workflow\\n",
  }, {
    currentSymlinks: {
      ".github": "alternate-github",
    },
  });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content safety suite is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});

test("deleting a base-tree symlink cannot make the required suite disappear", () => {
  const run = scenario({
    "scripts/benign-checker.mjs": "// benign no-op\\n",
  }, ["scripts/check-content-publication-safety.mjs"], {}, {
    baseSymlinks: {
      "scripts/check-content-publication-safety.mjs": "benign-checker.mjs",
    },
  });
  try {
    assert.equal(run.result.status, 1);
    assert.match(run.result.stderr, /Content safety suite is present in the PR or base/);
  } finally {
    run.cleanup();
  }
});
