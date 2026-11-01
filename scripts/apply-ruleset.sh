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
command -v node >/dev/null
root="$(cd "$(dirname "$0")/.." && pwd)"
result="$(mktemp)"
trap 'rm -f "$result"' EXIT

# Verify every merge-gate run belongs to the live foundation branch HEAD and succeeded.
foundation_head="$(gh api "repos/$repo/branches/foundation%2Flearner-first-design" --jq '.commit.sha')"
gh api --paginate --slurp "repos/$repo/commits/$foundation_head/check-runs?per_page=100" --jq --arg sha "$foundation_head" '{
  total_count: ([.[].check_runs[] | select(.name == "merge-gate" and .app.id == 15368 and .head_sha == $sha)] | length),
  check_runs: [.[].check_runs[] | select(.name == "merge-gate" and .app.id == 15368 and .head_sha == $sha)]
}' > "$result"
node "$root/scripts/check-ruleset-readback.mjs" --validate-merge-gate "$result" "$foundation_head"

# Do not activate a rule that would deadlock the owner: require a real non-owner reviewer with write-capable permission.
owner="$(gh api "repos/$repo" --jq '.owner.login')"
actor="$(gh api user --jq '.login')"
reviewers="$(gh api "repos/$repo/collaborators?per_page=100" --paginate --jq --arg owner "$owner" --arg actor "$actor" '.[] | select(.login != $owner and .login != $actor and (.permissions.push == true or .permissions.maintain == true or .permissions.admin == true)) | .login')"
if [[ -z "$reviewers" ]]; then
  echo 'No independent collaborator other than the repository owner/current actor has push/maintain/admin permission; refusing to change the live ruleset.' >&2
  exit 5
fi

existing="$(gh api "repos/$repo/rulesets?per_page=100" --paginate --jq '.[] | select(.name == "CodeForge main") | .id')"
existing_count="$(printf '%s\n' "$existing" | awk 'NF { count++ } END { print count + 0 }')"
if [[ "$existing_count" -gt 1 ]]; then
  echo 'Multiple same-name rulesets exist. Refusing to choose or overwrite one.' >&2
  exit 3
fi

if [[ -n "$existing" ]]; then
  id="$existing"
  gh api "repos/$repo/rulesets/$id" > "$result"
  node "$root/scripts/check-ruleset-readback.mjs" --validate-existing-target "$root/.github/rulesets/main.json" "$result"
  gh api --method PUT "repos/$repo/rulesets/$id" --input "$root/.github/rulesets/main.json" > "$result"
  action=updated
else
  gh api --method POST "repos/$repo/rulesets" --input "$root/.github/rulesets/main.json" > "$result"
  id="$(jq -er '.id' "$result")"
  action=created
fi

gh api "repos/$repo/rulesets/$id" > "$result"
node "$root/scripts/check-ruleset-readback.mjs" --compare "$root/.github/rulesets/main.json" "$result"
echo "Ruleset $id $action in place and exact read-back matches. Prove a failing PR cannot merge before closing G0."
