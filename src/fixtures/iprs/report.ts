import type { IprsReportPayload } from "../../domain/contracts";
import { policeReportSample, policeTransactions } from "../sample-documents";

const A = "demo-assets/iprs/IPRS-DEMO-2026-008721";

// Narrative lines are indexed 1-based in evidence locators.
export const iprsReport: IprsReportPayload = {
  reportId: "IPRS-DEMO-2026-008721",
  caseId: "JSJK-DEMO-2026-0471",
  receivedAt: "2026-07-05T10:45:00+08:00",
  location: policeReportSample.station,
  scamCategory: policeReportSample.category,
  reportedLossMYR: 48750,
  assignedOfficer: "Insp. Farah Nabila",
  narrativeLines: policeReportSample.narrative,
  ocrBlocks: [
    { id: "OCR-P1-R1", page: 1, region: "header", text: `${policeReportSample.reportNo} · ${policeReportSample.date} ${policeReportSample.time}` },
    { id: "OCR-P1-R2", page: 1, region: "summary", text: `${policeReportSample.category} · Kerugian ${policeReportSample.loss}` },
    { id: "OCR-P1-R3", page: 1, region: "accounts", text: `${policeReportSample.recipientBank} · ${policeReportSample.recipientAccount} · ${policeReportSample.recipientName}` },
    { id: "OCR-P1-R4", page: 1, region: "contact", text: `${policeReportSample.scamContact} · ${policeReportSample.website}` },
    { id: "OCR-P1-R5", page: 1, region: "transactions", text: policeTransactions.map((tx) => `${tx.occurredAt} ${tx.amount}`).join(" · ") },
  ],
  artifacts: [
    {
      id: "ART-REPORT-SCAN",
      kind: "report_scan",
      title: "Imbasan laporan polis (muka 1)",
      path: `${A}/report-page-1.svg`,
      description: "Representasi imbasan laporan iPRS.",
      synthetic: true,
    },
    {
      id: "ART-REPORT-TEXT",
      kind: "report_text",
      title: "Naratif laporan (teks)",
      path: "",
      description: "Naratif bernombor baris hasil OCR terkomputasi.",
      synthetic: true,
    },
    {
      id: "ART-WHATSAPP",
      kind: "chat_transcript",
      title: "Transkrip WhatsApp",
      path: `${A}/whatsapp-transcript.txt`,
      description: "Transkrip BM/English bercampur, 40 mesej.",
      synthetic: true,
    },
    {
      id: "ART-CALL",
      kind: "call_transcript",
      title: "Transkrip panggilan 21/07/2026",
      path: `${A}/call-transcript.txt`,
      description: "Transkrip panggilan bertanda masa.",
      synthetic: true,
    },
    {
      id: "ART-TXN",
      kind: "transactions",
      title: "Penyata transaksi (CSV)",
      path: `${A}/transactions.csv`,
      description: "Lima pindahan mangsa dan tiga pergerakan hiliran.",
      synthetic: true,
    },
    {
      id: "ART-PROMO",
      kind: "image",
      title: "Imej promosi pelaburan",
      path: `${A}/investment-promo.svg`,
      description: "Iklan promosi pelaburan.",
      synthetic: true,
    },
  ],
  synthetic: true,
};
