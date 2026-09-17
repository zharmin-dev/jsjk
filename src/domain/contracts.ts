// Domain contracts per SDS v1.3 §10. All case records synthetic.

export type ReviewState = "unreviewed" | "confirmed" | "rejected" | "needs_verification";
export type ConfidenceLevel = "high" | "medium" | "low";
export type SourceSystem = "IPRS" | "CCIS" | "EVIDENCE" | "AI_DERIVED" | "OFFICER_ENTERED";
export type EvidenceStatus = "reported" | "supported" | "confirmed_record" | "inferred";
export type GraphView = "activity" | "relationship" | "money";
export type Language = "bm" | "en";

export interface EvidenceLocator {
  kind: "line" | "message" | "row" | "region" | "page";
  start: number | string;
  end?: number | string;
}

export interface Provenance {
  sourceSystem: SourceSystem;
  sourceRecordId: string;
  sourceRevision?: string;
  artifactId?: string;
  importedAt: string;
  locator?: EvidenceLocator;
  extractionMethod:
    | "fixture_ocr"
    | "structured_import"
    | "text_extraction"
    | "officer_entry"
    | "precomputed_analysis";
  originalValue?: string;
}

export interface EvidenceReference {
  id: string;
  artifactId: string;
  locator: EvidenceLocator;
  excerpt: string;
}

export type FactType =
  | "person_alias"
  | "phone"
  | "bank_account"
  | "url"
  | "organisation"
  | "amount"
  | "date"
  | "location"
  | "transaction_reference"
  | "modus_operandi";

export interface CaseFact {
  id: string;
  caseId: string;
  factType: FactType;
  displayValue: string;
  normalisedValue?: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  reviewState: ReviewState;
  evidenceRefIds: string[];
  provenance: Provenance;
  correctedValue?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  demoSeededError?: boolean;
}

export interface TransactionRecord {
  id: string;
  caseId: string;
  occurredAt: string;
  sourceLabel: string;
  destinationAccountEntityId: string;
  amountMYR: number;
  channel: string;
  reference?: string;
  evidenceRefIds: string[];
  evidenceStatus: EvidenceStatus;
  provenance: Provenance;
  synthetic: true;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  occurredAt: string;
  eventType: "contact" | "instruction" | "transfer" | "claim" | "report" | "investigation";
  title: string;
  description: string;
  evidenceRefIds: string[];
  confidence: ConfidenceLevel;
  reviewState: ReviewState;
  provenance: Provenance;
}

export type LinkType =
  | "MENTIONED_IN"
  | "USES"
  | "CONTACTED_VIA"
  | "TRANSFERRED_TO"
  | "SUPPORTED_BY"
  | "RELATED_CASE"
  | "EXACT_MATCH"
  | "SIMILAR_MO"
  | "REQUIRES_VERIFICATION";

export interface RelationshipEdge {
  id: string;
  sourceId: string;
  targetId: string;
  linkType: LinkType;
  label: string;
  score?: number;
  evidenceRefIds: string[];
  assessment: "fact" | "analytical_indicator";
  rationale: string;
  verificationState: ReviewState;
  provenance: Provenance[];
  visibleIn: GraphView[];
}

export interface GraphNode {
  id: string;
  nodeType:
    | "police_report"
    | "ccis_case"
    | "person_alias"
    | "phone"
    | "bank_account"
    | "transaction"
    | "evidence"
    | "organisation"
    | "url_domain"
    | "modus_operandi"
    | "activity_event"
    | "unresolved";
  label: string;
  sublabel?: string;
  sourceBadges: SourceSystem[];
  verificationState: ReviewState;
  evidenceRefIds: string[];
  rationale?: string;
  position: { x: number; y: number };
}

export interface GraphPayload {
  caseId: string;
  view: GraphView;
  nodes: GraphNode[];
  edges: RelationshipEdge[];
  generatedFromStateHash: string;
}

export type WorkflowStepType =
  | "report_received"
  | "facts_reviewed"
  | "ccis_cross_reference"
  | "financial_trail_review"
  | "evidence_requests"
  | "investigation_actions"
  | "minute_drafted"
  | "supervisor_review";

export type WorkflowStatus =
  | "not_started"
  | "in_progress"
  | "awaiting_information"
  | "completed"
  | "returned";

export interface WorkflowStep {
  id: string;
  caseId: string;
  stepType: WorkflowStepType;
  status: WorkflowStatus;
  ownerRole: string;
  supportingFactIds: string[];
  note?: string;
  completedBy?: string;
  completedAt?: string;
}

export type MinuteStatus =
  | "draft"
  | "under_review"
  | "returned_for_amendment"
  | "ready_for_approval"
  | "approved_for_demo";

export type MinuteSectionType =
  | "report_summary"
  | "material_facts"
  | "chronology"
  | "parties_entities"
  | "financial_transactions"
  | "evidence_received"
  | "investigation_conducted"
  | "related_indicators"
  | "outstanding_information"
  | "proposed_actions"
  | "officer_notes"
  | "source_index";

export interface CitedParagraph {
  id: string;
  text: string;
  evidenceRefIds: string[];
}

export interface MinuteSection {
  id: string;
  sectionType: MinuteSectionType;
  titleBM: string;
  titleEN: string;
  content: CitedParagraph[];
  editedBy?: string;
  editedAt?: string;
  stale: boolean;
  sourceStateHash: string;
}

export interface MinuteComment {
  id: string;
  sectionId: string;
  author: string;
  text: string;
  createdAt: string;
  resolved: boolean;
}

export interface InvestigationMinute {
  id: string;
  caseId: string;
  templateVersion: string;
  version: number;
  status: MinuteStatus;
  generatedAt: string;
  generatedBy: string;
  sections: MinuteSection[];
  comments: MinuteComment[];
  syntheticNotice: string;
  templateNotice: string;
}

export type AuditAction =
  | "import"
  | "analyse"
  | "review_fact"
  | "ccis_cross_reference"
  | "inspect_graph"
  | "generate_minute"
  | "regenerate_section"
  | "edit_minute"
  | "change_minute_status"
  | "export"
  | "reset";

export interface AuditEvent {
  id: string;
  caseId?: string;
  actorId: string;
  actorRole: string;
  occurredAt: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  outcome: "success" | "failure";
  metadata: Record<string, string | number | boolean | null>;
  simulated: true;
}

// --- iPRS adapter payloads ---

export interface IprsQueueItem {
  reportId: string;
  caseId: string;
  receivedAt: string;
  location: string;
  scamCategory: string;
  reportedLossMYR: number;
  assignedOfficer: string;
  processingStatus: "received" | "analysed" | "in_review" | "enriched";
  reviewStatus: "pending" | "in_progress" | "complete";
  synthetic: true;
}

export interface OcrBlock {
  id: string;
  page: number;
  region: string;
  text: string;
}

export interface EvidenceArtifact {
  id: string;
  kind: "report_scan" | "report_text" | "chat_transcript" | "call_transcript" | "transactions" | "image" | "intake_notes";
  title: string;
  path: string;
  description: string;
  synthetic: true;
}

export interface IprsReportPayload {
  reportId: string;
  caseId: string;
  receivedAt: string;
  location: string;
  scamCategory: string;
  reportedLossMYR: number;
  assignedOfficer: string;
  narrativeLines: string[];
  ocrBlocks: OcrBlock[];
  artifacts: EvidenceArtifact[];
  synthetic: true;
}

// --- Analysis adapter payloads ---

export interface CaseAnalysisResult {
  caseId: string;
  classification: { scamType: string; rationale: string; confidence: ConfidenceLevel };
  facts: CaseFact[];
  transactions: TransactionRecord[];
  timeline: TimelineEvent[];
  evidenceRefs: EvidenceReference[];
  missingInformation: Array<{ id: string; label: string; detail: string }>;
  contradictions: Array<{ id: string; label: string; detail: string; evidenceRefIds: string[] }>;
  modusOperandi: string[];
}

// --- CCIS adapter payloads ---

export interface CcisCaseSummary {
  recordId: string;
  title: string;
  year: number;
  status: string;
  summary: string;
  synthetic: true;
}

export interface CcisLink {
  id: string;
  ccisRecordId: string;
  kind: "exact_identifier" | "analytical_similarity";
  identifierType?: "phone" | "bank_account" | "url" | "transaction_reference";
  identifierValue?: string;
  score?: number;
  scoreComponents?: { textSimilarity: number; sharedTacticScore: number; temporalProximity: number; channelMatch: number };
  matchedExcerptA: string;
  matchedExcerptB: string;
  rationale: string;
  evidenceRefIds: string[];
}

export interface CcisEnrichmentResult {
  caseId: string;
  records: CcisCaseSummary[];
  links: CcisLink[];
  additionalFacts: CaseFact[];
  additionalEvidenceRefs: EvidenceReference[];
}

export interface CcisCrossReferenceRequest {
  caseId: string;
  identifiers: { phones: string[]; accounts: string[]; domains: string[]; references: string[] };
}

// --- Minute adapter payloads ---

export interface MinuteGenerationInput {
  caseId: string;
  analysis: CaseAnalysisResult;
  reviewDecisions: Record<string, ReviewState>;
  correctedValues: Record<string, string>;
  ccis: CcisEnrichmentResult | null;
  stateHash: string;
}

export interface SectionRegenerationInput extends MinuteGenerationInput {
  sectionType: MinuteSectionType;
}

// --- Export adapter payloads ---

export interface DemoExport {
  id: string;
  minuteId: string;
  format: "pdf" | "docx";
  label: string;
  path: string;
}

// --- Fixture manifest ---

export interface FixtureManifest {
  schemaVersion: string;
  fixtureVersion: string;
  featuredCaseId: string;
  featuredReportId: string;
  artifactPaths: string[];
  expectedCounts: {
    facts: number;
    victimTransactions: number;
    timelineEvents: number;
    ccisRecords: number;
    exactLinks: number;
    similarityLinks: number;
    evidenceGaps: number;
    contradictions: number;
  };
  expectedTotals: { victimTransfersMYR: number; accountedMYR: number; unresolvedMYR: number };
  seededErrorFactId: string;
  ambiguousFactId: string;
  historicalCcisIds: string[];
}
