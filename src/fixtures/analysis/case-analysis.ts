import type { CaseAnalysisResult, EvidenceReference } from "../../domain/contracts";

const CASE = "JSJK-DEMO-2026-0471";
const RPT = "IPRS-DEMO-2026-008721";
const AT = "2026-07-29T10:00:00+08:00";

export const evidenceRefs: EvidenceReference[] = [
  { id: "EV-RPT-L1", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 1 }, excerpt: "Pengadu Nur Aina Rahman (nama samaran sintetik) melaporkan penipuan pelaburan tidak wujud." },
  { id: "EV-RPT-L2", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 2 }, excerpt: "Pengadu melihat iklan Quantum Crest Capital di media sosial pada 16/07/2026." },
  { id: "EV-RPT-L3", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 3 }, excerpt: "…dihubungi individu menggunakan nama Daniel Lim melalui WhatsApp 010-000-7712." },
  { id: "EV-RPT-L4", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 4 }, excerpt: "…ditambah ke kumpulan WhatsApp Quantum Crest Capital VIP oleh admin Mei Support 010-000-4839." },
  { id: "EV-RPT-L6", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 6 }, excerpt: "…membayar ke akaun DEMO-MY-24018 dengan rujukan ref=QC7712." },
  { id: "EV-RPT-L7", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 7 }, excerpt: "18/07/2026 10:14 — RM10,000 ke DEMO-MY-24018." },
  { id: "EV-RPT-L12", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 12 }, excerpt: "Jumlah keseluruhan pindahan adalah RM82,500." },
  { id: "EV-RPT-L13", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 13 }, excerpt: "Portal pelaburan yang ditunjukkan ialah quantum-crest.example." },
  { id: "EV-RPT-L15", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 15 }, excerpt: "…diminta membayar yuran pelepasan RM8,000 sebelum dana dilepaskan." },
  { id: "EV-RPT-L17", artifactId: "ART-REPORT-TEXT", locator: { kind: "line", start: 17 }, excerpt: "Mengikut kronologi awal pengadu, pembayaran pertama dibuat pada 17/07/2026." },
  { id: "EV-WA-M01", artifactId: "ART-WHATSAPP", locator: { kind: "message", start: "M01" }, excerpt: "Daniel Lim: …senior advisor Quantum Crest Capital. ref=QC7712" },
  { id: "EV-WA-M09", artifactId: "ART-WHATSAPP", locator: { kind: "message", start: "M09" }, excerpt: "…pakej pemula RM10,000. Bank in ke akaun syarikat DEMO-MY-24018. Rujukan ref=QC7712." },
  { id: "EV-WA-M11", artifactId: "ART-WHATSAPP", locator: { kind: "message", start: "M11" }, excerpt: "Akaun rasmi syarikat puan… semua transaksi recorded di portal quantum-crest.example" },
  { id: "EV-WA-M22", artifactId: "ART-WHATSAPP", locator: { kind: "message", start: "M22" }, excerpt: "Mei Support: …guna akaun hujung 77105 juga ya puan, kecuali kami maklum lain." },
  { id: "EV-WA-M30", artifactId: "ART-WHATSAPP", locator: { kind: "message", start: "M30" }, excerpt: "Mei Support: …kena bayar yuran pelepasan RM8,000 dulu. Standard procedure." },
  { id: "EV-WA-M36", artifactId: "ART-WHATSAPP", locator: { kind: "message", start: "M36" }, excerpt: "Mei Support: …kalau report polis akaun puan akan frozen dan semua duit hilang." },
  { id: "EV-CALL-C07", artifactId: "ART-CALL", locator: { kind: "message", start: "C07" }, excerpt: "Kami berdaftar di offshore financial centre puan, semua rekod ada di quantum-crest.example." },
  { id: "EV-TXN-CSV", artifactId: "ART-TXN", locator: { kind: "row", start: 1, end: 5 }, excerpt: "TX-0471-01…05 — lima pindahan mangsa berjumlah RM82,500." },
  { id: "EV-TXN-D1", artifactId: "ART-TXN", locator: { kind: "row", start: 6 }, excerpt: "TX-0471-D1 — DEMO-MY-24018 → DEMO-MY-55431, RM19,000." },
  { id: "EV-TXN-D2", artifactId: "ART-TXN", locator: { kind: "row", start: 7 }, excerpt: "TX-0471-D2 — DEMO-MY-77105 → DEMO-MY-99820, RM19,500." },
  { id: "EV-TXN-D3", artifactId: "ART-TXN", locator: { kind: "row", start: 8 }, excerpt: "TX-0471-D3 — DEMO-MY-55431 → DEMO-MY-99820, RM40,500." },
  { id: "EV-PROMO", artifactId: "ART-PROMO", locator: { kind: "region", start: "banner" }, excerpt: "Quantum Crest Capital — Pulangan 8-12% Seminggu · quantum-crest.example · ref=QC7712" },
];

const iprs = (artifactId: string, kind: EvidenceReference["locator"]["kind"], start: number | string) => ({
  sourceSystem: "IPRS" as const,
  sourceRecordId: RPT,
  artifactId,
  importedAt: AT,
  locator: { kind, start },
  extractionMethod: "fixture_ocr" as const,
});

export const caseAnalysis: CaseAnalysisResult = {
  caseId: CASE,
  classification: {
    scamType: "Non-existent investment scam",
    rationale:
      "Promised guaranteed weekly returns, WhatsApp group pressure, fabricated testimonials and a final release-fee demand match the non-existent investment scam pattern. Classification requires officer verification.",
    confidence: "high",
  },
  facts: [
    { id: "FACT-0471-01", caseId: CASE, factType: "person_alias", displayValue: "Nur Aina Rahman (victim, synthetic alias)", confidence: "high", confidenceScore: 0.98, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L1"], provenance: iprs("ART-REPORT-TEXT", "line", 1) },
    { id: "FACT-0471-02", caseId: CASE, factType: "person_alias", displayValue: "Daniel Lim (reported adviser alias)", confidence: "high", confidenceScore: 0.95, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L3", "EV-WA-M01"], provenance: iprs("ART-REPORT-TEXT", "line", 3) },
    { id: "FACT-0471-03", caseId: CASE, factType: "person_alias", displayValue: "Mei Support (group administrator alias)", confidence: "high", confidenceScore: 0.94, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L4"], provenance: iprs("ART-REPORT-TEXT", "line", 4) },
    { id: "FACT-0471-04", caseId: CASE, factType: "phone", displayValue: "010-000-7712", normalisedValue: "0100007712", confidence: "high", confidenceScore: 0.97, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L3", "EV-WA-M01"], provenance: iprs("ART-REPORT-TEXT", "line", 3) },
    { id: "FACT-0471-05", caseId: CASE, factType: "phone", displayValue: "010-000-4839", normalisedValue: "0100004839", confidence: "high", confidenceScore: 0.96, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L4"], provenance: iprs("ART-REPORT-TEXT", "line", 4) },
    // Seeded incorrect extraction: report line 6 says DEMO-MY-24018. AI output transposed digits.
    { id: "FACT-0471-06", caseId: CASE, factType: "bank_account", displayValue: "DEMO-MY-24108", normalisedValue: "DEMO-MY-24108", confidence: "medium", confidenceScore: 0.71, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L6", "EV-WA-M09"], provenance: iprs("ART-REPORT-TEXT", "line", 6), demoSeededError: true },
    { id: "FACT-0471-07", caseId: CASE, factType: "bank_account", displayValue: "DEMO-MY-77105", normalisedValue: "DEMO-MY-77105", confidence: "high", confidenceScore: 0.97, reviewState: "unreviewed", evidenceRefIds: ["EV-TXN-CSV", "EV-TXN-D2"], provenance: { ...iprs("ART-TXN", "row", 3), extractionMethod: "structured_import" } },
    { id: "FACT-0471-08", caseId: CASE, factType: "bank_account", displayValue: "DEMO-MY-55431", normalisedValue: "DEMO-MY-55431", confidence: "high", confidenceScore: 0.97, reviewState: "unreviewed", evidenceRefIds: ["EV-TXN-CSV", "EV-TXN-D1"], provenance: { ...iprs("ART-TXN", "row", 4), extractionMethod: "structured_import" } },
    { id: "FACT-0471-09", caseId: CASE, factType: "amount", displayValue: "RM82,500 total reported loss", normalisedValue: "82500", confidence: "high", confidenceScore: 0.99, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L12", "EV-TXN-CSV"], provenance: iprs("ART-REPORT-TEXT", "line", 12) },
    { id: "FACT-0471-10", caseId: CASE, factType: "url", displayValue: "quantum-crest.example", normalisedValue: "quantum-crest.example", confidence: "high", confidenceScore: 0.96, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L13", "EV-PROMO"], provenance: iprs("ART-REPORT-TEXT", "line", 13) },
    { id: "FACT-0471-11", caseId: CASE, factType: "organisation", displayValue: "Quantum Crest Capital (campaign name)", confidence: "high", confidenceScore: 0.95, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L2", "EV-PROMO"], provenance: iprs("ART-REPORT-TEXT", "line", 2) },
    { id: "FACT-0471-12", caseId: CASE, factType: "transaction_reference", displayValue: "ref=QC7712", normalisedValue: "QC7712", confidence: "high", confidenceScore: 0.97, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L6", "EV-WA-M09", "EV-PROMO"], provenance: iprs("ART-REPORT-TEXT", "line", 6) },
    { id: "FACT-0471-13", caseId: CASE, factType: "date", displayValue: "2026-07-16 first contact (advertisement viewed)", normalisedValue: "2026-07-16", confidence: "high", confidenceScore: 0.93, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L2", "EV-WA-M01"], provenance: iprs("ART-REPORT-TEXT", "line", 2) },
    { id: "FACT-0471-14", caseId: CASE, factType: "location", displayValue: "Ibu Pejabat Kontinjen Demo, Kuala Lumpur (reporting station)", confidence: "high", confidenceScore: 0.99, reviewState: "unreviewed", evidenceRefIds: [], provenance: { ...iprs("ART-REPORT-SCAN", "region", "header"), extractionMethod: "structured_import" } },
    // Ambiguous low-confidence item: "77105" could be account suffix or group code.
    { id: "FACT-0471-15", caseId: CASE, factType: "transaction_reference", displayValue: "\"77105\" token in admin message — possibly account suffix, possibly internal group code", normalisedValue: "77105", confidence: "low", confidenceScore: 0.38, reviewState: "unreviewed", evidenceRefIds: ["EV-WA-M22"], provenance: { sourceSystem: "AI_DERIVED", sourceRecordId: RPT, artifactId: "ART-WHATSAPP", importedAt: AT, locator: { kind: "message", start: "M22" }, extractionMethod: "precomputed_analysis" } },
    { id: "FACT-0471-16", caseId: CASE, factType: "modus_operandi", displayValue: "Guaranteed weekly returns promised (8-12%)", confidence: "high", confidenceScore: 0.92, reviewState: "unreviewed", evidenceRefIds: ["EV-PROMO", "EV-WA-M01"], provenance: { sourceSystem: "AI_DERIVED", sourceRecordId: RPT, artifactId: "ART-PROMO", importedAt: AT, locator: { kind: "region", start: "banner" }, extractionMethod: "precomputed_analysis" } },
    { id: "FACT-0471-17", caseId: CASE, factType: "modus_operandi", displayValue: "Final release-fee demand before withdrawal (RM8,000)", confidence: "high", confidenceScore: 0.94, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L15", "EV-WA-M30"], provenance: { sourceSystem: "AI_DERIVED", sourceRecordId: RPT, artifactId: "ART-WHATSAPP", importedAt: AT, locator: { kind: "message", start: "M30" }, extractionMethod: "precomputed_analysis" } },
    { id: "FACT-0471-18", caseId: CASE, factType: "amount", displayValue: "RM8,000 additional release fee demanded", normalisedValue: "8000", confidence: "high", confidenceScore: 0.95, reviewState: "unreviewed", evidenceRefIds: ["EV-RPT-L15", "EV-WA-M30"], provenance: iprs("ART-REPORT-TEXT", "line", 15) },
  ],
  transactions: [
    { id: "TX-0471-01", caseId: CASE, occurredAt: "2026-07-18T10:14:00+08:00", sourceLabel: "Victim account", destinationAccountEntityId: "FACT-0471-06", amountMYR: 10000, channel: "FPX", reference: "ref=QC7712", evidenceRefIds: ["EV-TXN-CSV"], evidenceStatus: "reported", provenance: { sourceSystem: "IPRS", sourceRecordId: RPT, artifactId: "ART-TXN", importedAt: AT, locator: { kind: "row", start: 1 }, extractionMethod: "structured_import" }, synthetic: true },
    { id: "TX-0471-02", caseId: CASE, occurredAt: "2026-07-19T14:06:00+08:00", sourceLabel: "Victim account", destinationAccountEntityId: "FACT-0471-06", amountMYR: 15000, channel: "FPX", reference: "ref=QC7712", evidenceRefIds: ["EV-TXN-CSV"], evidenceStatus: "reported", provenance: { sourceSystem: "IPRS", sourceRecordId: RPT, artifactId: "ART-TXN", importedAt: AT, locator: { kind: "row", start: 2 }, extractionMethod: "structured_import" }, synthetic: true },
    { id: "TX-0471-03", caseId: CASE, occurredAt: "2026-07-22T09:41:00+08:00", sourceLabel: "Victim account", destinationAccountEntityId: "FACT-0471-07", amountMYR: 20000, channel: "FPX", reference: "ref=QC7712", evidenceRefIds: ["EV-TXN-CSV"], evidenceStatus: "reported", provenance: { sourceSystem: "IPRS", sourceRecordId: RPT, artifactId: "ART-TXN", importedAt: AT, locator: { kind: "row", start: 3 }, extractionMethod: "structured_import" }, synthetic: true },
    { id: "TX-0471-04", caseId: CASE, occurredAt: "2026-07-25T16:22:00+08:00", sourceLabel: "Victim account", destinationAccountEntityId: "FACT-0471-08", amountMYR: 25000, channel: "FPX", reference: "ref=QC7712", evidenceRefIds: ["EV-TXN-CSV"], evidenceStatus: "reported", provenance: { sourceSystem: "IPRS", sourceRecordId: RPT, artifactId: "ART-TXN", importedAt: AT, locator: { kind: "row", start: 4 }, extractionMethod: "structured_import" }, synthetic: true },
    { id: "TX-0471-05", caseId: CASE, occurredAt: "2026-07-27T11:09:00+08:00", sourceLabel: "Victim account", destinationAccountEntityId: "FACT-0471-08", amountMYR: 12500, channel: "FPX", reference: "ref=QC7712", evidenceRefIds: ["EV-TXN-CSV"], evidenceStatus: "reported", provenance: { sourceSystem: "IPRS", sourceRecordId: RPT, artifactId: "ART-TXN", importedAt: AT, locator: { kind: "row", start: 5 }, extractionMethod: "structured_import" }, synthetic: true },
    // Downstream: supplied records only.
    { id: "TX-0471-D1", caseId: CASE, occurredAt: "2026-07-23T08:30:00+08:00", sourceLabel: "DEMO-MY-24018", destinationAccountEntityId: "FACT-0471-08", amountMYR: 19000, channel: "IBG", reference: "QC-SETTLE-01", evidenceRefIds: ["EV-TXN-D1"], evidenceStatus: "supported", provenance: { sourceSystem: "IPRS", sourceRecordId: RPT, artifactId: "ART-TXN", importedAt: AT, locator: { kind: "row", start: 6 }, extractionMethod: "structured_import" }, synthetic: true },
    { id: "TX-0471-D2", caseId: CASE, occurredAt: "2026-07-26T10:12:00+08:00", sourceLabel: "DEMO-MY-77105", destinationAccountEntityId: "ACCT-99820", amountMYR: 19500, channel: "IBG", reference: "QC-SETTLE-02", evidenceRefIds: ["EV-TXN-D2"], evidenceStatus: "supported", provenance: { sourceSystem: "IPRS", sourceRecordId: RPT, artifactId: "ART-TXN", importedAt: AT, locator: { kind: "row", start: 7 }, extractionMethod: "structured_import" }, synthetic: true },
    { id: "TX-0471-D3", caseId: CASE, occurredAt: "2026-07-27T15:44:00+08:00", sourceLabel: "DEMO-MY-55431", destinationAccountEntityId: "ACCT-99820", amountMYR: 40500, channel: "IBG", reference: "QC-SETTLE-03", evidenceRefIds: ["EV-TXN-D3"], evidenceStatus: "supported", provenance: { sourceSystem: "IPRS", sourceRecordId: RPT, artifactId: "ART-TXN", importedAt: AT, locator: { kind: "row", start: 8 }, extractionMethod: "structured_import" }, synthetic: true },
  ],
  timeline: [
    { id: "EVT-0471-01", caseId: CASE, occurredAt: "2026-07-16T09:00:00+08:00", eventType: "contact", title: "Iklan dilihat", description: "Pengadu melihat iklan Quantum Crest Capital di media sosial.", evidenceRefIds: ["EV-RPT-L2", "EV-PROMO"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-REPORT-TEXT", "line", 2) },
    { id: "EVT-0471-02", caseId: CASE, occurredAt: "2026-07-16T09:02:00+08:00", eventType: "contact", title: "Hubungan WhatsApp pertama", description: "Daniel Lim menghubungi pengadu melalui 010-000-7712.", evidenceRefIds: ["EV-WA-M01", "EV-RPT-L3"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-WHATSAPP", "message", "M01") },
    { id: "EVT-0471-03", caseId: CASE, occurredAt: "2026-07-17T08:30:00+08:00", eventType: "contact", title: "Menyertai kumpulan VIP", description: "Pengadu ditambah ke kumpulan oleh admin Mei Support; testimoni keuntungan dipaparkan.", evidenceRefIds: ["EV-RPT-L4"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-REPORT-TEXT", "line", 4) },
    { id: "EVT-0471-04", caseId: CASE, occurredAt: "2026-07-18T10:14:00+08:00", eventType: "transfer", title: "Bayaran pertama RM10,000", description: "Pindahan ke DEMO-MY-24018.", evidenceRefIds: ["EV-TXN-CSV", "EV-RPT-L7"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-TXN", "row", 1) },
    { id: "EVT-0471-05", caseId: CASE, occurredAt: "2026-07-19T14:06:00+08:00", eventType: "transfer", title: "Bayaran kedua RM15,000", description: "Pindahan kedua ke DEMO-MY-24018.", evidenceRefIds: ["EV-TXN-CSV"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-TXN", "row", 2) },
    { id: "EVT-0471-06", caseId: CASE, occurredAt: "2026-07-22T09:41:00+08:00", eventType: "transfer", title: "Bayaran ketiga RM20,000", description: "Pindahan ke DEMO-MY-77105 selepas panggilan tier gold.", evidenceRefIds: ["EV-TXN-CSV", "EV-CALL-C07"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-TXN", "row", 3) },
    { id: "EVT-0471-07", caseId: CASE, occurredAt: "2026-07-25T16:22:00+08:00", eventType: "transfer", title: "Bayaran keempat dan kelima", description: "RM25,000 (25/07) dan RM12,500 (27/07) ke DEMO-MY-55431.", evidenceRefIds: ["EV-TXN-CSV"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-TXN", "row", 4) },
    { id: "EVT-0471-08", caseId: CASE, occurredAt: "2026-07-28T09:00:00+08:00", eventType: "claim", title: "Permohonan pengeluaran", description: "Pengadu memohon pengeluaran penuh; diminta yuran pelepasan RM8,000.", evidenceRefIds: ["EV-RPT-L15", "EV-WA-M30"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-REPORT-TEXT", "line", 15) },
    { id: "EVT-0471-09", caseId: CASE, occurredAt: "2026-07-29T09:47:00+08:00", eventType: "report", title: "Laporan iPRS dibuat", description: "Laporan IPRS-DEMO-2026-008721 direkodkan.", evidenceRefIds: ["EV-RPT-L1"], confidence: "high", reviewState: "unreviewed", provenance: iprs("ART-REPORT-SCAN", "region", "header") },
  ],
  evidenceRefs,
  missingInformation: [
    { id: "GAP-0471-01", label: "Pengesahan bank belum diterima", detail: "Bank confirmation for DEMO-MY-24018, DEMO-MY-77105 and DEMO-MY-55431 ownership has not been received. Suggested verification action: submit bank confirmation request." },
    { id: "GAP-0471-02", label: "Maklumat pelanggan telco belum diterima", detail: "Subscriber information for 010-000-7712 and 010-000-4839 not yet obtained. Suggested verification action: submit telco subscriber request." },
    { id: "GAP-0471-03", label: "Penyata penuh akaun hiliran DEMO-MY-99820", detail: "Full downstream statement for DEMO-MY-99820 not in supplied records; RM3,500 of victim funds is not matched to any supplied downstream movement." },
  ],
  contradictions: [
    { id: "CONTRA-0471-01", label: "Percanggahan tarikh pembayaran pertama", detail: "Report narrative line 7 records the first transfer on 18/07/2026 10:14; the officer-entered intake chronology (line 17) records the victim recalling a first payment on 17/07/2026. The supplied transaction CSV supports 18/07/2026. Officer verification required.", evidenceRefIds: ["EV-RPT-L7", "EV-RPT-L17", "EV-TXN-CSV"] },
  ],
  modusOperandi: [
    "Promised guaranteed weekly returns (8-12%)",
    "WhatsApp group with fabricated profit testimonials",
    "Rotating beneficiary accounts with settlement excuses",
    "Final release-fee demand before withdrawal",
    "Tracking reference ref=QC7712 reused across channels",
  ],
};
