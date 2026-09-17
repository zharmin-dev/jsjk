import type { CcisEnrichmentResult, EvidenceReference } from "../../domain/contracts";

const CASE = "JSJK-DEMO-2026-0471";
const AT = "2026-07-30T09:00:00+08:00";

const ccisProv = (recordId: string) => ({
  sourceSystem: "CCIS" as const,
  sourceRecordId: recordId,
  importedAt: AT,
  extractionMethod: "structured_import" as const,
});

const ccisEvidence: EvidenceReference[] = [
  { id: "EV-CCIS-318-1", artifactId: "CCIS-DEMO-IP-2026-0318", locator: { kind: "line", start: 4 }, excerpt: "Kes 0318: hubungan melalui nombor 010-000-7712 oleh individu memperkenalkan diri sebagai 'advisor' pelaburan." },
  { id: "EV-CCIS-386-1", artifactId: "CCIS-DEMO-IP-2026-0386", locator: { kind: "line", start: 6 }, excerpt: "Kes 0386: pindahan mangsa ke akaun DEMO-MY-55431; portal quantum-crest.example dipaparkan kepada mangsa." },
  { id: "EV-CCIS-442-1", artifactId: "CCIS-DEMO-IP-2026-0442", locator: { kind: "line", start: 3 }, excerpt: "Skrip kempen 0442: 'AI-assisted trading, pulangan 8-12% seminggu, capital protection. ref=QC7712'" },
  { id: "EV-CCIS-442-2", artifactId: "CCIS-DEMO-IP-2026-0442", locator: { kind: "line", start: 5 }, excerpt: "Kes 0442: kumpulan WhatsApp menggunakan testimoni keuntungan palsu dan tuntutan yuran pelepasan akhir." },
];

export const ccisEnrichment: CcisEnrichmentResult = {
  caseId: CASE,
  records: [
    {
      recordId: "CCIS-DEMO-IP-2026-0318",
      title: "Investment approach via shared phone identifier",
      year: 2026,
      status: "Open (synthetic record)",
      summary:
        "Synthetic CCIS record: report received March 2026 describing contact from 010-000-7712 offering an AI-assisted investment scheme. The phone identifier matches the featured case. Identifier match does not establish identity or common control.",
      synthetic: true,
    },
    {
      recordId: "CCIS-DEMO-IP-2026-0386",
      title: "Victim transfers to DEMO-MY-55431",
      year: 2026,
      status: "Open (synthetic record)",
      summary:
        "Synthetic CCIS record: report received May 2026; victim transfers to account DEMO-MY-55431 with the portal quantum-crest.example shown to the victim. Exact account and domain identifiers appear in both records.",
      synthetic: true,
    },
    {
      recordId: "CCIS-DEMO-IP-2026-0442",
      title: "Quantum Crest campaign script with ref=QC7712",
      year: 2026,
      status: "Closed — referred (synthetic record)",
      summary:
        "Synthetic CCIS record: June 2026 report describing a 'Quantum Crest' investment campaign script containing the tracking reference ref=QC7712, guaranteed weekly returns and a final release-fee demand. Strong analytical similarity to the featured case narrative.",
      synthetic: true,
    },
  ],
  links: [
    {
      id: "LINK-EXACT-PHONE",
      ccisRecordId: "CCIS-DEMO-IP-2026-0318",
      kind: "exact_identifier",
      identifierType: "phone",
      identifierValue: "010-000-7712",
      matchedExcerptA: "…dihubungi individu menggunakan nama Daniel Lim melalui WhatsApp 010-000-7712. (IPRS-DEMO-2026-008721)",
      matchedExcerptB: "…contact from 010-000-7712 offering an AI-assisted investment scheme. (CCIS-DEMO-IP-2026-0318)",
      rationale:
        "Exact phone identifier 010-000-7712 appears in both records. An exact identifier match is not proof that the same person used the number.",
      evidenceRefIds: ["EV-RPT-L3", "EV-CCIS-318-1"],
    },
    {
      id: "LINK-EXACT-ACCOUNT",
      ccisRecordId: "CCIS-DEMO-IP-2026-0386",
      kind: "exact_identifier",
      identifierType: "bank_account",
      identifierValue: "DEMO-MY-55431",
      matchedExcerptA: "25/07/2026 — RM25,000 ke DEMO-MY-55431. (IPRS-DEMO-2026-008721)",
      matchedExcerptB: "…victim transfers to account DEMO-MY-55431… (CCIS-DEMO-IP-2026-0386)",
      rationale:
        "Exact account identifier DEMO-MY-55431 appears in both records. Requires officer verification before operational use.",
      evidenceRefIds: ["EV-TXN-CSV", "EV-CCIS-386-1"],
    },
    {
      id: "LINK-EXACT-DOMAIN",
      ccisRecordId: "CCIS-DEMO-IP-2026-0386",
      kind: "exact_identifier",
      identifierType: "url",
      identifierValue: "quantum-crest.example",
      matchedExcerptA: "Portal pelaburan yang ditunjukkan ialah quantum-crest.example. (IPRS-DEMO-2026-008721)",
      matchedExcerptB: "…portal quantum-crest.example dipaparkan kepada mangsa. (CCIS-DEMO-IP-2026-0386)",
      rationale: "Exact domain identifier quantum-crest.example appears in both records.",
      evidenceRefIds: ["EV-RPT-L13", "EV-CCIS-386-1"],
    },
    {
      id: "LINK-SIM-MO",
      ccisRecordId: "CCIS-DEMO-IP-2026-0442",
      kind: "analytical_similarity",
      identifierType: "transaction_reference",
      identifierValue: "ref=QC7712",
      score: 0.83,
      scoreComponents: { textSimilarity: 0.88, sharedTacticScore: 0.9, temporalProximity: 0.62, channelMatch: 0.7 },
      matchedExcerptA: "Pakej pemula RM10,000… Rujukan ref=QC7712. Pulangan 8-12% seminggu. (IPRS-DEMO-2026-008721)",
      matchedExcerptB: "'AI-assisted trading, pulangan 8-12% seminggu, capital protection. ref=QC7712' (CCIS-DEMO-IP-2026-0442)",
      rationale:
        "Strong analytical similarity: shared campaign script language, shared urgency tactic and shared tracking reference. Similarity indicates shared language or tactics; it does not establish common authorship, control or identity. Weights are illustrative and unvalidated.",
      evidenceRefIds: ["EV-WA-M09", "EV-PROMO", "EV-CCIS-442-1", "EV-CCIS-442-2"],
    },
  ],
  additionalFacts: [
    {
      id: "FACT-CCIS-01",
      caseId: CASE,
      factType: "phone",
      displayValue: "010-000-7712 also appears in CCIS-DEMO-IP-2026-0318",
      normalisedValue: "0100007712",
      confidence: "high",
      confidenceScore: 0.99,
      reviewState: "unreviewed",
      evidenceRefIds: ["EV-CCIS-318-1"],
      provenance: { ...ccisProv("CCIS-DEMO-IP-2026-0318"), locator: { kind: "line", start: 4 } },
    },
    {
      id: "FACT-CCIS-02",
      caseId: CASE,
      factType: "bank_account",
      displayValue: "DEMO-MY-55431 also appears in CCIS-DEMO-IP-2026-0386",
      normalisedValue: "DEMO-MY-55431",
      confidence: "high",
      confidenceScore: 0.99,
      reviewState: "unreviewed",
      evidenceRefIds: ["EV-CCIS-386-1"],
      provenance: { ...ccisProv("CCIS-DEMO-IP-2026-0386"), locator: { kind: "line", start: 6 } },
    },
    {
      id: "FACT-CCIS-03",
      caseId: CASE,
      factType: "modus_operandi",
      displayValue: "Campaign script in CCIS-DEMO-IP-2026-0442 shows strong analytical similarity (0.83, illustrative)",
      confidence: "medium",
      confidenceScore: 0.83,
      reviewState: "needs_verification",
      evidenceRefIds: ["EV-CCIS-442-1", "EV-CCIS-442-2"],
      provenance: { ...ccisProv("CCIS-DEMO-IP-2026-0442"), locator: { kind: "line", start: 3 } },
    },
  ],
  additionalEvidenceRefs: ccisEvidence,
};
