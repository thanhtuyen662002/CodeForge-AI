import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { repositoryFiles } from './files.mjs';

const suspicious = [
  /(?:AKIA|ASIA)[A-Z0-9]{16}/,
  /github_pat_[A-Za-z0-9_]{30,}/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
for (const path of repositoryFiles()) {
  const text = readFileSync(path, 'utf8');
  for (const pattern of suspicious) assert.ok(!pattern.test(text), `Potential secret in ${path}; do not print it`);
  if (path.startsWith('.github/workflows/') && /\.ya?ml$/.test(path)) {
    assert.ok(!/^\s*pull_request_target\s*:/m.test(text), `Unsafe trigger in ${path}`);
    assert.ok(text.includes('contents: read'), `Read-only permissions required: ${path}`);
    for (const match of text.matchAll(/uses:\s*([^\s#]+)/g)) {
      if (!match[1].startsWith('./')) assert.match(match[1], /@[a-f0-9]{40}$/, `Unpinned action: ${match[1]}`);
    }
  }
}
const rules = JSON.parse(readFileSync('.github/rulesets/main.json', 'utf8'));
assert.equal(rules.enforcement, 'active');
assert.ok(rules.rules.some((rule) => rule.type === 'non_fast_forward'));
const checks = rules.rules.find((rule) => rule.type === 'required_status_checks');
assert.ok(checks.parameters.required_status_checks.some((check) => check.context === 'merge-gate'));
console.log('Baseline secret-pattern/workflow/ruleset checks passed. This is not a complete secret scanner or security audit; live ruleset activation is separate.');
