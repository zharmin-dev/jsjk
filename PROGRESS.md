# PROGRESS

Last updated: 2026-08-12 20:50 Asia/Kuala_Lumpur
Current milestone: SDS v1.3 mock capability demonstration — Phases 0–4 implemented + sample-screen styling
Overall status: Ready for review

## Completed

- Simulated login screen matching `sample-screen/login.png` (brand-navy page, centred white card, ID/password, navy submit, simulated-auth notice). Session gate via sessionStorage with log-out.
- Shell restyled to match `sample-screen/dashboard.png`/`dashboard_2.png`: navy top bar, white icon sidebar, `#eef0f6` content area, white cards.

- Phase 0: Vite + React 19 + strict TypeScript scaffold; design tokens, global shell with synthetic/simulated notices, routing, error boundary, Zod domain schemas, fixture manifest, canonical opening state, Zustand+immer demo store with schema-versioned localStorage, safe hydration and canonical deep-clone reset.
- Phase 1: Investigation Queue (simulated iPRS label, KPIs), iPRS fixture adapter, AI Report Reader with staged 3–5s skippable analysis, evidence viewer (scan SVG, narrative lines, WhatsApp/call transcripts, CSV, promo image), 18 extracted facts with provenance, 5 victim transactions, 9 timeline events, seeded error FACT-0471-06 (`DEMO-MY-24108`), ambiguous FACT-0471-15, confirm/correct/reject/flag actions, CCIS gate with per-condition explanation, missing information (3 gaps) and 1 contradiction.
- Phase 2: CCIS fixture adapter (3 historical records, 3 exact links, 1 similarity link 0.83 with components), progressive enrichment after explicit action, React Flow Activity/Relationship/Money modes with precomputed layouts, solid/dashed edge semantics, provenance inspector, source filter, legend, accessible table equivalents, money reconciliation RM82,500 / RM79,000 / RM3,500.
- Phase 3: Illustrative 8-stage workflow with officer-controlled statuses, evidence gaps and suggested verification actions; minute adapter generating all 12 cited sections; edit, single-section regeneration (new version), comments, version compare, status flow, stale-section detection via review-state hash, demo export download (pre-generated file).
- Phase 4: Presentation Mode (7 steps, prompts, jump, keyboard, progress), integration/target-architecture/limitations view, separate simulated audit view, BM/English toggle, recovery notice for invalid saved state, README with commands and demo script.
- Tests: 27 unit tests (fixture integrity, synthetic-identifier scan, reconciliation, gate, rejected/corrected propagation, minute citation coverage, regeneration isolation, store reset/persistence) and 2 Playwright e2e (full guided flow offline; invalid saved-state recovery).

## In progress

- None.

## Next actions

1. Stakeholder walkthrough of the 12-minute guided flow on the production build.
2. Optional P1: pre-generated real PDF/DOCX exports (currently a validated placeholder text export), full BM minute content, executive summary view.
3. Obtain approved Minit Kertas Siasatan template and JSJK workflow before any POC.
4. Confirm iPRS and CCIS technical interfaces before any production-shaped POC.

## Blockers and risks

- No blocker for the React-only mock demonstration.
- Export files are validated placeholders (`illustrative-minute.txt`); real PDF/DOCX generation deferred (SDS permits validated pre-generated files).
- Official minute format, approval chain, real iPRS/CCIS APIs and PDRM security requirements remain unconfirmed.

## Decisions and deviations

- Login is a presentational simulation (sessionStorage flag, any credentials pass) with an explicit on-screen notice; SDS v1.3 excludes real authentication. No auth logic, users or credentials exist.
- Fixtures implemented as typed TypeScript modules under `src/fixtures/` (validated by Zod at adapter boundary) instead of raw JSON imports; equivalent structure, stronger typing. SDS §12 permits equivalent structure.
- Export demo file is `illustrative-minute.txt`; PDF/DOCX labelled as pre-generated demo export pending real generated files.
- HashRouter used so the static build works from any static host without server rewrites.
- Downstream account `DEMO-MY-99820` carries entity id `ACCT-99820` in transaction records (not a CaseFact; it is a downstream record only).

## Validation status

- Passed: `tsc -b` (strict), oxlint, 27 Vitest unit tests, 2 Playwright e2e (offline, network blocked), production build, bundled-asset availability check (report scan, transcripts, export file all HTTP 200 from `vite preview`), fixture integrity and synthetic-identifier scans, transaction reconciliation, minute citation coverage.
- Pending: stakeholder walkthrough, visual regression snapshots, real PDF/DOCX export validation, formal accessibility audit.
- Failed: None.

## Environment notes

- Node 24, npm 11. `npm install` then `npm run check` for all gates; `npm run test:e2e` requires `npx playwright install chromium` (already installed).
- No backend, database, Redis, Docker or external services required or permitted.
