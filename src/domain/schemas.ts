// Zod runtime schemas mirroring contracts.ts. Validate fixtures + saved state.
import { z } from "zod";

export const schemaVersion = z.literal("1.3.0");

const reviewState = z.enum(["unreviewed", "confirmed", "rejected", "needs_verification"]);
const confidenceLevel = z.enum(["high", "medium", "low"]);
const sourceSystem = z.enum(["IPRS", "CCIS", "EVIDENCE", "AI_DERIVED", "OFFICER_ENTERED"]);
const evidenceStatus = z.enum(["reported", "supported", "confirmed_record", "inferred"]);
const graphView = z.enum(["activity", "relationship", "money"]);

const locator = z.object({
  kind: z.enum(["line", "message", "row", "region", "page"]),
  start: z.union([z.number(), z.string()]),
  end: z.union([z.number(), z.string()]).optional(),
});

const provenance = z.object({
  sourceSystem,
  sourceRecordId: z.string().min(1),
  sourceRevision: z.string().optional(),
  artifactId: z.string().optional(),
  importedAt: z.string(),
  locator: locator.optional(),
  extractionMethod: z.enum([
    "fixture_ocr",
    "structured_import",
    "text_extraction",
    "officer_entry",
    "precomputed_analysis",
  ]),
  originalValue: z.string().optional(),
});

const evidenceReference = z.object({
  id: z.string().min(1),
  artifactId: z.string().min(1),
  locator,
  excerpt: z.string().min(1),
});

const factType = z.enum([
  "person_alias",
  "phone",
  "bank_account",
  "url",
  "organisation",
  "amount",
  "date",
  "location",
  "transaction_reference",
  "modus_operandi",
]);

export const caseFactSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  factType,
  displayValue: z.string().min(1),
  normalisedValue: z.string().optional(),
  confidence: confidenceLevel,
  confidenceScore: z.number().min(0).max(1),
  reviewState,
  evidenceRefIds: z.array(z.string()),
  provenance,
  correctedValue: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
  reviewNote: z.string().optional(),
  demoSeededError: z.boolean().optional(),
});

export const transactionSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  occurredAt: z.string(),
  sourceLabel: z.string(),
  destinationAccountEntityId: z.string(),
  amountMYR: z.number().positive(),
  channel: z.string(),
  reference: z.string().optional(),
  evidenceRefIds: z.array(z.string()),
  evidenceStatus,
  provenance,
  synthetic: z.literal(true),
});

export const timelineEventSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  occurredAt: z.string(),
  eventType: z.enum(["contact", "instruction", "transfer", "claim", "report", "investigation"]),
  title: z.string().min(1),
  description: z.string(),
  evidenceRefIds: z.array(z.string()),
  confidence: confidenceLevel,
  reviewState,
  provenance,
});

const linkType = z.enum([
  "MENTIONED_IN",
  "USES",
  "CONTACTED_VIA",
  "TRANSFERRED_TO",
  "SUPPORTED_BY",
  "RELATED_CASE",
  "EXACT_MATCH",
  "SIMILAR_MO",
  "REQUIRES_VERIFICATION",
]);

export const relationshipEdgeSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  linkType,
  label: z.string(),
  score: z.number().optional(),
  evidenceRefIds: z.array(z.string()),
  assessment: z.enum(["fact", "analytical_indicator"]),
  rationale: z.string(),
  verificationState: reviewState,
  provenance: z.array(provenance),
  visibleIn: z.array(graphView),
});

export const graphNodeSchema = z.object({
  id: z.string().min(1),
  nodeType: z.enum([
    "police_report",
    "ccis_case",
    "person_alias",
    "phone",
    "bank_account",
    "transaction",
    "evidence",
    "organisation",
    "url_domain",
    "modus_operandi",
    "activity_event",
    "unresolved",
  ]),
  label: z.string().min(1),
  sublabel: z.string().optional(),
  sourceBadges: z.array(sourceSystem),
  verificationState: reviewState,
  evidenceRefIds: z.array(z.string()),
  rationale: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }),
});

export const graphPayloadSchema = z.object({
  caseId: z.string().min(1),
  view: graphView,
  nodes: z.array(graphNodeSchema),
  edges: z.array(relationshipEdgeSchema),
  generatedFromStateHash: z.string(),
});

export const workflowStepSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  stepType: z.enum([
    "report_received",
    "facts_reviewed",
    "ccis_cross_reference",
    "financial_trail_review",
    "evidence_requests",
    "investigation_actions",
    "minute_drafted",
    "supervisor_review",
  ]),
  status: z.enum(["not_started", "in_progress", "awaiting_information", "completed", "returned"]),
  ownerRole: z.string(),
  supportingFactIds: z.array(z.string()),
  note: z.string().optional(),
  completedBy: z.string().optional(),
  completedAt: z.string().optional(),
});

const citedParagraph = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  evidenceRefIds: z.array(z.string()),
});

export const minuteSectionSchema = z.object({
  id: z.string().min(1),
  sectionType: z.enum([
    "report_summary",
    "material_facts",
    "chronology",
    "parties_entities",
    "financial_transactions",
    "evidence_received",
    "investigation_conducted",
    "related_indicators",
    "outstanding_information",
    "proposed_actions",
    "officer_notes",
    "source_index",
  ]),
  titleBM: z.string(),
  titleEN: z.string(),
  content: z.array(citedParagraph),
  editedBy: z.string().optional(),
  editedAt: z.string().optional(),
  stale: z.boolean(),
  sourceStateHash: z.string(),
});

export const minuteCommentSchema = z.object({
  id: z.string().min(1),
  sectionId: z.string().min(1),
  author: z.string(),
  text: z.string(),
  createdAt: z.string(),
  resolved: z.boolean(),
});

export const investigationMinuteSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  templateVersion: z.string(),
  version: z.number().int().positive(),
  status: z.enum(["draft", "under_review", "returned_for_amendment", "ready_for_approval", "approved_for_demo"]),
  generatedAt: z.string(),
  generatedBy: z.string(),
  sections: z.array(minuteSectionSchema),
  comments: z.array(minuteCommentSchema),
  syntheticNotice: z.string(),
  templateNotice: z.string(),
});

export const auditEventSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().optional(),
  actorId: z.string(),
  actorRole: z.string(),
  occurredAt: z.string(),
  action: z.enum([
    "import",
    "analyse",
    "review_fact",
    "ccis_cross_reference",
    "inspect_graph",
    "generate_minute",
    "regenerate_section",
    "edit_minute",
    "change_minute_status",
    "export",
    "reset",
  ]),
  targetType: z.string(),
  targetId: z.string(),
  outcome: z.enum(["success", "failure"]),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  simulated: z.literal(true),
});

export const ocrBlockSchema = z.object({
  id: z.string().min(1),
  page: z.number().int().positive(),
  region: z.string(),
  text: z.string(),
});

export const evidenceArtifactSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["report_scan", "report_text", "chat_transcript", "call_transcript", "transactions", "image", "intake_notes"]),
  title: z.string(),
  path: z.string(),
  description: z.string(),
  synthetic: z.literal(true),
});

export const iprsQueueItemSchema = z.object({
  reportId: z.string().regex(/^IPRS-DEMO-/, "iPRS IDs must begin IPRS-DEMO-"),
  caseId: z.string().min(1),
  receivedAt: z.string(),
  location: z.string(),
  scamCategory: z.string(),
  reportedLossMYR: z.number().positive(),
  assignedOfficer: z.string(),
  processingStatus: z.enum(["received", "analysed", "in_review", "enriched"]),
  reviewStatus: z.enum(["pending", "in_progress", "complete"]),
  synthetic: z.literal(true),
});

export const iprsReportSchema = z.object({
  reportId: z.string().regex(/^IPRS-DEMO-/),
  caseId: z.string().min(1),
  receivedAt: z.string(),
  location: z.string(),
  scamCategory: z.string(),
  reportedLossMYR: z.number().positive(),
  assignedOfficer: z.string(),
  narrativeLines: z.array(z.string()),
  ocrBlocks: z.array(ocrBlockSchema),
  artifacts: z.array(evidenceArtifactSchema),
  synthetic: z.literal(true),
});

export const caseAnalysisSchema = z.object({
  caseId: z.string().min(1),
  classification: z.object({
    scamType: z.string(),
    rationale: z.string(),
    confidence: confidenceLevel,
  }),
  facts: z.array(caseFactSchema),
  transactions: z.array(transactionSchema),
  timeline: z.array(timelineEventSchema),
  evidenceRefs: z.array(evidenceReference),
  missingInformation: z.array(z.object({ id: z.string(), label: z.string(), detail: z.string() })),
  contradictions: z.array(
    z.object({ id: z.string(), label: z.string(), detail: z.string(), evidenceRefIds: z.array(z.string()) }),
  ),
  modusOperandi: z.array(z.string()),
});

export const ccisCaseSummarySchema = z.object({
  recordId: z.string().regex(/^CCIS-DEMO-/),
  title: z.string(),
  year: z.number().int(),
  status: z.string(),
  summary: z.string(),
  synthetic: z.literal(true),
});

export const ccisLinkSchema = z.object({
  id: z.string().min(1),
  ccisRecordId: z.string().regex(/^CCIS-DEMO-/),
  kind: z.enum(["exact_identifier", "analytical_similarity"]),
  identifierType: z.enum(["phone", "bank_account", "url", "transaction_reference"]).optional(),
  identifierValue: z.string().optional(),
  score: z.number().min(0).max(1).optional(),
  scoreComponents: z
    .object({
      textSimilarity: z.number(),
      sharedTacticScore: z.number(),
      temporalProximity: z.number(),
      channelMatch: z.number(),
    })
    .optional(),
  matchedExcerptA: z.string(),
  matchedExcerptB: z.string(),
  rationale: z.string(),
  evidenceRefIds: z.array(z.string()),
});

export const ccisEnrichmentSchema = z.object({
  caseId: z.string().min(1),
  records: z.array(ccisCaseSummarySchema),
  links: z.array(ccisLinkSchema),
  additionalFacts: z.array(caseFactSchema),
  additionalEvidenceRefs: z.array(evidenceReference),
});

export const manifestSchema = z.object({
  schemaVersion,
  fixtureVersion: z.string(),
  featuredCaseId: z.string(),
  featuredReportId: z.string(),
  artifactPaths: z.array(z.string()),
  expectedCounts: z.object({
    facts: z.number().int().min(15),
    victimTransactions: z.literal(5),
    timelineEvents: z.number().int().min(8),
    ccisRecords: z.literal(3),
    exactLinks: z.number().int().min(3),
    similarityLinks: z.number().int().min(1),
    evidenceGaps: z.number().int().min(2),
    contradictions: z.number().int().min(1),
  }),
  expectedTotals: z.object({
    victimTransfersMYR: z.literal(82500),
    accountedMYR: z.literal(79000),
    unresolvedMYR: z.literal(3500),
  }),
  seededErrorFactId: z.string(),
  ambiguousFactId: z.string(),
  historicalCcisIds: z.array(z.string().regex(/^CCIS-DEMO-/)).length(3),
});

// --- DemoState (persisted) ---
export const demoStateSchema = z.object({
  schemaVersion,
  fixtureVersion: z.string(),
  activeCaseId: z.string(),
  analysisRun: z.boolean(),
  factDecisions: z.record(
    z.string(),
    z.object({
      reviewState,
      correctedValue: z.string().optional(),
      reviewNote: z.string().optional(),
      reviewedBy: z.string().optional(),
      reviewedAt: z.string().optional(),
    }),
  ),
  ccisEnriched: z.boolean(),
  workflowOverrides: z.record(
    z.string(),
    z.object({
      status: z.enum(["not_started", "in_progress", "awaiting_information", "completed", "returned"]),
      note: z.string().optional(),
    }),
  ),
  minuteVersions: z.array(investigationMinuteSchema),
  activeMinuteVersion: z.number().nullable(),
  minuteEdits: z.record(z.string(), z.string()),
  presentationStep: z.number().int().min(0),
  auditEvents: z.array(auditEventSchema),
  language: z.enum(["bm", "en"]),
});

export type DemoStatePersisted = z.infer<typeof demoStateSchema>;
