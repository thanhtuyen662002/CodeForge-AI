import { appendFileSync, lstatSync } from "node:fs";
import { execFileSync } from "node:child_process";

const baseTree = process.env.BASE_TREE ?? "";
const outputPath = process.env.GITHUB_OUTPUT;

function inspectPath(path) {
  const parts = path.split("/");
  let current = "";
  for (const [index, part] of parts.entries()) {
    current = current ? current + "/" + part : part;
    let info;
    try {
      info = lstatSync(current);
    } catch {
      return { exists: false, safe: false };
    }
    if (info.isSymbolicLink()) return { exists: true, safe: false };
    if (index < parts.length - 1 && !info.isDirectory()) return { exists: true, safe: false };
    if (index === parts.length - 1) {
      return { exists: true, safe: true, isFile: info.isFile(), isDirectory: info.isDirectory() };
    }
  }
  return { exists: false, safe: false };
}

function pathExists(path) {
  return inspectPath(path).exists;
}

function isFile(path) {
  const info = inspectPath(path);
  return info.exists && info.safe && info.isFile;
}

function gitExists(args) {
  try {
    execFileSync("git", args, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function baseHasPath(path) {
  if (!baseTree) return false;
  const parts = path.split("/");
  let prefix = "";
  for (const [index, part] of parts.entries()) {
    prefix = prefix ? prefix + "/" + part : part;
    let output;
    try {
      output = execFileSync("git", ["ls-tree", "-z", baseTree, "--", prefix], { encoding: "utf8" });
    } catch {
      return false;
    }
    const entry = output.split("\0").find(Boolean);
    if (!entry) return false;
    const tabIndex = entry.indexOf("\t");
    if (tabIndex < 0) return false;
    const mode = entry.slice(0, tabIndex).split(" ")[0];
    if (mode === "120000" || (index < parts.length - 1 && mode !== "040000")) return true;
    if (index === parts.length - 1) return true;
  }
  return false;
}

function baseHasWebFiles() {
  return baseHasPath("apps/web");
}

function baseHasContentItemsFiles() {
  return baseHasPath("content/items");
}
function baseHasContentGraphFiles() {
  return baseHasPath("packages/content-contract") || baseHasPath("tests/content-contract");
}

try {
  if (!outputPath) throw new Error("GITHUB_OUTPUT is required; refusing to skip required-suite detection.");
  if (baseTree && !gitExists(["cat-file", "-e", baseTree + "^{tree}"])) {
    throw new Error("Resolved base tree is unavailable; refusing to skip required-suite detection.");
  }

  const publicContentPaths = [
    "content/items/manifest.json",
    "scripts/check-public-content-manifest.mjs",
    "tests/public-content-manifest.test.mjs",
  ];
  const publicContentPresent =
    pathExists("content/items") ||
    baseHasContentItemsFiles() ||
    publicContentPaths.some((path) => isFile(path) || baseHasPath(path));

  const contentPaths = [
    ".github/workflows/content-publication-safety.yml",
    "scripts/check-content-publication-safety.mjs",
    "tests/content-publication-safety.test.mjs",
    "tests/fixtures/content-safety/public-item.valid.json",
    "tests/fixtures/content-safety/hidden-answer.invalid.json",
    "tests/fixtures/content-safety/duplicate-key-hidden-answer.invalid.json",
    "tests/fixtures/content-safety/malformed-json.invalid.json",
    "tests/fixtures/content-safety/missing-classification.invalid.json",
    "tests/fixtures/content-safety/missing-provenance.invalid.json",
  ];
  const requiredContentPaths = contentPaths.slice(1);
  // A public content root must run the private-answer/provenance safety suite too.
  // A manifest-only suite must not become a weaker route around publication checks.
  const contentPresent =
    publicContentPresent ||
    contentPaths.some((path) => isFile(path) || baseHasPath(path));
  if (publicContentPresent) {
    const missing = publicContentPaths.filter((path) => !isFile(path));
    if (missing.length) {
      throw new Error("Public content is present in the PR or base, but the manifest, checker, and regression suite must all be present: " + missing.join(", "));
    }
  }
  if (contentPresent) {
    const missing = requiredContentPaths.filter((path) => !isFile(path));
    if (missing.length) {
      throw new Error("Content safety suite is present in the PR or base, but required files are missing: " + missing.join(", "));
    }
  }

  const contentGraphPresent =
    publicContentPresent ||
    pathExists("packages/content-contract") ||
    pathExists("tests/content-contract") ||
    baseHasContentGraphFiles();
  if (contentGraphPresent) {
    const requiredContentGraphPaths = [
      "packages/content-contract/package.json",
      "packages/content-contract/tsconfig.json",
      "packages/content-contract/src/index.ts",
      "tests/content-contract/content-graph.test.mjs",
    ];
    const missing = requiredContentGraphPaths.filter((path) => !isFile(path));
    if (missing.length) {
      throw new Error("Content graph contract is present in the PR or base, but required typecheck/test inputs are missing: " + missing.join(", "));
    }
  }

  const webPresent = pathExists("apps/web") || baseHasWebFiles();
  if (webPresent) {
    const requiredWebPaths = ["apps/web/package.json", "apps/web/package-lock.json", "apps/web/.nvmrc"];
    const missing = requiredWebPaths.filter((path) => !isFile(path));
    if (missing.length) {
      throw new Error("Web app is present in the PR or base, but required pinned inputs are missing: " + missing.join(", "));
    }
  }

  appendFileSync(outputPath, "content_present=" + contentPresent + "\n");
  appendFileSync(outputPath, "public_content_present=" + publicContentPresent + "\n");
  appendFileSync(outputPath, "content_graph_present=" + contentGraphPresent + "\n");
  appendFileSync(outputPath, "web_present=" + webPresent + "\n");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
