#!/usr/bin/env bash
# Run only on a trusted maintainer machine, never in an untrusted PR workflow.
set -euo pipefail
repo="${1:-}"
if [[ "$repo" != "thanhtuyen662002/CodeForge-AI" ]]; then
  echo 'Refusing unexpected target. Pass thanhtuyen662002/CodeForge-AI.' >&2
  exit 2
fi
if [[ "${CODEFORGE_CONFIRM_RULESET:-}" != apply ]]; then
  echo 'Review .github/rulesets/main.json and confirm a separate reviewer is available.' >&2
  echo 'Then run: CODEFORGE_CONFIRM_RULESET=apply bash scripts/apply-ruleset.sh thanhtuyen662002/CodeForge-AI' >&2
  exit 2
fi
command -v gh >/dev/null
command -v jq >/dev/null
root="$(cd "$(dirname "$0")/.." && pwd)"
existing="$(gh api "repos/$repo/rulesets" --paginate --jq '.[] | select(.name == "CodeForge main") | .id')"
if [[ -n "$existing" ]]; then
  echo 'Same-name ruleset exists. Refusing overwrite; inspect and reconcile manually.' >&2
  exit 3
fi
app_id="$(gh api "repos/$repo/commits/foundation%2Flearner-first-design/check-runs" --jq '.check_runs[] | select(.name == "merge-gate") | .app.id' | head -1)"
if [[ "$app_id" != 15368 ]]; then
  echo 'Expected GitHub Actions merge-gate is not verified. Run CI and inspect the check app first.' >&2
  exit 4
fi
result="$(mktemp)"
trap 'rm -f "$result"' EXIT
gh api --method POST "repos/$repo/rulesets" --input "$root/.github/rulesets/main.json" > "$result"
id="$(jq -er '.id' "$result")"
gh api "repos/$repo/rulesets/$id" > "$result"
jq -e '.enforcement == "active" and .target == "branch"' "$result" >/dev/null
echo "Ruleset $id created and active. Inspect all fields and prove a failing PR cannot merge before closing G0."
