import { create } from "zustand";
import { produce } from "immer";
import type { DemoStatePersisted } from "../domain/schemas";
import { demoStateSchema } from "../domain/schemas";
import type { AuditEvent, InvestigationMinute, ReviewState, WorkflowStatus } from "../domain/contracts";
import { canonicalOpeningState } from "../fixtures/opening-state";
import manifest from "../fixtures/manifest.json";

const STORAGE_KEY = "jsjk-nexus-demo-state-v1";

let auditCounter = 1;
function nextAuditId(): string {
  auditCounter += 1;
  return `AUD-${String(auditCounter).padStart(4, "0")}-${Date.now().toString(36)}`;
}

function makeAudit(
  partial: Pick<AuditEvent, "action" | "targetType" | "targetId"> & Partial<AuditEvent>,
): AuditEvent {
  return {
    id: nextAuditId(),
    caseId: manifest.featuredCaseId,
    actorId: "demo-officer",
    actorRole: "Investigating Officer (demo)",
    occurredAt: new Date().toISOString(),
    outcome: "success",
    metadata: {},
    simulated: true,
    ...partial,
  };
}

function deepCloneCanonical(): DemoStatePersisted {
  return JSON.parse(JSON.stringify(canonicalOpeningState)) as DemoStatePersisted;
}

function loadInitial(): { state: DemoStatePersisted; recovered: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: deepCloneCanonical(), recovered: false };
    const parsed = demoStateSchema.safeParse(JSON.parse(raw));
    if (parsed.success && parsed.data.fixtureVersion === manifest.fixtureVersion) {
      return { state: parsed.data, recovered: false };
    }
    localStorage.removeItem(STORAGE_KEY);
    return { state: deepCloneCanonical(), recovered: true };
  } catch {
    return { state: deepCloneCanonical(), recovered: true };
  }
}

export interface DemoStore extends DemoStatePersisted {
  hydrated: boolean;
  recoveryNotice: boolean;
  dismissRecoveryNotice: () => void;
  runAnalysis: () => void;
  reviewFact: (factId: string, reviewState: ReviewState, opts?: { correctedValue?: string; reviewNote?: string }) => void;
  enrichCcis: () => void;
  setWorkflowStatus: (stepId: string, status: WorkflowStatus, note?: string) => void;
  saveMinuteVersion: (minute: InvestigationMinute) => void;
  setActiveMinuteVersion: (version: number | null) => void;
  updateMinute: (minute: InvestigationMinute) => void;
  appendAudit: (e: AuditEvent) => void;
  setPresentationStep: (n: number) => void;
  setLanguage: (lang: "bm" | "en") => void;
  reset: () => void;
}

const initial = loadInitial();

export const useDemoStore = create<DemoStore>((set) => ({
  ...initial.state,
  hydrated: true,
  recoveryNotice: initial.recovered,

  dismissRecoveryNotice: () => set({ recoveryNotice: false }),

  runAnalysis: () =>
    set(
      produce((s: DemoStore) => {
        s.analysisRun = true;
        s.auditEvents.push(
          makeAudit({ action: "analyse", targetType: "case", targetId: s.activeCaseId }),
        );
      }),
    ),

  reviewFact: (factId, reviewState, opts) =>
    set(
      produce((s: DemoStore) => {
        s.factDecisions[factId] = {
          reviewState,
          correctedValue: opts?.correctedValue,
          reviewNote: opts?.reviewNote,
          reviewedBy: "demo-officer",
          reviewedAt: new Date().toISOString(),
        };
        s.auditEvents.push(
          makeAudit({
            action: "review_fact",
            targetType: "fact",
            targetId: factId,
            metadata: { reviewState, corrected: !!opts?.correctedValue },
          }),
        );
      }),
    ),

  enrichCcis: () =>
    set(
      produce((s: DemoStore) => {
        s.ccisEnriched = true;
        s.auditEvents.push(
          makeAudit({ action: "ccis_cross_reference", targetType: "case", targetId: s.activeCaseId }),
        );
      }),
    ),

  setWorkflowStatus: (stepId, status, note) =>
    set(
      produce((s: DemoStore) => {
        s.workflowOverrides[stepId] = { status, note };
      }),
    ),

  saveMinuteVersion: (minute) =>
    set(
      produce((s: DemoStore) => {
        s.minuteVersions.push(minute);
        s.activeMinuteVersion = minute.version;
      }),
    ),

  setActiveMinuteVersion: (version) => set({ activeMinuteVersion: version }),

  updateMinute: (minute) =>
    set(
      produce((s: DemoStore) => {
        const i = s.minuteVersions.findIndex((m) => m.version === minute.version);
        if (i >= 0) s.minuteVersions[i] = minute;
      }),
    ),

  appendAudit: (e) =>
    set(
      produce((s: DemoStore) => {
        s.auditEvents.push(e);
      }),
    ),

  setPresentationStep: (n) => set({ presentationStep: n }),
  setLanguage: (lang) => set({ language: lang }),

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = deepCloneCanonical();
    fresh.auditEvents.push(makeAudit({ action: "reset", targetType: "demo", targetId: "all" }));
    set({ ...fresh, recoveryNotice: false });
  },
}));

// Persist on change (schema-versioned, validated on load).
useDemoStore.subscribe((s) => {
  if (!s.hydrated) return;
  const snapshot: DemoStatePersisted = {
    schemaVersion: s.schemaVersion,
    fixtureVersion: s.fixtureVersion,
    activeCaseId: s.activeCaseId,
    analysisRun: s.analysisRun,
    factDecisions: s.factDecisions,
    ccisEnriched: s.ccisEnriched,
    workflowOverrides: s.workflowOverrides,
    minuteVersions: s.minuteVersions,
    activeMinuteVersion: s.activeMinuteVersion,
    minuteEdits: s.minuteEdits,
    presentationStep: s.presentationStep,
    auditEvents: s.auditEvents,
    language: s.language,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // storage full or blocked — demo continues in memory
  }
});

export { makeAudit };
