import type { IprsQueueItem, IprsReportPayload } from "../../domain/contracts";
import { iprsQueueItemSchema, iprsReportSchema } from "../../domain/schemas";
import { iprsQueue } from "../../fixtures/iprs/queue";
import { iprsReport } from "../../fixtures/iprs/report";
import { delay } from "../delay";
import { z } from "zod";

export interface IprsAdapter {
  getQueue(): Promise<IprsQueueItem[]>;
  getReport(reportId: string): Promise<IprsReportPayload>;
}

export const iprsFixtureAdapter: IprsAdapter = {
  async getQueue() {
    await delay(150);
    return z.array(iprsQueueItemSchema).parse(iprsQueue);
  },
  async getReport(reportId: string) {
    await delay(200);
    if (reportId !== iprsReport.reportId) throw new Error(`Unknown synthetic report: ${reportId}`);
    return iprsReportSchema.parse(iprsReport);
  },
};
