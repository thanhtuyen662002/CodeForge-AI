# GitHub Governance

## Desired repository rules

Main requires a pull request, at least one independent approval, stale approvals dismissed, latest push reviewed, resolved conversations, linear history, no force push or deletion, and required `merge-gate` status with branch up-to-date. CODEOWNERS routes security/schema/workflows/content to the repository owner as interim steward; that is not a claim of an independent security/content team. Author cannot satisfy their own required approval.

Bootstrap safety: the repository currently has one named CODEOWNER, who is also the author of foundation PR #1. Requiring that sole code owner's approval would deadlock their own PR. Therefore `require_code_owner_review` is false initially, while one independent eligible approval remains mandatory. Nominate an actual collaborator with review rights before activation; role-play is not a substitute. Enable mandatory code-owner review in a later reviewed ruleset change once independent eligible code owners exist for every critical path. Do not lower required approvals to zero merely to get the PR merged.

The ruleset specification is `.github/rulesets/main.json`. A file in Git does not enable these settings. The connected GitHub actions available during foundation creation support repository content and PR writes but do not expose administration/ruleset writes. Therefore activation/read-back and the failing-PR enforcement test are an explicit CF-01/G0 blocker until performed with an authorized administrative interface. Repository owner permissions and connector capabilities are different things. A live read during this foundation task returned an empty ruleset list; no enforced protection is claimed.

## Activation

Review JSON and ensure an independent eligible reviewer is available. After the named check succeeds, import the ruleset in GitHub Settings → Rules → Rulesets, or run the following from the reviewed branch on a trusted machine with `gh`, `jq` and repository administration authorization:

```sh
CODEFORGE_CONFIRM_RULESET=apply bash scripts/apply-ruleset.sh thanhtuyen662002/CodeForge-AI
```

Script refuses an unexpected target, refuses to overwrite an existing same-name ruleset, verifies a successful GitHub Actions merge-gate, and compares the read-back configuration to the requested rules. Never place an admin token in CI solely to make self-modifying rules work. The script has not been run against repository administration in this session.

Read back active enforcement, expected branches, approvals and status checks. Test with a harmless failing PR that cannot merge; repair/close it afterwards. Do not claim “CI fail cannot merge” until this repository-side test is done. If the reviewer is also the latest pusher, another eligible approval is needed; do not impersonate another person.

## CI policy

Stable jobs quality, content and security feed `merge-gate` using always() and requiring every dependency success. PR/push/merge_group events; no path filtering that silently removes required jobs. Read-only token, SHA-pinned Actions, bounded timeout/concurrency, no cloud secrets. Foundation quality builds/tests only the domain library; adding web/database/execution requires real jobs before respective release flags enable.

Dependabot prepares weekly version/action updates; owners review security and compatibility rather than blindly enabling auto-merge. Private vulnerability reporting and secret/push protection should be enabled where available; actual settings must be verified, not inferred from config filenames.
