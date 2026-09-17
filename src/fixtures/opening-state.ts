import type { DemoStatePersisted } from "../domain/schemas";
import manifest from "./manifest.json";

// Canonical opening state. Deep-cloned on load/reset. Never mutate this module object.
export const canonicalOpeningState: DemoStatePersisted = {
  schemaVersion: "1.3.0",
  fixtureVersion: manifest.fixtureVersion,
  activeCaseId: manifest.featuredCaseId,
  analysisRun: false,
  factDecisions: {},
  ccisEnriched: false,
  workflowOverrides: {},
  minuteVersions: [],
  activeMinuteVersion: null,
  minuteEdits: {},
  presentationStep: 0,
  auditEvents: [
    {
      id: "AUD-0001",
      caseId: "JSJK-DEMO-2026-0471",
      actorId: "system-simulated-iprs",
      actorRole: "Simulated iPRS connector",
      occurredAt: "2026-07-29T09:47:05+08:00",
      action: "import",
      targetType: "iprs_report",
      targetId: "IPRS-DEMO-2026-008721",
      outcome: "success",
      metadata: { queuePosition: 1, simulated: true },
      simulated: true,
    },
  ],
  language: "bm",
};
