import type { CcisCrossReferenceRequest, CcisEnrichmentResult } from "../../domain/contracts";
import { ccisEnrichmentSchema } from "../../domain/schemas";
import { ccisEnrichment } from "../../fixtures/ccis/enrichment";
import { delay } from "../delay";

export interface CcisAdapter {
  crossReference(request: CcisCrossReferenceRequest): Promise<CcisEnrichmentResult>;
}

export const ccisFixtureAdapter: CcisAdapter = {
  async crossReference(request: CcisCrossReferenceRequest) {
    await delay(1200); // NFR: CCIS reveal < 3s
    if (request.caseId !== ccisEnrichment.caseId) throw new Error(`Unknown synthetic case: ${request.caseId}`);
    return ccisEnrichmentSchema.parse(ccisEnrichment);
  },
};
