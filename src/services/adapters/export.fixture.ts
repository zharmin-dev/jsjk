import type { DemoExport } from "../../domain/contracts";
import { delay } from "../delay";

export interface ExportAdapter {
  getAvailableExports(minuteId: string): Promise<DemoExport[]>;
}

export const exportFixtureAdapter: ExportAdapter = {
  async getAvailableExports(minuteId: string) {
    await delay(100);
    return [
      {
        id: "export-minute-pdf",
        minuteId,
        format: "pdf",
        label: "Illustrative minute export (pre-generated demo file)",
        path: "demo-assets/exports/illustrative-minute.txt",
      },
    ];
  },
};
