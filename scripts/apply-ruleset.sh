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
workflow_runs_result="$(mktemp)"
latest_workflow_runs_result="$(mktemp)"
jobs_result="$(mktemp)"
trap 'rm -f "$result" "$workflow_runs_result" "$latest_workflow_runs_result" "$jobs_result"' EXIT

# The required workflow must be pinned to the exact current main commit, never a PR-controlled workflow copy.
main_head="$(gh api "repos/$repo/branches/main" --jq '.commit.sha')"
node "$root/scripts/check-ruleset-readback.mjs" --validate-main-workflow-pin "$root/.github/rulesets/main.json" "$main_head"

# CheckRun has no created_at. Bind evidence to the latest Foundation CI workflow run
# on the exact foundation branch, then to the jobs returned for that run's latest attempt.
foundation_head="$(gh api "repos/$repo/branches/foundation%2Flearner-first-design" --jq '.commit.sha')"
gh api --paginate --slurp "repos/$repo/actions/runs?head_sha=$foundation_head&per_page=100" --jq '{
  total_count: (.[0].total_count // 0),
  workflow_runs: [.[].workflow_runs[]]
}' > "$workflow_runs_result"
latest_run="$(node "$root/scripts/check-ruleset-readback.mjs" --select-latest-workflow-run "$workflow_runs_result" "$foundation_head")"
IFS=$'\t' read -r latest_run_id latest_run_attempt <<< "$latest_run"
if [[ -z "$latest_run_id" || -z "$latest_run_attempt" ]]; then
  echo 'Could not resolve the latest Foundation CI workflow attempt; refusing ruleset mutation.' >&2
  exit 4
fi
gh api --paginate --slurp "repos/$repo/actions/runs/$latest_run_id/attempts/$latest_run_attempt/jobs?per_page=100" --jq '{
  total_count: (.[0].total_count // 0),
  jobs: [.[].jobs[]]
}' > "$jobs_result"
gh api --paginate --slurp "repos/$repo/commits/$foundation_head/check-runs?filter=all&per_page=100" | jq --arg sha "$foundation_head" '{
  source_total_count: (.[0].total_count // 0),
  source_check_runs: [.[].check_runs[]],
  total_count: ([.[].check_runs[] | select(.name == "merge-gate" and .app.id == 15368 and .head_sha == $sha)] | length),
  check_runs: [.[].check_runs[] | select(.name == "merge-gate" and .app.id == 15368 and .head_sha == $sha)]
}' > "$result"
node "$root/scripts/check-ruleset-readback.mjs" --validate-merge-gate "$result" "$workflow_runs_result" "$jobs_result" "$foundation_head"

# Do not activate a rule that would deadlock the owner: require a real non-owner reviewer with write-capable permission.
owner="$(gh api "repos/$repo" --jq '.owner.login')"
actor="$(gh api user --jq '.login')"
reviewers="$(gh api "repos/$repo/collaborators?per_page=100" --paginate | jq --arg owner "$owner" --arg actor "$actor" '.[] | select(.login != $owner and .login != $actor and (.permissions.push == true or .permissions.maintain == true or .permissions.admin == true)) | .login')"
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
fi

# Re-read immediately before mutation. A new run or rerun during evidence collection
# invalidates the earlier success snapshot; fail closed instead of activating on stale evidence.
gh api --paginate --slurp "repos/$repo/actions/runs?head_sha=$foundation_head&per_page=100" --jq '{
  total_count: (.[0].total_count // 0),
  workflow_runs: [.[].workflow_runs[]]
}' > "$latest_workflow_runs_result"
node "$root/scripts/check-ruleset-readback.mjs" --assert-latest-workflow-run-stable "$workflow_runs_result" "$latest_workflow_runs_result" "$foundation_head"

# Re-read main immediately before the ruleset write; a stale workflow SHA must never be applied.
main_head_before_mutation="$(gh api "repos/$repo/branches/main" --jq '.commit.sha')"
node "$root/scripts/check-ruleset-readback.mjs" --validate-main-workflow-pin "$root/.github/rulesets/main.json" "$main_head_before_mutation"

if [[ -n "$existing" ]]; then
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
