# JSJK Nexus Prototype: AI Coding Agent Build Prompt

You are the lead implementation agent for the JSJK Nexus prototype.

Start building the application now. Do not stop after producing a plan.

## Mandatory Context Review

Before changing code:

1. Read `AGENT.md` completely.
2. Read `PROGRESS.md` completely.
3. Read the latest entries in `CHANGELOGS.md`.
4. Read `JSJK_Nexus_Solution_Design_Specification_v1.3.md`, especially:
   - Scope and implementation profile
   - Demonstration scenario
   - End-to-end workflow
   - Screens and information architecture
   - Prototype architecture
   - Data contracts
   - Functional and non-functional requirements
   - Testing strategy
   - Acceptance criteria
   - Implementation plan
   - Coding-agent execution rules
5. Inspect the repository, existing code, installed dependencies, tests, and uncommitted changes.
6. Use relevant available AI coding skills where they directly support the work.

Treat SDS v1.3 as the authoritative implementation specification. SDS v1.2 is only a future POC and target-architecture reference.

## Objective

Build a polished, deterministic, standalone capability demonstration showing how JSJK Nexus can:

1. Receive a synthetic police report through simulated iPRS.
2. Display precomputed OCR and AI analysis.
3. Let an officer confirm, correct, reject, or flag extracted facts.
4. Cross-reference reviewed facts using a separate simulated CCIS adapter.
5. Visualise Activity, Relationship, and Money trails using React Flow.
6. Show evidence and source provenance for every material finding.
7. Support an illustrative financial-scam investigation workflow.
8. Generate, edit, version, and review a cited draft Minit Kertas Siasatan.
9. Show a separate simulated audit trail.
10. Explain the proposed production integration, security, and on-premise architecture without claiming these are implemented.

The complete guided demonstration must run reliably within 12 minutes.

## Binding Implementation Profile

Use:

- React
- Strict TypeScript
- Vite
- `@xyflow/react`
- Static, validated synthetic fixtures
- Zod or an equivalent runtime validation library
- Deterministic typed service adapters
- In-memory browser state
- Optional schema-versioned `localStorage`
- Precomputed graph layouts
- Vitest
- React Testing Library
- Playwright
- Local bundled assets
- Documented npm commands

Do not add:

- Laravel or another backend
- Docker or Docker Compose
- PostgreSQL, pgvector, or any database
- Redis, queues, or workers
- Object storage
- Live OCR
- Live AI models or embeddings
- Real iPRS or CCIS connections
- Authentication services
- Runtime analytics
- Remote fonts, assets, or APIs required by the formal demo
- A non-functional “Live AI” toggle

The production build must work with network access disabled.

## Required Scenario

Use the Operation Sinar Emas fixture exactly as specified:

- Case: `JSJK-DEMO-2026-0471`
- iPRS report: `IPRS-DEMO-2026-008721`
- Scam type: Non-existent investment scam
- Campaign: Quantum Crest Capital
- Reported loss: RM82,500
- Accounted amount: RM79,000
- Unresolved amount: RM3,500
- Primary account: `DEMO-MY-24018`
- Primary phone: `010-000-7712`
- Domain: `quantum-crest.example`
- Tracking reference: `ref=QC7712`

Preserve every canonical identifier, record count, transaction total, and fixture relationship. Do not silently substitute values.

All data must remain visibly synthetic. Do not introduce realistic personal identifiers, real phone numbers, real bank accounts, or real domains.

## Build Sequence

Implement the phases in SDS v1.3 order.

### Phase 0: Foundation

If the application has not been initialized:

1. Create the React, Vite, and strict TypeScript application.
2. Establish the repository structure described in SDS v1.3.
3. Add routing, the global shell, design tokens, error handling, and test harness.
4. Define domain contracts and runtime schemas.
5. Create the fixture manifest and canonical opening state.
6. Implement fixture validation.
7. Implement the central demo store, safe hydration, and canonical reset.
8. Add visible synthetic-data and simulated-service notices.
9. Add foundational unit tests.
10. Confirm type checking, tests, and the production build pass.

Phase 0 is complete only when the production build loads the application shell and validates the opening fixtures.

### Phase 1: iPRS Queue and Report Review

Implement:

- Investigation Queue
- Separate typed iPRS fixture adapter
- AI Report Reader
- Evidence viewer with source locators
- Staged deterministic analysis
- At least 15 extracted facts or entities
- Five victim transactions
- At least eight chronological events
- Fact confirmation, correction, rejection, and flagging
- One seeded incorrect extraction
- One deliberately ambiguous item
- CCIS eligibility gate
- Provenance inspection
- Tests for review actions, evidence links, and gate behaviour

Rejected facts must leave active graphs and factual minute content while remaining visible in the simulated audit history.

### Phase 2: CCIS Enrichment and Case Intelligence Trail

Implement:

- Separate typed CCIS fixture adapter
- Explicit “Cross-reference with CCIS” action
- Progressive CCIS enrichment
- Activity Trail
- Relationship Map
- Money Trail
- React Flow custom nodes and edges
- Precomputed deterministic layouts
- Evidence and provenance side panel
- Filters and legends
- Accessible table equivalents for all three graph modes
- Solid evidence-backed connections
- Dashed analytical or unverified connections
- Transaction direction and amounts
- Similarity indicators before exact identifier corroboration
- Money reconciliation showing RM82,500 reported, RM79,000 accounted, and RM3,500 unresolved

Do not present similarity as proof of identity, authorship, common control, or criminal involvement.

### Phase 3: Workflow and Investigation Minute

Implement:

- Illustrative financial-scam investigation workflow
- Evidence gaps and contradictions
- Suggested verification actions
- Draft Minit Kertas Siasatan generation
- Evidence citations for material factual paragraphs
- Clear separation of facts, indicators, gaps, and proposed actions
- Section editing
- Officer comments
- Single-section regeneration
- Version creation and comparison
- Draft, under-review, and approved demonstration statuses
- Stale-section handling after source changes
- Validated pre-generated PDF and DOCX exports if browser generation is unreliable

The minute must always be labelled as illustrative and subject to JSJK validation. Never automate its approval.

### Phase 4: Presentation and QA

Implement:

- Guided Presentation Mode
- Step prompts, navigation, and skip controls
- Simulated integration view for iPRS and CCIS
- Separate system audit trail
- Prototype limitations
- Proposed PDRM-controlled on-premise target architecture
- Clear distinction between implemented prototype controls and proposed production controls
- Accessibility improvements
- Content-validation scans
- Offline end-to-end testing
- README instructions for installation, testing, building, previewing, and resetting the demo

## Required Design Behaviour

The interface should look credible for JSJK leadership and investigating officers. Prioritise clarity, traceability, and presentation reliability over decorative complexity.

Every material fact, graph node, graph edge, and minute statement must expose:

- Source system
- Source record ID
- Evidence artifact
- Source locator or excerpt
- Verification status
- Match or derivation method where relevant

Use the graph semantics defined in SDS v1.3. Colour must never be the only status indicator. Do not use red to imply a person is guilty or criminal.

Case activity and system audit activity are separate concepts and must appear in separate views.

## Responsible AI Rules

The prototype may demonstrate extraction, classification, chronology, matching, similarity, missing-information detection, and drafting.

It must not:

- Determine guilt, intent, identity, or criminal risk
- Recommend arrest, prosecution, surveillance, or account freezing
- Invent evidence or relationships
- Hide uncertainty or contradictions
- Treat processing completion as investigation completion
- Write to iPRS, CCIS, or another external system
- Claim measured AI, OCR, security, integration, or operational performance

Use wording such as:

- “Reported”
- “Appears in supplied synthetic records”
- “Analytical indicator”
- “Requires officer verification”
- “Suggested verification action”

## Engineering Expectations

- Keep components behind typed service interfaces.
- Do not import raw fixture files directly into presentation components.
- Validate all fixture and restored browser-state payloads.
- Deep-clone the canonical state during reset.
- Keep animations, loading delays, and graph layouts deterministic.
- Add tests alongside each capability.
- Preserve unrelated existing changes.
- Do not change the agreed architecture or scenario without recording the deviation and explaining why.
- Make reasonable implementation decisions independently when they do not alter scope, safety, architecture, or fixture truth.
- If a missing decision materially affects those areas, stop and ask one focused question.

## Validation Gates

Before reporting completion of any phase, run all relevant checks:

- Type checking
- Linting
- Unit tests
- Component tests
- End-to-end tests when available
- Production build
- Fixture integrity checks
- Synthetic-identifier scans
- Transaction reconciliation
- Evidence-reference integrity
- Offline runtime verification

Do not claim a check passed unless it was executed successfully. Record skipped or failed checks.

## Project Memory Protocol

Before ending every session that changes the repository:

1. Update `CHANGELOGS.md` with observable changes.
2. Update `PROGRESS.md` with:
   - Completed work
   - Current implementation state
   - Next actions
   - Blockers and risks
   - Decisions and deviations
   - Tests and validation performed
3. Confirm the documentation reflects the actual code.
4. Summarise what was built, which files changed, which checks passed, and what remains.

Begin with Phase 0. Continue into subsequent P0 work when the foundation is sound and no material blocker exists. Do not stop merely to request approval for routine implementation choices.
