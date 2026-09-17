import type { GraphPayload, GraphView } from "../../domain/contracts";
import { graphPayloadSchema } from "../../domain/schemas";
import { activityGraph, moneyGraph, relationshipGraphAfter, relationshipGraphBefore } from "../../fixtures/graph/graphs";
import { delay } from "../delay";

export interface GraphAdapter {
  build(caseId: string, view: GraphView, enriched: boolean): Promise<GraphPayload>;
}

export const graphFixtureAdapter: GraphAdapter = {
  async build(caseId: string, view: GraphView, enriched: boolean) {
    await delay(80);
    const payload =
      view === "activity" ? activityGraph : view === "money" ? moneyGraph : enriched ? relationshipGraphAfter : relationshipGraphBefore;
    if (payload.caseId !== caseId) throw new Error(`Unknown synthetic case: ${caseId}`);
    return graphPayloadSchema.parse(payload);
  },
};
