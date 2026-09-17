# CHANGELOGS

## Unreleased

### Added

- Simulated login screen styled on `sample-screen/login.png`: full-page brand-navy background, centred white card, officer ID and password fields, full-width submit, explicit "simulated sign-in, no real authentication" notice. Session gate via `sessionStorage`; log-out returns to login.
- Dashboard shell restyled on `sample-screen/dashboard.png` / `dashboard_2.png`: brand-navy (`#010044`) top bar with product badges and actions, white left sidebar navigation with icons, light `#eef0f6` content background, white content cards. Responsive collapsed sidebar below 1100 px.

### Changed

- Shell navigation moved from top-bar links to a sidebar; language, presentation, reset and log-out actions consolidated in the top bar.
- E2E guided flow now signs in through the simulated login screen first.

### Added (initial build)

- Complete JSJK Nexus v1.3 mock capability demonstration: React 19 + strict TypeScript + Vite application implementing Phases 0–4 of SDS v1.3.
- Investigation Queue with simulated iPRS intake, KPIs and synthetic-data notices.
- AI Report Reader with staged skippable analysis, evidence viewer (report scan, narrative, WhatsApp and call transcripts, transaction CSV, promo image), 18 provenance-carrying facts, confirm/correct/reject/flag review, seeded incorrect extraction (`DEMO-MY-24108`), ambiguous `77105` item, and explained CCIS review gate.
- Simulated CCIS cross-reference adapter: three historical records, three exact identifier links, one qualified analytical-similarity link (0.83 with component scores).
- Case Intelligence Trail with React Flow Activity, Relationship and Money modes, precomputed layouts, solid/dashed edge semantics, provenance inspector, filters, legends and accessible table equivalents; money reconciliation RM82,500 / RM79,000 / RM3,500 unresolved.
- Financial-scam workflow (8 officer-controlled stages), evidence gaps, contradiction and suggested verification actions.
- Cited illustrative Minit Kertas Siasatan: 12 sections, generation from reviewed state, section editing, single-section regeneration with versioning, comments, version comparison, status flow, stale-section detection and demo export download.
- Presentation Mode (7 guided steps with prompts, jump and keyboard controls), integration/target-architecture/limitations view, and separate simulated system audit view.
- Synthetic evidence pack under `public/demo-assets/`, fixture manifest, Zod schemas, deterministic typed adapters, schema-versioned localStorage with safe hydration and canonical reset.
- 27 unit tests and 2 offline Playwright e2e tests; documented npm commands in README.

### Changed

- Made SDS v1.3 the canonical implementation specification for the first showcase while retaining SDS v1.2 as the future POC and target-architecture reference.

---

## Previous entries (SDS authoring session)

### Added

- SDS v1.3 Mock Capability Demonstration Profile for a standalone React and TypeScript showcase.
- Capability-versus-claim matrix covering simulated iPRS, CCIS, OCR, AI, similarity, Money Trail, minute drafting, audit and target security architecture.
- Typed deterministic adapter boundaries, versioned browser state, fixture manifest and canonical reset requirements.
- Explicit offline runtime, saved-state validation, precomputed graph layout and prepared-state presentation requirements.
- React-only repository structure, four implementation phases, 55 functional requirements, 22 non-functional requirements and 30 definition-of-done criteria.
- Browser-audit qualification and React-runtime versus target-architecture notices.

### Changed

- Made SDS v1.3 the canonical implementation specification for the first showcase while retaining SDS v1.2 as the future POC and target-architecture reference.
- Replaced Laravel, Docker Compose, PostgreSQL with pgvector, Redis, object storage, workers, live OCR and live AI requirements with static validated fixtures, deterministic adapters and browser state.
- Changed persistence, minute versioning and audit acceptance criteria from durable server records to clearly qualified demonstration-session behaviour.
- Changed export guidance to prefer validated pre-generated DOCX and PDF files unless browser generation proves reliable.
- Updated `AGENT.md`, build priorities, verification gates and definition of done for the React-only profile.

### Removed

- Backend API, database migration, queue, object-storage, container-health and live-model requirements from the first-showcase implementation profile.
- Non-functional Live AI toggle from the v1.3 user interface.

### Security

- Added mandatory notices that precomputed AI and OCR output is not measured accuracy, browser audit is not durable or evidentiary and the proposed on-premise security architecture is not implemented by v1.3.
- Prohibited remote runtime APIs, analytics, fonts, assets, credentials and real identifiers in the formal demonstration.
