import type { AuditEvent } from "../../domain/contracts";

export const openingAuditEvents: AuditEvent[] = [
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
];
