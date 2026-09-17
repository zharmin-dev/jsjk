// Deterministic short delays for simulated services. Skip-friendly.
export const ANALYSIS_STAGES = [
  { id: "received", labelBM: "Dokumen diterima", labelEN: "Document received", durationMs: 500 },
  { id: "ocr", labelBM: "Teks OCR disediakan", labelEN: "OCR text prepared", durationMs: 700 },
  { id: "extract", labelBM: "Entiti dan transaksi diekstrak", labelEN: "Entities and transactions extracted", durationMs: 900 },
  { id: "timeline", labelBM: "Kronologi dibina", labelEN: "Timeline constructed", durationMs: 600 },
  { id: "classify", labelBM: "Jenis penipuan dan taktik dikelaskan", labelEN: "Scam type and tactics classified", durationMs: 700 },
  { id: "gaps", labelBM: "Maklumat hilang dikenal pasti", labelEN: "Missing information identified", durationMs: 600 },
] as const;

export const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
