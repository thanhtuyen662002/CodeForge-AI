# Features, journeys and screens

2026-10-07. **HYPOTHESIS / design only.** Scope is the two-lab verification pack in PRODUCT_THESIS. A screen specification is not permission to build it or proof that users want it. No AI judge, IDE or hiring assessment.

## Feature decisions

| ID | User job / acceptance | S0/S1 cheapest form | Conditional S2 form | Evidence / removal rule |
|---|---|---|---|---|
| F01 | Decide if the pack addresses a recent incident; see price/scope/refund before paying | Static offer + plain demo | Same public page | If unclear after5discovery reads, rewrite copy; not more features |
| F02 | Try a reasoning question without setup | Static incident and checklist, no account | Same page | Do not count reading as local activation |
| F03 | Know exactly what was bought and when it arrives | Merchant receipt + manual order record | Prefer merchant-native guest purchase; optional library claim afterward | No merchant/refund path→no payment CTA |
| F04 | Obtain the correct reviewed starter version | Private staged manual delivery | Entitlement-checked expiring download | G1 first; no public paid file or never-expiring secret URL |
| F05 | Prepare local work without sharing credentials | Plain supported-runtime checklist | Read-only lab guide | No automatic shell/agent execution from the browser |
| F06 | Inspect checks and explain merge/reject | Local public checks + own reflection | Ephemeral local results view, no server history | No leaderboard/mastery score; invalid report does not become a skill failure |
| F07 | Compare reasoning with a debrief after an attempt | Staged manual reference | Server-gated debrief availability | Keep unseen measurement separate; no hidden-answer security claim |
| F08 | Practice a second context | LabB sent after agreed stage | Two-item library with explicit next step | No season/calendar feed; completion can end the product |
| F09 | Get correction/refund or export/delete optional data | Owner handles requests on existing channel | Small support/privacy page | No chat widget/helpdesk subscription; no promise to delete required payment evidence |
| F10 | Reconcile orders and withdraw a faulty version | Private checklist/ledger | Minimal owner-only operations table | Add UI only when measured manual bottleneck warrants it |
| F11 | Learn whether practice transfers | Consented private probes + aggregate readout | Remains separate research workflow | No learner-facing grade/certification; no generic survey builder |
| F12 | Keep sessions private | No app account required | Email OTP via Supabase + configured SMTP | Auth only for optional automated order/delivery access; no practice history; free SMTP not assumed production-ready |

Priorities: F01/F02/paper F03 now; F04–F09 manual after their gates; F10/F12 web automation later; F11 manual research. No search, catalogue filters, graph recommendations or social feed for two labs.

## Journeys

**Discovery:** offer→paper demo→free checklist or fixed-price offer. Interview selection does not require an incident; paid-offer eligibility does, as protocolv2 specifies. Qualified refusal is useful evidence.

**S1 buyer:** merchant-confirmed order→dated delivery promise→reviewed labs/debrief under disclosed delivery schedule. Consenting study participants take baseline before practice and delayed probes under protocol v2; nonparticipants obtain the same purchased learning access without completing a form, attaining a score or waiting for a research event. Debrief timing is advice for learning; buyer can skip to available purchased material. Record research opt-out/missing outcomes in locked denominators, never coerce participation. Research forms remain private. Static demo is never mislabeled executable onboarding.

**S2 buyer:** offer→order review→eligible merchant guest checkout/delivery→optional library claim after verified ownership→lab guide→local execution→ephemeral practice summary→debrief. No CodeForge OTP before purchase by default. Merchant support for this flow is unresolved; keep S1 if unavailable. Payment return URL is not proof of purchase. Pending/error states preserve the order and provide support without duplicate payment. Optional portal is not required to retain purchased files.

**Incident:** content quarantined→new downloads blocked→advisory/correction/refund offered→version retained for diagnosis. Browser cannot revoke an offline copy. Founder does not run uploaded learner code to investigate.

## Screen inventory and states

| Screen | Purpose / primary action | Data and authority | Required alternatives | Gate |
|---|---|---|---|---|
| S01 Offer | Two labs, problem, scope, price; “Xem bài thử” | Public approved copy | Not launched; merchant not ready; sold-out capacity only if real | S0 static |
| S02 Paper demo | Read synthetic incident; think of counterexample; see free checklist | Public text only | Keyboard/mobile readable; no install required | S0 static |
| S03 Order review | Price, currency, delivery/refund/support terms; proceed to merchant | Server-owned SKU/price; account ifS2 | Merchant unavailable; cancellation; already paid; expired offer | S0 manual/S2 automation |
| S04 Library | Two entitled labs, next relevant action | Server entitlement + catalogue; practice state self-reported | Empty; pending order; refunded; content withdrawn; offline | S2 only |
| S05 Lab guide | Spec, invariant and local preparation | Reviewed versioned content, consented delivery stage | Unsupported runtime; blocked corporate machine; wrong version; static fallback | S1 document/S2 page |
| S06 Practice summary | Show checks vs reasoning; go to debrief | Optional self-reported summary, never verified badge | Invalid schema, old version, error/timeout, no reflection, opt-out | S1 private/S2 page |
| S07 Debrief | Explain a failure and uncertainty; continue labB | Versioned authored explanation | Not yet released; quarantined; research contamination warning handled privately | S1 staged/S2 page |
| S08 Help/privacy | Request correction/refund/export/delete | Own account/order; minimal bounded text | Email failure; request accepted≠refund completed; legally retained receipts | S1 manual/S2 page |
| S09 Operations | Reconcile a small order list, quarantine version | Owner permission checked server-side; aggregate learning only | Payment conflict; backup stale; quarantined release | Manual now; optionalS2 |

F12/auth is a conditional claim state after purchase, not a separate onboarding flow. No questionnaire or interests taxonomy. New account only when automation justifies it; mockup does not solicit real email. No promise of indefinite hosted access/updates: actual offer must specify delivery, download availability, 30-day content-error support, supported version and correction policy before charging. Buyer keeps a permitted durable local copy.

## Prototype contract

[Open the prototype](prototype/index.html). It is a standalone local artifact with synthetic sample states, no external assets/API/network/payment, no code download/runner and no personal data storage. Navigation and scenario buttons let a reviewer inspect normal, pending and withdrawn states. A permanent reviewer banner identifies it as a design, and any apparent payment/download action explicitly stays a simulation. All sample figures are invented UI fixtures, not CodeForge metrics.

Responsive target: readable at390px and desktop1280px, keyboard-accessible navigation, visible focus, meaningful labels and status announcements. Reduced-motion users see no motion-dependent information. Diagrams/text must not rely on colour alone. No fake testimonial, user count, scarcity, guaranteed improvement or hiring value.

Prototype is for design usability, not the fixed-offer demand experiment. Record any exposure separately. Do not mix exposed respondents into the untouched G3 cohort; demand copy must describe the manual deliverable actually available. Nine screens are alternatives for review, not nine implementation tickets. Lack of demand for the manual pack cannot be rescued with prototype enthusiasm.

## Usability questions before implementation

Can a reader explain “verification practice” rather than “AI coding course”? Can they see BYO agent costs and local permissions before buying? Do they understand results are self-reported? Is the distinction between a demo, paid practice and private research clear? Can someone find refund/correction without an account maze? If no, simplify content/navigation before writing backend code.

Usability review is not WTP/learning validation. Existing G0–G6 thresholds remain canonical. The prototype cannot count as ten G2 local runs, actual payments or G4 transfer evidence.
