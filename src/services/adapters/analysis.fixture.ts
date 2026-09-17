import type { CaseAnalysisResult } from "../../domain/contracts";
import { caseAnalysisSchema } from "../../domain/schemas";
import { caseAnalysis } from "../../fixtures/analysis/case-analysis";

export interface AnalysisAdapter {
  analyse(caseId: string): Promise<CaseAnalysisResult>;
}

// Deterministic: returns precomputed fixture. Staging UI handled by component.
export const analysisFixtureAdapter: AnalysisAdapter = {
  async analyse(caseId: string) {
    if (caseId !== caseAnalysis.caseId) throw new Error(`Unknown synthetic case: ${caseId}`);
    return caseAnalysisSchema.parse(caseAnalysis);
  },
};
