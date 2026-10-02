#!/usr/bin/env bash
# Run only on a trusted maintainer machine, never in an untrusted PR workflow.
set -euo pipefail
repo="${1:-}"
if [[ "$repo" != "thanhtuyen662002/CodeForge-AI" ]]; then
  echo 'Refusing unexpected target. Pass thanhtuyen662002/CodeForge-AI.' >&2
  exit 2
fi
if [[ "${CODEFORGE_CONFIRM_RULESET:-}" != apply ]]; then
  echo 'Review .github/rulesets/main.json and confirm a separate eligible reviewer is available.' >&2
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
verified="$(gh api "repos/$repo/commits/foundation%2Flearner-first-design/check-runs" --jq '[.check_runs[] | select(.name == "merge-gate" and .app.id == 15368 and .status == "completed" and .conclusion == "success")] | length > 0')"
if [[ "$verified" != true ]]; then
  echo 'A successful GitHub Actions merge-gate on the foundation head is not verified.' >&2
  exit 4
fi
result="$(mktemp)"
trap 'rm -f "$result"' EXIT
gh api --method POST "repos/$repo/rulesets" --input "$root/.github/rulesets/main.json" > "$result"
id="$(jq -er '.id' "$result")"
gh api "repos/$repo/rulesets/$id" > "$result"
jq -e --slurpfile wanted "$root/.github/rulesets/main.json" '
  . as $actual | $wanted[0] as $expected |
  $actual.name == $expected.name and
  $actual.target == $expected.target and
  $actual.enforcement == $expected.enforcement and
  $actual.bypass_actors == $expected.bypass_actors and
  $actual.conditions == $expected.conditions and
  (($actual.rules | sort_by(.type)) == ($expected.rules | sort_by(.type)))
' "$result" >/dev/null
echo "Ruleset $id created and read-back matches. Prove a failing PR cannot merge before closing G0."
