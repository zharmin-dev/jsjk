import { describe, it, expect } from "vitest";
import { manifestSchema, caseAnalysisSchema, ccisEnrichmentSchema, iprsReportSchema, graphPayloadSchema } from "../../domain/schemas";
import manifest from "../../fixtures/manifest.json";
import { caseAnalysis } from "../../fixtures/analysis/case-analysis";
import { ccisEnrichment } from "../../fixtures/ccis/enrichment";
import { iprsReport } from "../../fixtures/iprs/report";
import { activityGraph, moneyGraph, relationshipGraphAfter, relationshipGraphBefore } from "../../fixtures/graph/graphs";
import { reconcile, ccisGateConditions, gateOpen, activeFacts, similarityLabel } from "../../domain/selectors";

const SYNTHETIC_ID_PATTERNS = {
  phone: /^010-000-\d{4}$/,
  account: /^DEMO-MY-\d+$/,
  domain: /\.example$/,
};

describe("fixture integrity", () => {
  it("manifest validates", () => {
    expect(manifestSchema.parse(manifest).featuredCaseId).toBe("JSJK-DEMO-2026-0471");
  });

  it("analysis fixture validates and meets counts", () => {
    const a = caseAnalysisSchema.parse(caseAnalysis);
    expect(a.facts.length).toBeGreaterThanOrEqual(manifest.expectedCounts.facts);
    expect(a.transactions.filter((t) => t.sourceLabel === "Victim account")).toHaveLength(5);
    expect(a.timeline.length).toBeGreaterThanOrEqual(manifest.expectedCounts.timelineEvents);
    expect(a.missingInformation.length).toBeGreaterThanOrEqual(manifest.expectedCounts.evidenceGaps);
    expect(a.contradictions.length).toBeGreaterThanOrEqual(manifest.expectedCounts.contradictions);
  });

  it("seeded error and ambiguous items exist", () => {
    const seeded = caseAnalysis.facts.find((f) => f.id === manifest.seededErrorFactId);
    const ambiguous = caseAnalysis.facts.find((f) => f.id === manifest.ambiguousFactId);
    expect(seeded?.demoSeededError).toBe(true);
    expect(seeded?.displayValue).toBe("DEMO-MY-24108"); // wrong; source says 24018
    expect(ambiguous?.confidence).toBe("low");
  });

  it("CCIS fixture validates with 3 exact + 1 similarity links", () => {
    const c = ccisEnrichmentSchema.parse(ccisEnrichment);
    expect(c.records).toHaveLength(3);
    expect(c.links.filter((l) => l.kind === "exact_identifier")).toHaveLength(3);
    expect(c.links.filter((l) => l.kind === "analytical_similarity")).toHaveLength(1);
    expect(c.records.map((r) => r.recordId).sort()).toEqual([...manifest.historicalCcisIds].sort());
  });

  it("iPRS report validates", () => {
    expect(iprsReportSchema.parse(iprsReport).reportId).toBe(manifest.featuredReportId);
  });

  it("graph payloads validate", () => {
    for (const g of [activityGraph, moneyGraph, relationshipGraphBefore, relationshipGraphAfter]) {
      graphPayloadSchema.parse(g);
    }
    expect(relationshipGraphAfter.nodes.length).toBeGreaterThan(relationshipGraphBefore.nodes.length);
  });

  it("money reconciliation: 82,500 reported / 79,000 accounted / 3,500 unresolved", () => {
    const r = reconcile(caseAnalysis.transactions);
    expect(r.reportedMYR).toBe(82500);
    expect(r.accountedMYR).toBe(79000);
    expect(r.unresolvedMYR).toBe(3500);
  });

  it("all identifiers match synthetic patterns", () => {
    const text = JSON.stringify({ caseAnalysis, ccisEnrichment, iprsReport, graphs: [activityGraph, moneyGraph, relationshipGraphAfter] });
    // phones
    for (const m of text.matchAll(/010-\d{3}-\d{4}/g)) {
      expect(m[0]).toMatch(SYNTHETIC_ID_PATTERNS.phone);
    }
    // accounts: any MY-account-like token must begin DEMO-MY-
    for (const m of text.matchAll(/[A-Z]*-?MY-\d{3,}/g)) {
      expect(m[0]).toMatch(SYNTHETIC_ID_PATTERNS.account);
    }
    // no MyKad-like 12-digit pattern
    expect(text).not.toMatch(/\b\d{6}-\d{2}-\d{4}\b/);
    // domains use .example
    for (const m of text.matchAll(/[a-z0-9-]+\.(?:com|net|org|my|example)\b/gi)) {
      expect(m[0]).toMatch(SYNTHETIC_ID_PATTERNS.domain);
    }
  });

  it("ref=QC7712 appears in evidence", () => {
    const text = JSON.stringify(caseAnalysis.evidenceRefs);
    expect(text).toContain("ref=QC7712");
  });
});

describe("review gate", () => {
  const base = ccisGateConditions(caseAnalysis.facts, {}, manifest.seededErrorFactId, manifest.ambiguousFactId);

  it("closed when nothing reviewed", () => {
    expect(gateOpen(base)).toBe(false);
  });

  it("opens after required decisions", () => {
    const decisions = {
      [manifest.seededErrorFactId]: { reviewState: "confirmed" as const, correctedValue: "DEMO-MY-24018" },
      "FACT-0471-09": { reviewState: "confirmed" as const },
      [manifest.ambiguousFactId]: { reviewState: "needs_verification" as const },
      "FACT-0471-04": { reviewState: "confirmed" as const },
    };
    const conds = ccisGateConditions(caseAnalysis.facts, decisions, manifest.seededErrorFactId, manifest.ambiguousFactId);
    expect(gateOpen(conds)).toBe(true);
  });

  it("also opens when seeded error is rejected", () => {
    const decisions = {
      [manifest.seededErrorFactId]: { reviewState: "rejected" as const },
      "FACT-0471-09": { reviewState: "confirmed" as const },
      [manifest.ambiguousFactId]: { reviewState: "needs_verification" as const },
      "FACT-0471-10": { reviewState: "confirmed" as const },
    };
    // rejecting primary account fails gate-account but passes gate-seeded; gate requires account confirmed/corrected too
    const conds = ccisGateConditions(caseAnalysis.facts, decisions, manifest.seededErrorFactId, manifest.ambiguousFactId);
    expect(conds.find((c) => c.id === "gate-seeded")!.met).toBe(true);
    expect(conds.find((c) => c.id === "gate-account")!.met).toBe(false);
    expect(gateOpen(conds)).toBe(false);
  });
});

describe("derived state", () => {
  it("rejected facts leave active fact set", () => {
    const active = activeFacts(caseAnalysis.facts, {
      [manifest.seededErrorFactId]: { reviewState: "rejected" },
    });
    expect(active.find((f) => f.id === manifest.seededErrorFactId)).toBeUndefined();
    expect(active.length).toBe(caseAnalysis.facts.length - 1);
  });

  it("corrected facts show corrected value", () => {
    const active = activeFacts(caseAnalysis.facts, {
      [manifest.seededErrorFactId]: { reviewState: "confirmed", correctedValue: "DEMO-MY-24018" },
    });
    const f = active.find((x) => x.id === manifest.seededErrorFactId)!;
    expect(f.displayValue).toBe("DEMO-MY-24018");
    expect(f.correctedValue).toBe("DEMO-MY-24018");
  });
});

describe("similarity", () => {
  it("labels per SDS thresholds", () => {
    expect(similarityLabel(0.83)).toBe("Strong analytical similarity");
    expect(similarityLabel(0.65)).toBe("Moderate analytical similarity");
    expect(similarityLabel(0.4)).toBe("Weak analytical similarity");
  });
});
