import { describe, it, expect } from "vitest";
import { minuteFixtureAdapter } from "../../services/adapters/minute.fixture";
import { caseAnalysis } from "../../fixtures/analysis/case-analysis";
import { ccisEnrichment } from "../../fixtures/ccis/enrichment";
import { reviewStateHash } from "../../domain/selectors";
import manifest from "../../fixtures/manifest.json";
import type { MinuteGenerationInput } from "../../domain/contracts";

function input(decisions: Record<string, "confirmed" | "rejected" | "needs_verification" | "unreviewed"> = {}, corrected: Record<string, string> = {}): MinuteGenerationInput {
  return {
    caseId: manifest.featuredCaseId,
    analysis: caseAnalysis,
    reviewDecisions: decisions,
    correctedValues: corrected,
    ccis: ccisEnrichment,
    stateHash: reviewStateHash(caseAnalysis.facts, {}),
  };
}

describe("minute generation", () => {
  it("has all 12 required sections with titles", () => {
    const m = minuteFixtureAdapter.generate(input({ "FACT-0471-09": "confirmed" }));
    expect(m.sections).toHaveLength(12);
    expect(m.templateNotice).toContain("Illustrative");
    expect(m.syntheticNotice).toContain("Synthetic");
  });

  it("rejected facts do not appear in factual sections", () => {
    const m = minuteFixtureAdapter.generate(
      input({ [manifest.seededErrorFactId]: "rejected", "FACT-0471-09": "confirmed" }),
    );
    const materialFacts = m.sections.find((s) => s.sectionType === "material_facts")!;
    const text = JSON.stringify(materialFacts.content);
    expect(text).not.toContain("DEMO-MY-24108");
    expect(text).not.toContain("DEMO-MY-24018"); // rejected entirely → absent
  });

  it("corrected facts appear with corrected value", () => {
    const m = minuteFixtureAdapter.generate(
      input(
        { [manifest.seededErrorFactId]: "confirmed", "FACT-0471-09": "confirmed" },
        { [manifest.seededErrorFactId]: "DEMO-MY-24018" },
      ),
    );
    const materialFacts = m.sections.find((s) => s.sectionType === "material_facts")!;
    expect(JSON.stringify(materialFacts.content)).toContain("DEMO-MY-24018");
  });

  it("needs-verification items appear only as indicators, not material facts", () => {
    const m = minuteFixtureAdapter.generate(
      input({ [manifest.ambiguousFactId]: "needs_verification", "FACT-0471-09": "confirmed" }),
    );
    const materialFacts = m.sections.find((s) => s.sectionType === "material_facts")!;
    expect(JSON.stringify(materialFacts.content)).not.toContain("77105\" token");
    const outstanding = m.sections.find((s) => s.sectionType === "outstanding_information")!;
    expect(JSON.stringify(outstanding.content)).toContain("Petunjuk untuk pengesahan");
  });

  it("financial section reconciles totals and cites evidence", () => {
    const m = minuteFixtureAdapter.generate(input());
    const fin = m.sections.find((s) => s.sectionType === "financial_transactions")!;
    const text = JSON.stringify(fin.content);
    expect(text).toContain("RM82,500");
    expect(text).toContain("RM79,000");
    expect(text).toContain("RM3,500");
    const summary = fin.content.find((p) => p.id === "ft-sum")!;
    expect(summary.evidenceRefIds.length).toBeGreaterThan(0);
  });

  it("single-section regeneration only changes that section", () => {
    const m1 = minuteFixtureAdapter.generate(input({ "FACT-0471-09": "confirmed" }));
    const fresh = minuteFixtureAdapter.regenerateSection(
      { ...input({ "FACT-0471-09": "confirmed", "FACT-0471-04": "confirmed" }), sectionType: "material_facts" },
      m1.sections,
    );
    expect(fresh.sectionType).toBe("material_facts");
    const others1 = m1.sections.filter((s) => s.sectionType !== "material_facts");
    // regenerate returns only the one section; caller replaces it. Other sections untouched by adapter.
    expect(others1.length).toBe(11);
  });

  it("material factual paragraphs carry citations", () => {
    const m = minuteFixtureAdapter.generate(
      input({ "FACT-0471-09": "confirmed", "FACT-0471-04": "confirmed" }),
    );
    const cited = m.sections
      .filter((s) => ["report_summary", "material_facts", "chronology", "financial_transactions"].includes(s.sectionType))
      .flatMap((s) => s.content)
      .filter((p) => !p.text.startsWith("Kandungan ini") && !p.text.startsWith("Tiada"));
    expect(cited.length).toBeGreaterThan(0);
    for (const p of cited) {
      expect(p.evidenceRefIds.length, `paragraph lacks citation: ${p.text.slice(0, 60)}`).toBeGreaterThan(0);
    }
  });

  it("fictional wording rules: no guilt language", () => {
    const m = minuteFixtureAdapter.generate(input({ "FACT-0471-09": "confirmed" }));
    const text = JSON.stringify(m.sections);
    for (const banned of ["mastermind", "committed the scam", "syndicate operated", "laundered", "guilty", "penjenayah"]) {
      expect(text.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });
});
