import { appendFileSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";

const baseTree = process.env.BASE_TREE ?? "";
const outputPath = process.env.GITHUB_OUTPUT;

function isFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function gitExists(args) {
  try {
    execFileSync("git", args, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function baseHasFile(path) {
  return baseTree.length > 0 && gitExists(["cat-file", "-e", baseTree + ":" + path]);
}

function baseHasWebFiles() {
  if (!baseTree) return false;
  const files = execFileSync("git", ["ls-tree", "-r", "--name-only", baseTree, "--", "apps/web/"], {
    encoding: "utf8",
  });
  return files.trim().length > 0;
}

function baseHasContentItemsFiles() {
  if (!baseTree) return false;
  const files = execFileSync("git", ["ls-tree", "-r", "--name-only", baseTree, "--", "content/items/"], {
    encoding: "utf8",
  });
  return files.trim().length > 0;
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
    existsSync("content/items") ||
    baseHasContentItemsFiles() ||
    publicContentPaths.some((path) => isFile(path) || baseHasFile(path));

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
    contentPaths.some((path) => isFile(path) || baseHasFile(path));
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

  const webPresent = existsSync("apps/web") || baseHasWebFiles();
  if (webPresent) {
    const requiredWebPaths = ["apps/web/package.json", "apps/web/package-lock.json", "apps/web/.nvmrc"];
    const missing = requiredWebPaths.filter((path) => !isFile(path));
    if (missing.length) {
      throw new Error("Web app is present in the PR or base, but required pinned inputs are missing: " + missing.join(", "));
    }
  }

  appendFileSync(outputPath, "content_present=" + contentPresent + "\n");
  appendFileSync(outputPath, "public_content_present=" + publicContentPresent + "\n");
  appendFileSync(outputPath, "web_present=" + webPresent + "\n");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
