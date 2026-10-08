# Language expansion — international reach without a second platform

Checked **2026-10-08**. Owner requested English and additional languages to reach users in more countries. This is an authorized extension of the disconnected prototype and design. It does not establish foreign demand, launch a country, authorize translation purchases or alter the frozen customer protocol.

## Decision and current artifact

**English plus Vietnamese are the base.** The owner selected **both regional groups** on2026-10-08. The prototype also includes **Japanese (`ja`), Korean (`ko`), Simplified Chinese (`zh-Hans`), German (`de`), French (`fr`), Spanish (`es`) and Brazilian Portuguese (`pt-BR`)**, for nine UI languages across all nine screen types, status notices, help options, placeholders and accessibility labels. Every locale is explicitly a **translation draft**; structural completeness does not replace a fluent technical review. No released learning pack exists in any language yet.

The visible language selector uses native language names, not country flags. Explicit `?lang=` selection wins; otherwise a supported browser language is used, with English fallback. No IP geolocation, account, language-profile storage or new service. Changing languages preserves the current screen, scenario, open details and unsent input. The URL retains the selection on reload; there is no cookie/localStorage persistence. Simplified Chinese is not silently substituted for Traditional Chinese.

## Evidence and prioritization

FACT sources checked2026-10-08:

- [GitHub Octoverse2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) reports large developer communities across the US, India, China, Brazil, UK, Japan, Germany, Indonesia, Russia and Canada, with Korea and France also appearing in its public-activity comparisons. This is GitHub platform activity, **not** all professional developers, preferred learning language, purchasing power or CodeForge demand.
- [GitHub's current Octoverse index](https://github.blog/octoverse/) linked the2025report at this check. Do not label an invented2026market ranking.
- [W3C language declarations](https://www.w3.org/International/questions/qa-html-language-declarations) describes language tags on HTML; [W3C authoring guidance](https://www.w3.org/International/docs/bp-html-lang/) explains why flags are inappropriate language selectors. Language and country are separate dimensions.

The following is **HYPOTHESIS / prioritization**, not a claim that these markets will pay:

| Group | Languages / possible reach | Decision |
|---|---|---|
| Base | English `en`; Vietnamese `vi` | Usable draft UI now. English offers a common interface for users who prefer it across countries; do not assume everyone in India or any country uses it. |
| First additional design group | Japanese `ja`; Korean `ko`; Simplified Chinese `zh-Hans` | Draft UI now; fluent review, support capability and actual merchant availability required before a commercial locale. No inference that language makes a provider available in a country. |
| Additional owner-selected group | German `de`; French `fr`; Spanish `es`; Brazilian Portuguese `pt-BR` | Draft UI now, as requested. Commercial release still needs a reachable audience and qualified review. Country variants/terms need review; no flags or automatic currency changes. |
| Further candidates | Indonesian `id`; Traditional Chinese `zh-Hant`; Hindi `hi`; Arabic `ar` | Research on request. Do not equate Indian users with Hindi; do not equate Chinese with one script. Arabic requires a reviewed right-to-left layout before claiming support. |

Do not expand solely because a country is called a technology hub. Prefer an audience the founder can reach, a reviewer who can validate technical meaning, a supported merchant/refund route and support that fits the existing time budget. One additional commercial locale at a time after evidence. No speculative locale issues are opened.

## Cheap implementation and future contract

Current prototype: a static `messages.js` catalog has209stable message IDs with nine complete language values. `i18n.js` translates text nodes and accessible attributes using plain text; translation values cannot introduce HTML. Existing synthetic page structure is retained. Copy IDs stay stable when wording changes; do not regenerate/renumber IDs. The template's Vietnamese source lookup is acceptable for this small prototype; if source wording changes, update its catalog source value in the same change and run `node scripts/check-prototype-browser.cjs` with an existing Playwright/Chromium installation. It checks rendered prose against the target catalog plus explicit brand/ID/numeric tokens. `check-locales.mjs` checks catalog structure only. Future product templates should reference message IDs directly before broader UI implementation; do not turn DOM text matching into a general application framework.

Missing text falls back to English with a visible notice; complete catalogs are required by the checked-in integrity check. `<html lang>` updates and fallback text receives its language annotation. Technical IDs such as LAB-A, event IDs, code identifiers and API contracts are unchanged. Display formatting uses `Intl.NumberFormat`, but the hypothesis remains **USD49**, never inferred JPY/KRW/CNY pricing. Translating text does not add multicurrency checkout or change refund/support terms.

If a real web app is justified, use the same finite message files with the framework's ordinary locale routes. No translation microservice, runtime LLM, geolocation provider, separate country app/database or paid localization SaaS is needed. Public launch can later emit reviewed locale routes and alternate-language links; this unpublished single-page prototype does not claim multilingual SEO or cross-country performance.

## Learning content, payments and research are separate gates

UI availability, learning-material availability, support language, merchant country eligibility and translation review status must be shown separately in an actual offer. A translated purchase page alone cannot promise translated exercises or native-language support. Keep payment/refund/currency/delivery conditions equivalent and reviewed before charging. The prototype has no real checkout.

Future content translation records: `challenge_id`, `content_version`, `source_digest`, `locale`, `translation_revision`, `review_status`, `review_record`. Source meaning changes mark dependent translations stale. A fluent technical reviewer checks invariants, negation, permission warnings, answer timing and debrief meaning. Translation must not expose probes early or change evaluator semantics. Code/tests and competency IDs stay shared; an independently changed task is a new content version. No runtime AI grading or automatic translation of private notes/learner input.

The current v2experiment starts with reachable Vietnamese-speaking developers. Its denominators, price and kill thresholds remain unchanged. Prototype-language clicks do not count as international demand. Do not pool new-language cohorts or translated probes into that frozen result to rescue a failure. Before an international cohort, freeze its actual offer/content/support language and a new protocol version prospectively; retain the old result. A locale is not a proxy for nationality. Collect country only if required for the actual transaction or a separately consented bounded research question; do not build a skill/country dossier.

## Cost and adversarial checks

No new recurring service is needed for these dictionaries; actual translation/reviewer time and acquisition/support costs are **UNKNOWN**, not free. Obtain a real review quote or a competent volunteer commitment before a release decision; the160h/$500ceiling does not authorize spending. Every extra locale multiplies copy review, content drift and support obligations even when static hosting cost is unchanged.

| Risk | Cheapest response / stop rule |
|---|---|
| Fluent-looking UI hides a mistranslated invariant or safety warning | Draft label now; competent bilingual technical review before release; withdraw affected translation when critical ambiguity is found. |
| Many languages consume the founder's time before anyone pays | Do not translate the unreleased full corpus yet; use the finite prototype and select one future commercial locale only with audience/reviewer evidence. |
| Translated offer sells English-only content without consent | State material/support language before payment; do not enable that locale's paid CTA until the promise is deliverable. |
| English fallback looks like complete localization | Visible fallback notice, correct language annotation and exact catalog coverage check; no silent mixed-language claim. |
| Geography expansion changes frozen evidence | Separate preregistered cohorts; never pool to manufacture threshold success. |
| Language switch loses user work | No screen rerender on locale change; verify input/selection/details remain; no storing or translating user-entered text. |
| Same source text gets a different technical meaning later | Stable IDs and source consistency checks; use direct message IDs in future product templates; do not reuse one key for divergent meanings. |
| International payment/support becomes complex | Keep country eligibility and support as actual merchant/manual feasibility questions; no multi-entity/multicurrency platform in this task. |

Validation evidence for this extension is recorded in QUALITY_GATE and the locale browser result. It proves prototype behavior and structural coverage, not native translation quality, demand or instructional equivalence.

## Reproducing prototype checks

Run `node scripts/check-locales.mjs` and `node scripts/check-planning.mjs` from the repository root. These dependency-free checks run in the documentation CI gate.

Optional browser QA: `node scripts/check-prototype-browser.cjs` uses an existing Playwright installation and its Chromium. If they are not on the normal module/browser paths, set `CODEFORGE_PLAYWRIGHT_MODULE` to the installed Playwright module and `CODEFORGE_CHROMIUM_PATH` to the existing browser executable. The script does not install dependencies; it serves only the six prototype files on a temporary loopback port, exercises729locale/screen/state/viewport combinations plus behavior/fallback checks, and refreshes the screenshots and `qa/locales-result.json`. Browser QA is local evidence, not an additional CI check or a native-language approval. Review generated evidence changes before committing them.
