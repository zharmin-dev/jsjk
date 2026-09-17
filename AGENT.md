# AGENT.md

## 1. Purpose

This file is the persistent operating context for every AI coding agent working on JSJK Nexus. Read it before planning, coding, reviewing, testing, or modifying the project.

Do not rely on chat history as project memory. The repository documents are the durable memory. Reconstruct the current context from them at the start of every session and update them before ending a session.

## 2. Mandatory session protocol

### At the start of every new session

Follow this order before making changes:

1. Read `AGENT.md` in full.
2. Read `PROGRESS.md` in full to understand what is complete, what is in progress, what is blocked, and what should happen next.
3. Read the relevant sections of `JSJK_Nexus_Solution_Design_Specification.md`.
4. Read the latest entries in `CHANGELOGS.md`.
5. Inspect the repository structure, current branch, uncommitted changes, recent commits, tests, and running Docker Compose services.
6. Identify the user request, affected requirements, acceptance criteria, dependencies, risks, and unresolved decisions.
7. Confirm that the proposed work does not conflict with this file, the SDS, or completed work recorded in `PROGRESS.md`.

If `PROGRESS.md` or `CHANGELOGS.md` does not exist, create it before implementation using the structures defined in this file.

Do not start coding from assumptions when the repository or progress records can answer the question.

### During the session

- Keep the full JSJK Nexus objective and demonstration story in scope.
- Treat `PROGRESS.md` as the live delivery record, not as a retrospective summary.
- Update `PROGRESS.md` when a milestone, blocker, decision, or next action changes materially.
- Preserve existing user changes and inspect the working tree before editing overlapping files.
- Trace material work to an SDS requirement, acceptance criterion, issue, or explicit user instruction.
- Do not silently change product scope, architecture, contracts, fixture values, safeguards, or established terminology.
- Record material technical decisions and deviations from the SDS.
- Ask for clarification when a missing decision would materially change behaviour, security, data handling, or architecture.

### Before ending the session

1. Run the relevant validation and tests.
2. Update `CHANGELOGS.md` with all material changes made during the session.
3. Update `PROGRESS.md` so the next agent can continue without relying on chat history.
4. Record incomplete work, blockers, failed tests, known defects, and the next concrete actions.
5. Confirm that documentation matches the implementation.
6. Report what changed, what was tested, what remains, and any risk or deviation.

A coding session is not complete until both `CHANGELOGS.md` and `PROGRESS.md` accurately reflect the repository state.

## 3. Project context

- Product name: JSJK Nexus
- Product type: AI-assisted commercial crime investigation prototype
- Intended organisation: Jabatan Siasatan Jenayah Komersil, Polis Diraja Malaysia
- Primary audience: mixed executive and operational stakeholders
- Showcase duration: 10 to 15 minutes, with a target guided flow of 12 minutes
- Prototype data: public contextual information and fully synthetic case data only
- Canonical solution design: `JSJK_Nexus_Solution_Design_Specification.md`
- Backend framework: Laravel
- Frontend framework: React with TypeScript
- Runtime and development environment: Docker Compose
- Primary database: PostgreSQL with the pgvector extension
- Cache and asynchronous processing: Redis

## 4. Core product decision

Build an investigator-facing case-intelligence prototype. It is not:

- A public scam chatbot.
- An autonomous investigation system.
- A guilt, identity, intent, or criminal-risk determination tool.
- A production case-management platform.
- A replacement for the National Fraud Portal.
- A live banking or fund-freezing system.

The prototype must demonstrate how AI can help investigators:

1. Turn scattered evidence into structured case information.
2. Extract entities, transactions, tactics, and timeline events with source references.
3. Reveal exact identifier matches and analytical similarities across cases.
4. Visualise relationships and illustrative fund flow.
5. Produce an evidence-grounded investigation brief for human review.

## 5. Featured demonstration story

The primary synthetic scenario is Operation Sinar Emas, centred on case `JSJK-DEMO-2026-0471`, a non-existent investment scam report. The featured case links to three synthetic historical cases through shared account identifiers, phone numbers, domains, campaign tactics, and script similarity.

The guided story is:

1. Establish the commercial-crime context.
2. Open the featured report and its evidence.
3. Run staged AI-assisted analysis.
4. Review and confirm extracted information.
5. Reveal linked cases and supporting evidence.
6. Follow the illustrative fund flow.
7. Generate and inspect a cited investigation brief.
8. Close with safeguards and pilot questions.

Every P0 implementation decision must support this story and keep it reliable within the presentation time.

## 6. Source-of-truth order

Use this precedence when instructions conflict:

1. The user's latest explicit instruction.
2. `AGENT.md`.
3. `JSJK_Nexus_Solution_Design_Specification.md`.
4. Decisions and current state recorded in `PROGRESS.md`.
5. Existing tests and repository documentation.
6. Existing implementation details.

This file intentionally overrides earlier SDS technology recommendations where they conflict with the required Laravel, React, Docker Compose, PostgreSQL, pgvector, or Redis architecture. Preserve the SDS product requirements and safety controls while implementing them with the stack defined here.

Do not treat an implementation defect or outdated document as authority over a higher-priority source.

## 7. Required application architecture

### Backend

- Use Laravel as the backend application framework and authoritative API layer.
- Keep controllers thin. Put domain behaviour in services, actions, jobs, policies, or dedicated domain classes.
- Validate all external input using Laravel form requests or equivalent explicit validators.
- Use API resources or typed response objects to keep response contracts stable.
- Use Laravel migrations and seeders for all database structure and deterministic demo data.
- Use queues for work that should not block a request, including optional AI analysis, embedding generation, and document processing.
- Keep model-provider credentials and privileged operations on the server.

### Frontend

- Use React with TypeScript for the frontend.
- Keep domain types explicit and align them with Laravel API contracts.
- Use a predictable API client layer. Components must not call model providers or databases directly.
- Use accessible semantic HTML, keyboard-operable controls, visible focus, reduced-motion support, and text alternatives for graphs and charts.
- Keep application state as local as possible. Use a larger state library only when the workflow demonstrates a real need.
- Use the project-selected build tool and lockfile. Do not replace working frontend tooling without a documented reason.

### API boundary

- Laravel owns validation, authorisation, persistence, AI orchestration, audit records, and server-side business rules.
- React owns presentation, user interaction, client-side workflow state, and visualisation.
- Define versioned, testable JSON contracts between Laravel and React.
- Validate AI output before persistence or presentation.
- Keep fixture and live-AI responses compatible with the same contracts.

## 8. Docker Compose environment

The project must run through Docker Compose. A new contributor should need Docker and Docker Compose, not a manually installed PHP, Node.js, PostgreSQL, or Redis environment.

The Compose environment should include, as required by the implementation:

- Laravel application or PHP-FPM service.
- Web server or reverse proxy, such as Nginx, when required.
- React build or development service.
- PostgreSQL with the pgvector extension enabled.
- Redis.
- Laravel queue worker.
- Laravel scheduler process when scheduled jobs exist.
- Optional local mail or object-storage emulator only when a requirement justifies it.

Docker rules:

- Pin image versions. Do not use unbounded `latest` tags.
- Add health checks for application dependencies.
- Use named volumes for persistent development data.
- Keep secrets out of images, Compose files, source control, logs, and frontend bundles.
- Commit a safe `.env.example`; never commit a populated `.env`.
- Make service startup resilient to dependency readiness.
- Provide documented Compose commands for build, start, stop, migrate, seed, test, queue, and log inspection.
- Run project commands inside the appropriate container unless the repository explicitly documents another route.
- Ensure the formal fixture demonstration works without internet access once images and dependencies are available locally.

## 9. PostgreSQL, pgvector, and Redis rules

### PostgreSQL

- PostgreSQL is the primary durable data store.
- Manage schema changes only through Laravel migrations.
- Use foreign keys, indexes, constraints, and transactions where they protect integrity.
- Seed only synthetic demonstration data.
- Avoid embedding business logic in ad hoc SQL when it belongs in tested application code.

### pgvector

- Enable pgvector through a migration or documented database bootstrap step.
- Store embeddings only when a defined retrieval or similarity requirement uses them.
- Record the embedding model, vector dimension, source content reference, and generation status.
- Do not mix embeddings from incompatible models in the same similarity index without an explicit migration strategy.
- Treat vector similarity as an investigative retrieval aid, not proof of identity, authorship, control, or guilt.
- Keep exact identifier matching separate from vector or semantic similarity.
- Provide deterministic fixture similarity results for the formal showcase, even when live embedding generation is unavailable.

### Redis

- Use Redis for cache, queues, rate limiting, locks, and short-lived coordination where appropriate.
- Do not use Redis as the sole durable store for case evidence, decisions, or audit history.
- Namespace keys and set expiration for temporary data.
- Make queued jobs idempotent where retries are possible.
- Define retry, timeout, and failure behaviour for AI-related jobs.

## 10. Mandatory fixture and demo behaviour

- Fixture mode is mandatory and is the default formal-showcase mode.
- Fixture mode may use the local Docker Compose services but must not require internet access or an external AI provider.
- The fixture dataset and expected analysis results must be deterministic.
- Live AI is optional and must use the same validated contracts as fixture mode.
- A live-model timeout, invalid response, or service error must fail safely and offer deterministic fixture output.
- A reset action must restore the known opening state.
- Every screen and exported brief must display a synthetic-data notice.
- Do not require a real banking, police, identity, or external case-management integration.
- Do not introduce distributed infrastructure beyond what the prototype needs.

## 11. Responsible AI boundaries

The system may assist with classification, extraction, normalisation, timeline construction, similarity analysis, link discovery, retrieval, and evidence-grounded drafting.

The system must not:

- Determine guilt, identity, intent, or criminal risk.
- Recommend arrest, prosecution, surveillance, or account freezing.
- Invent identifiers, transactions, dates, evidence, sources, or relationships.
- Present similarity as proof of common authorship, control, identity, or syndicate membership.
- Conceal uncertainty, evidence gaps, contradictions, rejected extractions, or model failures.
- Describe an analytical reconstruction as live bank tracing.

Use cautious language such as `reported`, `extracted`, `appears in supplied records`, `analytical similarity`, and `requires verification`.

## 12. Synthetic-data rules

- All cases, people, aliases, accounts, phone numbers, domains, messages, evidence, and transactions must be synthetic.
- Every case and artifact must include `synthetic: true` or the equivalent enforced domain field.
- Synthetic bank accounts must begin with `DEMO-MY-`.
- Synthetic phone numbers must match `010-000-XXXX`.
- Synthetic domains must use the reserved `.example` domain.
- The featured case identifier is `JSJK-DEMO-2026-0471`.
- Featured victim-to-beneficiary transactions total RM82,500.
- Supplied records account for RM79,000, with RM3,500 explicitly marked unmatched or unresolved.
- Do not replace fixture identifiers or totals without updating every dependent seed, fixture, test, screen, graph, and brief citation.
- Add automated scans that reject real-looking or non-compliant identifiers in fixture content.

## 13. Evidence and explainability rules

- Every extracted entity and event must include an artifact ID and source location.
- Every material factual claim in a generated brief must cite one or more evidence references.
- Separate reported facts, analytical assessments, cross-case indicators, evidence gaps, contradictions, and suggested verification actions.
- Show exact identifier matches separately from semantic or vector similarity.
- Similarity scores are retrieval aids, not probabilities of identity or common authorship.
- Confidence describes extraction certainty, not whether the information is true.
- Users must be able to confirm, edit, reject, or flag extracted information.
- Rejected output must remain visible in the audit history.
- Preserve source text and model output lineage required to reproduce or review a result.

## 14. Required project records

### `PROGRESS.md`

`PROGRESS.md` is the handoff document between sessions and agents. Keep it concise, factual, and current. Do not use it as a diary.

It must contain:

```markdown
# PROGRESS

Last updated: YYYY-MM-DD HH:MM timezone
Current milestone: <name>
Overall status: Not started | In progress | Blocked | Ready for review | Complete

## Completed
- <completed outcome with relevant file, requirement, or commit reference>

## In progress
- <current work and exact state>

## Next actions
1. <next concrete action>
2. <following action>

## Blockers and risks
- <blocker, owner, and required resolution, or None>

## Decisions and deviations
- <decision, rationale, and affected SDS requirement>

## Validation status
- Passed: <checks>
- Pending: <checks>
- Failed: <checks and reason>

## Environment notes
- <migration, seed, service, configuration, or command needed by the next agent>
```

Update it whenever completed work, current work, next actions, blockers, decisions, validation status, or environment requirements change. Remove stale statements instead of accumulating contradictory status.

### `CHANGELOGS.md`

`CHANGELOGS.md` is the chronological record of material project changes. Use reverse chronological order and keep an `Unreleased` section at the top.

Use these headings when applicable:

- Added
- Changed
- Fixed
- Removed
- Security
- Deprecated

Each entry must state the observable change and affected area. Avoid vague entries such as `updated code` or `miscellaneous fixes`. Do not include investigation notes, plans, or unchanged files.

At the end of every session that changes code, configuration, schema, seed data, infrastructure, behaviour, tests, or user-facing documentation:

1. Add or revise the relevant `Unreleased` entries.
2. Ensure the entries match the actual diff.
3. Update `PROGRESS.md` separately with delivery state and next actions.

Do not duplicate the same content mechanically across both files. `CHANGELOGS.md` explains what changed. `PROGRESS.md` explains where the project stands and what happens next.

## 15. Skill-use protocol

Use relevant AI-agent skills when the active environment provides them.

At the start of a task:

1. Inspect the available skill catalogue or repository skill instructions.
2. Select the smallest set of skills that directly matches the work.
3. Read each selected skill's full instruction file before acting.
4. Follow referenced procedures, scripts, templates, validation steps, and storage rules.
5. Apply skills only within the user's authorised scope.

Relevant skill categories may include Laravel or PHP development, React or TypeScript development, Docker, PostgreSQL, security review, testing, accessibility, UI design, documentation, and AI integration.

Rules:

- Do not claim to have used a skill that is unavailable.
- Do not invent skill names, paths, commands, or capabilities.
- A skill does not override the user, `AGENT.md`, or the SDS.
- If no suitable skill exists, proceed using repository conventions and established engineering practice.
- Record any skill-driven material architecture or workflow decision in `PROGRESS.md`.

## 16. Build priorities

Implement in this order unless the user directs otherwise:

1. Docker Compose environment and health checks.
2. Laravel and React project shells.
3. PostgreSQL schema, pgvector enablement, Redis connectivity, migrations, and deterministic seed data.
4. Core case, artifact, entity, event, link, transaction, embedding, and brief contracts.
5. Command Centre and featured-case navigation.
6. Evidence review and staged analysis.
7. Link-analysis graph with an accessible relationship-table alternative.
8. Fund-flow and timeline views.
9. Evidence-grounded brief generation and citation drill-down.
10. Guided presentation mode, reset behaviour, and backup controls.
11. Automated tests, fixture scans, accessibility checks, and documentation.
12. Optional live-AI adapters only after fixture mode is complete and reliable.

P0 requirements in the SDS take precedence over visual polish and P1 or P2 enhancements.

## 17. Engineering expectations

- Prefer clear domain boundaries over large controllers or components.
- Keep Laravel, React, and AI-provider concerns separated behind interfaces.
- Use strict TypeScript settings and the project's PHP static-analysis standard.
- Use runtime validation at system and AI-output boundaries.
- Add dependencies only when they solve a defined requirement and have a justified maintenance cost.
- Prefer framework conventions over custom abstractions without evidence of need.
- Keep migrations reversible where practical and never edit an applied shared migration to hide a new change.
- Design queue jobs for retry safety and observable failure.
- Add structured logs without evidence content, secrets, or sensitive payloads.
- Keep the interface credible and restrained. Avoid decorative AI effects that weaken operational trust.
- Record significant architectural decisions in the repository documentation.

## 18. Verification requirements

Run the narrowest relevant checks first, followed by the broader suite when practical.

Backend checks should include, as relevant:

- Laravel formatting and linting.
- PHP static analysis.
- Unit and feature tests.
- Migration and seeder execution against a clean PostgreSQL database.
- Queue-job success, retry, timeout, and failure behaviour.
- API contract and authorisation tests.

Frontend checks should include, as relevant:

- TypeScript type checking.
- Linting and formatting.
- Unit and component tests.
- Production build.
- Accessibility checks.
- End-to-end tests for affected P0 paths.

Environment and content checks should include, as relevant:

- Docker Compose configuration validation.
- Container health and dependency readiness.
- PostgreSQL, pgvector, and Redis connectivity.
- Deterministic migration and seed process.
- Fixture integrity for identifier patterns, totals, source references, and synthetic flags.
- Secret scanning and confirmation that no real identifiers appear in source, fixtures, screenshots, logs, or generated output.
- A complete offline fixture-mode demonstration.

Never claim completion when relevant tests were skipped or failed. Record passed, pending, and failed validation in `PROGRESS.md`.

## 19. Change discipline

- Make the smallest coherent change that satisfies the requirement.
- Preserve unrelated user changes and avoid destructive repository operations.
- Do not rewrite working architecture solely to match personal preference.
- Do not add services or infrastructure without a defined requirement.
- Keep public-context claims separate from synthetic demonstration metrics.
- Do not imply that a prototype capability already exists in JSJK operations.
- Do not use real case data for development, testing, screenshots, or demonstrations.
- If the user requests production deployment, real data, or external integration, stop and surface the required security, privacy, legal, governance, and operational decisions.

## 20. Definition of done

A task is complete only when:

1. The requested behaviour is implemented and demonstrable.
2. Relevant SDS acceptance criteria are satisfied.
3. The Laravel and React boundaries remain clear and tested.
4. The Docker Compose environment supports the change.
5. Fixture mode remains deterministic and independent of external internet services.
6. Safety, privacy, evidence traceability, and human review remain intact.
7. Relevant tests pass, or failures are explicitly reported and recorded.
8. `CHANGELOGS.md` accurately records the material change.
9. `PROGRESS.md` accurately records completed work, current status, next actions, blockers, decisions, and validation.
10. Material deviations and setup changes are documented.
11. The final handoff states the result, verification performed, remaining work, and known limitations with precision.
