import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

function writeFiles(root, files) {
  for (const [relativePath, contents] of Object.entries(files)) {
    const target = join(root, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents);
  }
}

function scenario(baseFiles, removePaths = [], currentFiles = {}) {
  const root = mkdtempSync(join(tmpdir(), "codeforge-required-gate-"));
  mkdirSync(join(root, "scripts"), { recursive: true });
  copyFileSync(helperSource, join(root, "scripts/detect-required-gate-suites.mjs"));
  writeFiles(root, baseFiles);
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
    assert.match(run.output, /web_present=false/);
  } finally {
    run.cleanup();
  }
});


const webSuiteFiles = {
  "apps/web/package.json": "{\"name\":\"synthetic\"}\\n",
  "apps/web/package-lock.json": "{}\\n",
  "apps/web/.nvmrc": "24\\n",
  "apps/web/app/page.tsx": "export default function Page() { return null; }\\n",
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
