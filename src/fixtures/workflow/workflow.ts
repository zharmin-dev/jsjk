import type { WorkflowStep } from "../../domain/contracts";

const CASE = "JSJK-DEMO-2026-0471";

export const workflowSteps: WorkflowStep[] = [
  { id: "WF-01", caseId: CASE, stepType: "report_received", status: "completed", ownerRole: "Investigating Officer", supportingFactIds: ["FACT-0471-01"], completedBy: "System (simulated import)", completedAt: "2026-07-29T09:47:00+08:00" },
  { id: "WF-02", caseId: CASE, stepType: "facts_reviewed", status: "in_progress", ownerRole: "Investigating Officer", supportingFactIds: ["FACT-0471-04", "FACT-0471-06", "FACT-0471-09"] },
  { id: "WF-03", caseId: CASE, stepType: "ccis_cross_reference", status: "not_started", ownerRole: "Investigating Officer", supportingFactIds: [] },
  { id: "WF-04", caseId: CASE, stepType: "financial_trail_review", status: "not_started", ownerRole: "Investigating Officer", supportingFactIds: [] },
  { id: "WF-05", caseId: CASE, stepType: "evidence_requests", status: "not_started", ownerRole: "Investigating Officer", supportingFactIds: [] },
  { id: "WF-06", caseId: CASE, stepType: "investigation_actions", status: "not_started", ownerRole: "Investigating Officer", supportingFactIds: [] },
  { id: "WF-07", caseId: CASE, stepType: "minute_drafted", status: "not_started", ownerRole: "Investigating Officer", supportingFactIds: [] },
  { id: "WF-08", caseId: CASE, stepType: "supervisor_review", status: "not_started", ownerRole: "Supervising Officer", supportingFactIds: [] },
];
