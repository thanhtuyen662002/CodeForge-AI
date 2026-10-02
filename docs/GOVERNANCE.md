# GitHub Governance

## Desired repository rules

Main requires a pull request, at least one independent approval, stale approvals dismissed, latest push reviewed, resolved conversations, linear history, no force push or deletion, and required `merge-gate` status with branch up-to-date. CODEOWNERS routes security/schema/workflows/content to the repository owner as interim steward; that is not a claim of an independent security/content team. Author cannot satisfy their own required approval.

The ruleset specification is `.github/rulesets/main.json`. A file in Git does not enable these settings. The connected GitHub actions available during foundation creation support repository content and PR writes but do not expose administration/ruleset writes. Therefore activation/read-back and the failing-PR enforcement test are an explicit CF-01/G0 blocker until performed with an authorized administrative interface. Repository owner permissions and connector capabilities are different things.

## Activation

Review JSON, wait for CI to create the named check, then import the ruleset in GitHub Settings → Rules → Rulesets or run `bash scripts/apply-ruleset.sh thanhtuyen662002/CodeForge-AI` from a trusted machine with `gh` and repository administration authorization. Script refuses an unexpected target and refuses to overwrite an existing same-name ruleset. Never place an admin token in CI solely to make self-modifying rules work.

Read back active enforcement, expected branches, approvals and status checks. Test with a harmless failing PR that cannot merge; repair/close it afterwards. Do not claim “CI fail cannot merge” until this repository-side test is done.

## CI policy

Stable jobs quality, content and security feed `merge-gate` using always() and requiring every dependency success. PR/push/merge_group events; no path filtering that silently removes required jobs. Read-only token, SHA-pinned Actions, bounded timeout/concurrency, no cloud secrets. Foundation quality builds/tests only the domain library; adding web/database/execution requires real jobs before respective release flags enable.

Dependabot prepares weekly version/action updates; owners review security and compatibility rather than blindly enabling auto-merge. Private vulnerability reporting and secret/push protection should be enabled where available; actual settings must be verified, not inferred from config filenames.
