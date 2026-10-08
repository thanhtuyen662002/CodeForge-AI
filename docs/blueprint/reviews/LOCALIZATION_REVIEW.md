# Independent localization review

Checked 2026-10-08 by a separate agent. Scope: the owner-requested language extension of the disconnected prototype and related documentation. This is a technical/design review, not a fluent human translation review, customer experiment, content release approval or GitHub approving review.

## Basis and findings

Read AGENTS, PROJECT_STATE, DECISION_MEMO, frozen VALIDATION_PLAN v2 and live [issue20](https://github.com/thanhtuyen662002/CodeForge-AI/issues/20) (OPEN, acceptance still unchecked). Inspected the locale catalog/runtime, changed templates/styles, integrity checker, localization decision and cross-document additions. Did not restart the earlier market/thesis review.

| ID | Severity | Finding and observed evidence | Action / status |
|---|---|---|---|
| LQ01 | MEDIUM | Missing translated attributes have the wrong effective language. In Japanese Help, deleting that locale's placeholder entry produced an English `#help-note` placeholder while its effective `lang` stayed `ja`; the fallback warning did appear. Text-fragment fallback had already been corrected to an English span by the author during this review. | **eliminate — OPEN**: annotate fallback attributes with the language actually rendered and restore the intended language when the native value returns; verify both placeholder and ARIA fallback. |
| LQ02 | LOW | The author's initial rendered-coverage test only recognized Vietnamese text already in the catalog. Newly introduced, uncatalogued template prose could therefore remain untranslated without that check failing. Independent complete enumeration found no such prose in the current nine screens; uncatalogued tokens were only brand, punctuation, LAB IDs and numbers. | **simplify — OPEN**: make rendered coverage compare against the target catalog plus a small explicit non-prose token allowlist, and distinguish catalog integrity from template coverage. No production framework or service is needed. |

## Independent evidence

- `node scripts/check-planning.mjs` passed: 36 documents,119 local links, unchanged strategy budgets/thresholds and existing blueprint model at the first review checkpoint.
- `node scripts/check-locales.mjs` passed: five languages and209 complete, nonempty plain-text message IDs with unique Vietnamese source lookup values. This establishes catalog structure only.
- `git diff --check` passed; Git reported only the configured future LF-to-CRLF normalization notices.
- Independent Chromium smoke traversed all nine screens and all three scenarios in English, collecting all visible text nodes plus ARIA labels and placeholders. No uncatalogued prose remained. Tokens excluded from localization were brand/punctuation, LAB A/B identifiers, numeric steps/counts and check symbols.
- Independently reproduced English text fallback and the LQ01 attribute language failure. Source-drift injection confirmed the LQ02 check gap; this synthetic injected string was not persisted in any source file.
- Direct `file:///.../prototype/index.html` loading and switching from Japanese browser preference to English succeeded; language and query parameter updated without a page error. This supplements the author's localhost testing.
- Visually inspected the author's English desktop and Japanese mobile captures: translated layout remained readable, warnings visible, and no obvious clipping. This is not an exhaustive accessibility audit or a claim of native wording quality.
- The author records405 locale/screen/scenario/viewport cases in [locales-result](../qa/locales-result.json). That broader matrix is author evidence, separate from this review's narrower independent smoke.

## Scope, safety and remaining release blockers

Five draft UI locales are explicit: English, Vietnamese, Japanese, Korean and Simplified Chinese. Other listed languages are candidates, not completed support. Language choice is separate from country, payments, technical content and support eligibility. No runtime translation provider, profile database or paid service was introduced. Text catalogs cannot inject HTML; user-entered textarea content is excluded from translation. URL language preference is explicit without cookies or local/session storage. Technical API/content identifiers and the USD49 price hypothesis are retained.

Frozen Vietnamese protocol v2, cohort definitions, P0/90-day caps and kill thresholds are unchanged. UI completeness is not international willingness-to-pay evidence. There is still no released learning pack in any language, and no purchase/publication authority follows from the language switch. Native technical review, translated content equivalence and actual country/support/merchant feasibility remain explicit blockers before a commercial locale is offered.

**Verdict at initial checkpoint: CHANGES REQUESTED for LQ01; LQ02 is a bounded maintenance correction.** Closure will be recorded here after independent read-back and focused verification, without deleting these original findings.

## Independent closure and nine-language extension — 2026-10-08

A separate final reviewer read the preserved checkpoint above and verified the current working tree. The previous reviewer did not close the findings before its run ended; the evidence below is this final reviewer's own follow-up. The initial five-language scope and405-case author result above are historical. The owner's subsequent selection of both regional groups now governs: **en, vi, ja, ko, zh-Hans, de, fr, es, pt-BR** are all draft UI locales; none is a released learning-content locale.

| ID | Severity retained | Independent closure evidence | Action / status |
|---|---|---|---|
| LQ01 | MEDIUM | Removed Japanese entries in browser memory, separately for a mixed heading, Help placeholder and screen-selector ARIA label. Each English fallback received `lang=en` and the fallback notice became visible. Reinstating each original translation restored Japanese text and `lang=ja`, and hid the notice. An unsent mixed-language Help note and the selected request retained their values through attribute fallback/restoration and a further language switch. No source catalog was changed by these probes. | **eliminate — CLOSED** for the observed text/placeholder/ARIA failure. |
| LQ02 | LOW | Read the checked-in browser checker: it compares rendered text and both localized attributes against the selected catalog, allowing only explicit brand/symbol/LAB-ID/numeric tokens. Independently enumerated all current screen/state combinations in all nine locales and found no unknown prose. Injected an uncatalogued paragraph and ARIA label in browser memory; the strict coverage guard reported both, then returned clean after their removal. Catalog structure and rendered coverage remain separate checks. | **simplify — CLOSED**; no added runtime service or application framework. |

Independent evidence at this checkpoint:

- Required state/decision/protocol files were reread. Live [issue20](https://github.com/thanhtuyen662002/CodeForge-AI/issues/20), checked2026-10-08, remains OPEN with unchecked execution acceptance. No experiment or prerequisite completion is inferred.
- Catalog integrity passed with **nine locales and209complete message IDs**; the locale list agrees with PROJECT_STATE and the blueprint model. Planning integrity passed after this closure was appended with37documents and133local links, unchanged budgets/thresholds,42strategy plus33blueprint dispositions and9screens/12features. `git diff --check` passed.
- A separate Chromium147.0.7727.15 harness loaded the prototype directly using `file://`, starting from Japanese browser preference, then traversed **243 combinations:9locales×9screens×3states at390px**. It checked current HTML language, complete rendered prose/attribute coverage and absence of page-level horizontal overflow. This independent sample is distinct from the author's broader729-case matrix and does not claim to rerun that full matrix.
- Focused tests independently verified all three LQ01 fallback/restoration paths, preservation of unsent input and request selection, and rejection of the two synthetic uncatalogued additions. Each locale's displayed price matched `Intl.NumberFormat` for **USD49**, rather than a converted currency. No HTTP(S) requests, page errors, cookies or local/session storage entries were observed in this run.
- Visually inspected the updated German, Spanish and Brazilian Portuguese mobile captures. Draft/simulation notices were visible; the widened screen/scenario selectors were readable, and no obvious text clipping was seen. This remains a sampled visual inspection, not native linguistic approval or a complete accessibility audit.
- Read the author's latest [locale result](../qa/locales-result.json) and durable browser-check source:729cases across1280/390/320px, plus placeholder/ARIA restoration checks and unknown-attribute coverage. These results remain **author evidence**. The optional browser harness uses an existing runtime and temporary loopback server; CI runs the dependency-free planning/catalog checks, not the browser matrix.
- Compared frozen `VALIDATION_PLAN.md` and `DECISION_MEMO.md` with the reviewed branch base: no localization diff. PROJECT_STATE/model changes add localization metadata only. P0 remains10workingdays/20h/$100; the90-day ceiling remains160h/$500. Protocolv2's Vietnamese cohort, USD49 offer and all gates/denominators retain their definitions. No new services, runtime translation, product implementation, customer cohort, payment or deployment is introduced.

**Final technical/design verdict: PASS WITH EXPLICIT RELEASE BLOCKERS.** LQ01 and LQ02 are closed for this bounded prototype extension. No new critical/high finding blocks the disconnected nine-language preview. This verdict does not assert fluent or technically equivalent translations, customer demand, live security controls, or a valid international offer. Competent human technical-language review, translated learning material, actual support capability, merchant/refund/country eligibility and the existing customer-evidence gates remain unresolved before any commercial release. Agent QA does not replace those approvals or an eligible GitHub review.
