# JSJK Nexus — Mock Capability Demonstration (SDS v1.3)

Standalone React + strict TypeScript capability demonstration for JSJK (PDRM commercial crime).
Fully synthetic data. No backend, database, Docker, live OCR, live AI or real iPRS/CCIS integration.
The production build runs with network access disabled.

## Requirements

- Node.js 20+ and npm.
- For e2e tests: Playwright Chromium (`npx playwright install chromium`).

## Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Development server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit + component tests (Vitest) |
| `npm run test:e2e` | Playwright end-to-end flow (offline, production preview) |
| `npm run lint` | Oxlint |
| `npm run typecheck` | Strict TypeScript check |
| `npm run check` | typecheck + lint + unit tests + build |

## Guided demonstration (target 12 minutes)

1. `npm run build && npm run preview`
2. Open the printed local URL. Click **Mod Persembahan / Presentation Mode**.
3. Follow the 7 numbered steps with Next/Back/Jump controls. Arrow keys also work.
4. Reset any time with **Reset Demo** (top right) to restore the canonical opening state.

Prepared-state notes:

- **Report Review**: run analysis (Skip available), reject the seeded wrong account
  (`DEMO-MY-24108`, source says `DEMO-MY-24018`), flag the ambiguous `77105` item,
  confirm the loss and one phone/domain fact — the **Cross-reference with CCIS** gate opens.
- **Case Intelligence**: Activity / Relationship / Money modes. Relationship shows CCIS
  records only after the explicit cross-reference action. Table equivalent available on every mode.
- **Money**: reconciles RM82,500 reported, RM79,000 accounted, RM3,500 unresolved.
- **Minute**: generate, edit, regenerate one section (creates a new version), compare versions,
  change status, download the demo export file.

## Architecture

```
src/
  domain/       contracts.ts, schemas.ts (Zod), selectors.ts (gate, reconciliation, similarity)
  fixtures/     manifest.json + typed TS fixtures (iprs, ccis, analysis, graph, workflow, audit)
  services/     adapters/ (typed, deterministic, validated) + delay.ts + state-hash.ts
  state/        demo-store.ts (Zustand + immer, schema-versioned localStorage, canonical reset)
  components/   shell, queue, report-reader, case-intelligence, workflow, minute, architecture, presentation
public/demo-assets/   synthetic evidence pack + demo export file
e2e/                  Playwright guided flow (network blocked)
```

Rules enforced by tests:

- All identifiers synthetic: phones `010-000-XXXX`, accounts `DEMO-MY-*`, domains `.example`.
- Fixture counts, totals and IDs validated against `src/fixtures/manifest.json`.
- Rejected facts leave active graphs and minute content; needs-verification items appear only as indicators.
- Saved state is validated on load; invalid or stale state resets to canonical with a notice.

## Claim boundaries

- AI/OCR output is precomputed; no accuracy is measured or implied.
- Audit trail is a browser-session simulation — not durable, immutable or evidentiary.
- The Minit Kertas Siasatan is an illustrative format, subject to JSJK validation.
- The on-premise architecture shown is a proposed target design, not implemented.
