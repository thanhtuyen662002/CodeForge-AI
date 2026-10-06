import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryFiles } from './files.mjs';

const required = ['README.md', 'AGENTS.md', 'CONTRIBUTING.md', 'SECURITY.md',
  'docs/INDEX.md', 'docs/PRODUCT_VISION.md', 'docs/ARCHITECTURE.md',
  'docs/ASSESSMENT_ENGINE.md', 'docs/ADAPTIVE_LEARNING.md', 'docs/SKILL_GRAPH.md',
  'docs/CONTENT_MODEL.md', 'docs/AI_TUTOR.md', 'docs/CODING_SANDBOX.md',
  'docs/SECURITY.md', 'docs/DATA_MODEL.md', 'docs/ROADMAP.md', 'docs/RESEARCH.md',
  'docs/EXAM_TRACK_AI_PRACTICAL.md', 'docs/RED_TEAM.md', 'docs/RELEASE_GATES.md',
  '.github/CODEOWNERS', '.github/workflows/ci.yml', '.github/rulesets/main.json'];
for (const path of required) assert.ok(existsSync(path), `Missing required file: ${path}`);
let checked = 0;
for (const path of repositoryFiles()) {
  if (!/\.(md|ts|mjs|json|ya?ml|sh|toml)$/.test(path)) continue;
  const text = readFileSync(path, 'utf8');
  assert.ok(!text.startsWith('\uFEFF') && !text.includes('\r'), `Use UTF-8/LF: ${path}`);
  assert.ok(text.endsWith('\n'), `Missing final newline: ${path}`);
  assert.ok(!text.split('\n').some((line) => /[ \t]+$/.test(line)), `Trailing whitespace: ${path}`);
  if (path.endsWith('.json')) JSON.parse(text);
  if (path.endsWith('.mjs')) {
    const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
  if (path.endsWith('.md')) {
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const link = match[1];
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      const target = decodeURIComponent(link.split('#')[0]);
      assert.ok(existsSync(resolve(dirname(path), target)), `Broken relative link in ${path}: ${link}`);
    }
  }
  checked++;
}
console.log(`Repository conventions, JS syntax and local document links checked in ${checked} files.`);
