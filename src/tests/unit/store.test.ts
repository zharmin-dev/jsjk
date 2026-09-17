import { describe, it, expect, beforeEach } from "vitest";
import { useDemoStore } from "../../state/demo-store";
import manifest from "../../fixtures/manifest.json";

describe("demo store", () => {
  beforeEach(() => {
    localStorage.clear();
    useDemoStore.getState().reset();
  });

  it("review fact records decision and audit", () => {
    useDemoStore.getState().reviewFact("FACT-0471-09", "confirmed");
    const s = useDemoStore.getState();
    expect(s.factDecisions["FACT-0471-09"]?.reviewState).toBe("confirmed");
    expect(s.auditEvents.some((e) => e.action === "review_fact" && e.targetId === "FACT-0471-09")).toBe(true);
  });

  it("reset restores canonical deep clone", () => {
    useDemoStore.getState().reviewFact("FACT-0471-09", "confirmed");
    useDemoStore.getState().enrichCcis();
    useDemoStore.getState().reset();
    const s = useDemoStore.getState();
    expect(Object.keys(s.factDecisions)).toHaveLength(0);
    expect(s.ccisEnriched).toBe(false);
    expect(s.activeCaseId).toBe(manifest.featuredCaseId);
  });

  it("saved state validates and round-trips", () => {
    useDemoStore.getState().reviewFact("FACT-0471-04", "confirmed");
    const raw = localStorage.getItem("jsjk-nexus-demo-state-v1");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.schemaVersion).toBe("1.3.0");
    expect(parsed.factDecisions["FACT-0471-04"].reviewState).toBe("confirmed");
  });

  it("workflow override applies", () => {
    useDemoStore.getState().setWorkflowStatus("WF-05", "awaiting_information");
    expect(useDemoStore.getState().workflowOverrides["WF-05"]?.status).toBe("awaiting_information");
  });
});
