import type { GraphPayload, GraphNode, RelationshipEdge } from "../../domain/contracts";

const CASE = "JSJK-DEMO-2026-0471";
const RPT = "IPRS-DEMO-2026-008721";
const AT = "2026-07-29T10:00:00+08:00";

const pIprs = (artifactId: string) => ({
  sourceSystem: "IPRS" as const,
  sourceRecordId: RPT,
  artifactId,
  importedAt: AT,
  extractionMethod: "structured_import" as const,
});
const pCcis = (recordId: string) => ({
  sourceSystem: "CCIS" as const,
  sourceRecordId: recordId,
  importedAt: "2026-07-30T09:00:00+08:00",
  extractionMethod: "structured_import" as const,
});

const evtNode = (
  n: number, id: string, label: string, occurred: string, evidenceRefIds: string[], x: number,
): GraphNode => ({
  id,
  nodeType: "activity_event",
  label,
  sublabel: occurred,
  sourceBadges: ["IPRS"],
  verificationState: "confirmed",
  evidenceRefIds,
  position: { x, y: 120 + (n % 2) * 90 },
});

const evtEdge = (a: string, b: string, id: string): RelationshipEdge => ({
  id,
  sourceId: a,
  targetId: b,
  linkType: "MENTIONED_IN",
  label: "kemudian",
  evidenceRefIds: [],
  assessment: "fact",
  rationale: "Urutan kronologi daripada rekod yang dibekalkan.",
  verificationState: "confirmed",
  provenance: [pIprs("ART-TXN")],
  visibleIn: ["activity"],
});

// --- Activity Trail (9 events, left to right) ---
export const activityGraph: GraphPayload = {
  caseId: CASE,
  view: "activity",
  nodes: [
    evtNode(0, "EVT-0471-01", "Iklan dilihat", "16 Jul 09:00", ["EV-RPT-L2", "EV-PROMO"], 0),
    evtNode(1, "EVT-0471-02", "Hubungan WhatsApp pertama", "16 Jul 09:02", ["EV-WA-M01"], 220),
    evtNode(2, "EVT-0471-03", "Menyertai kumpulan VIP", "17 Jul 08:30", ["EV-RPT-L4"], 440),
    evtNode(3, "EVT-0471-04", "Bayaran RM10,000", "18 Jul 10:14", ["EV-TXN-CSV"], 660),
    evtNode(4, "EVT-0471-05", "Bayaran RM15,000", "19 Jul 14:06", ["EV-TXN-CSV"], 880),
    evtNode(5, "EVT-0471-06", "Bayaran RM20,000", "22 Jul 09:41", ["EV-TXN-CSV", "EV-CALL-C07"], 1100),
    evtNode(6, "EVT-0471-07", "Bayaran RM25,000 + RM12,500", "25-27 Jul", ["EV-TXN-CSV"], 1320),
    evtNode(7, "EVT-0471-08", "Pengeluaran + tuntutan yuran", "28 Jul 09:00", ["EV-RPT-L15", "EV-WA-M30"], 1540),
    evtNode(8, "EVT-0471-09", "Laporan iPRS dibuat", "29 Jul 09:47", ["EV-RPT-L1"], 1760),
  ],
  edges: [
    evtEdge("EVT-0471-01", "EVT-0471-02", "AE-01"),
    evtEdge("EVT-0471-02", "EVT-0471-03", "AE-02"),
    evtEdge("EVT-0471-03", "EVT-0471-04", "AE-03"),
    evtEdge("EVT-0471-04", "EVT-0471-05", "AE-04"),
    evtEdge("EVT-0471-05", "EVT-0471-06", "AE-05"),
    evtEdge("EVT-0471-06", "EVT-0471-07", "AE-06"),
    evtEdge("EVT-0471-07", "EVT-0471-08", "AE-07"),
    evtEdge("EVT-0471-08", "EVT-0471-09", "AE-08"),
  ],
  generatedFromStateHash: "fixture",
};

// --- Relationship Map before CCIS (iPRS facts only) ---
const relBaseNodes: GraphNode[] = [
  { id: "N-RPT", nodeType: "police_report", label: RPT, sublabel: "Laporan iPRS (simulasi)", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-RPT-L1"], position: { x: 420, y: 40 } },
  { id: "N-VICTIM", nodeType: "person_alias", label: "Nur Aina Rahman", sublabel: "Pengadu (samaran sintetik)", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-RPT-L1"], position: { x: 60, y: 220 } },
  { id: "N-DANIEL", nodeType: "person_alias", label: "Daniel Lim", sublabel: "Nama samaran 'advisor' dilaporkan", sourceBadges: ["IPRS"], verificationState: "unreviewed", evidenceRefIds: ["EV-RPT-L3"], position: { x: 760, y: 180 } },
  { id: "N-MEI", nodeType: "person_alias", label: "Mei Support", sublabel: "Nama samaran admin kumpulan", sourceBadges: ["IPRS"], verificationState: "unreviewed", evidenceRefIds: ["EV-RPT-L4"], position: { x: 780, y: 360 } },
  { id: "N-PHONE1", nodeType: "phone", label: "010-000-7712", sublabel: "Telefon dilaporkan", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-RPT-L3"], position: { x: 520, y: 300 } },
  { id: "N-PHONE2", nodeType: "phone", label: "010-000-4839", sublabel: "Telefon admin dilaporkan", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-RPT-L4"], position: { x: 560, y: 480 } },
  { id: "N-ACCT1", nodeType: "bank_account", label: "DEMO-MY-24018", sublabel: "Akaun penerima 1", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-RPT-L6"], position: { x: 220, y: 420 } },
  { id: "N-ACCT2", nodeType: "bank_account", label: "DEMO-MY-77105", sublabel: "Akaun penerima 2", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-TXN-CSV"], position: { x: 240, y: 560 } },
  { id: "N-ACCT3", nodeType: "bank_account", label: "DEMO-MY-55431", sublabel: "Akaun penerima 3", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-TXN-CSV"], position: { x: 60, y: 560 } },
  { id: "N-DOMAIN", nodeType: "url_domain", label: "quantum-crest.example", sublabel: "Portal dilaporkan", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-RPT-L13", "EV-PROMO"], position: { x: 420, y: 640 } },
  { id: "N-QCC", nodeType: "organisation", label: "Quantum Crest Capital", sublabel: "Nama kempen (bukan entiti disahkan)", sourceBadges: ["IPRS"], verificationState: "unreviewed", evidenceRefIds: ["EV-RPT-L2", "EV-PROMO"], position: { x: 700, y: 620 } },
  { id: "N-REF", nodeType: "evidence", label: "ref=QC7712", sublabel: "Rujukan penjejakan", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-WA-M09", "EV-PROMO"], position: { x: 920, y: 480 } },
];

const relBaseEdges: RelationshipEdge[] = [
  { id: "RE-01", sourceId: "N-VICTIM", targetId: "N-RPT", linkType: "MENTIONED_IN", label: "pengadu dalam", evidenceRefIds: ["EV-RPT-L1"], assessment: "fact", rationale: "Pengadu direkodkan dalam laporan.", verificationState: "confirmed", provenance: [pIprs("ART-REPORT-TEXT")], visibleIn: ["relationship"] },
  { id: "RE-02", sourceId: "N-DANIEL", targetId: "N-PHONE1", linkType: "USES", label: "menggunakan (dilaporkan)", evidenceRefIds: ["EV-RPT-L3"], assessment: "fact", rationale: "Laporan mengaitkan nama samaran dengan nombor telefon.", verificationState: "confirmed", provenance: [pIprs("ART-REPORT-TEXT")], visibleIn: ["relationship"] },
  { id: "RE-03", sourceId: "N-MEI", targetId: "N-PHONE2", linkType: "USES", label: "menggunakan (dilaporkan)", evidenceRefIds: ["EV-RPT-L4"], assessment: "fact", rationale: "Laporan mengaitkan admin kumpulan dengan nombor telefon.", verificationState: "confirmed", provenance: [pIprs("ART-REPORT-TEXT")], visibleIn: ["relationship"] },
  { id: "RE-04", sourceId: "N-VICTIM", targetId: "N-ACCT1", linkType: "TRANSFERRED_TO", label: "RM25,000 (2 pindahan)", evidenceRefIds: ["EV-TXN-CSV"], assessment: "fact", rationale: "Dua pindahan mangsa dalam CSV yang dibekalkan.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["relationship"] },
  { id: "RE-05", sourceId: "N-VICTIM", targetId: "N-ACCT2", linkType: "TRANSFERRED_TO", label: "RM20,000", evidenceRefIds: ["EV-TXN-CSV"], assessment: "fact", rationale: "Pindahan mangsa dalam CSV.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["relationship"] },
  { id: "RE-06", sourceId: "N-VICTIM", targetId: "N-ACCT3", linkType: "TRANSFERRED_TO", label: "RM37,500 (2 pindahan)", evidenceRefIds: ["EV-TXN-CSV"], assessment: "fact", rationale: "Dua pindahan mangsa dalam CSV.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["relationship"] },
  { id: "RE-07", sourceId: "N-DANIEL", targetId: "N-QCC", linkType: "MENTIONED_IN", label: "memperkenalkan diri sebagai advisor", evidenceRefIds: ["EV-WA-M01"], assessment: "fact", rationale: "Mesej WhatsApp memperkenalkan nama samaran sebagai advisor kempen.", verificationState: "unreviewed", provenance: [pIprs("ART-WHATSAPP")], visibleIn: ["relationship"] },
  { id: "RE-08", sourceId: "N-QCC", targetId: "N-DOMAIN", linkType: "USES", label: "portal dipromosikan", evidenceRefIds: ["EV-PROMO"], assessment: "fact", rationale: "Iklan memaparkan domain kempen.", verificationState: "confirmed", provenance: [pIprs("ART-PROMO")], visibleIn: ["relationship"] },
  { id: "RE-09", sourceId: "N-QCC", targetId: "N-REF", linkType: "USES", label: "rujukan penjejakan", evidenceRefIds: ["EV-WA-M09", "EV-PROMO"], assessment: "fact", rationale: "ref=QC7712 muncul dalam mesej dan iklan.", verificationState: "confirmed", provenance: [pIprs("ART-PROMO")], visibleIn: ["relationship"] },
  { id: "RE-10", sourceId: "N-DANIEL", targetId: "N-MEI", linkType: "REQUIRES_VERIFICATION", label: "koordinasi disyaki — pengesahan pegawai diperlukan", evidenceRefIds: ["EV-WA-M36"], assessment: "analytical_indicator", rationale: "Kedua-dua nama samaran aktif dalam kumpulan yang sama; hubungan sebenar tidak disahkan.", verificationState: "needs_verification", provenance: [pIprs("ART-WHATSAPP")], visibleIn: ["relationship"] },
];

const relCcisNodes: GraphNode[] = [
  { id: "N-CCIS-318", nodeType: "ccis_case", label: "CCIS-DEMO-IP-2026-0318", sublabel: "Rekod CCIS (simulasi)", sourceBadges: ["CCIS"], verificationState: "needs_verification", evidenceRefIds: ["EV-CCIS-318-1"], position: { x: 980, y: 120 } },
  { id: "N-CCIS-386", nodeType: "ccis_case", label: "CCIS-DEMO-IP-2026-0386", sublabel: "Rekod CCIS (simulasi)", sourceBadges: ["CCIS"], verificationState: "needs_verification", evidenceRefIds: ["EV-CCIS-386-1"], position: { x: 180, y: 760 } },
  { id: "N-CCIS-442", nodeType: "ccis_case", label: "CCIS-DEMO-IP-2026-0442", sublabel: "Rekod CCIS (simulasi)", sourceBadges: ["CCIS"], verificationState: "needs_verification", evidenceRefIds: ["EV-CCIS-442-1"], position: { x: 860, y: 760 } },
];

const relCcisEdges: RelationshipEdge[] = [
  { id: "RE-C1", sourceId: "N-PHONE1", targetId: "N-CCIS-318", linkType: "EXACT_MATCH", label: "Padanan tepat: 010-000-7712", evidenceRefIds: ["EV-RPT-L3", "EV-CCIS-318-1"], assessment: "fact", rationale: "Identifier telefon yang sama muncul dalam kedua-dua rekod. Bukan bukti individu sama.", verificationState: "needs_verification", provenance: [pIprs("ART-REPORT-TEXT"), pCcis("CCIS-DEMO-IP-2026-0318")], visibleIn: ["relationship"] },
  { id: "RE-C2", sourceId: "N-ACCT3", targetId: "N-CCIS-386", linkType: "EXACT_MATCH", label: "Padanan tepat: DEMO-MY-55431", evidenceRefIds: ["EV-TXN-CSV", "EV-CCIS-386-1"], assessment: "fact", rationale: "Akaun yang sama muncul dalam kedua-dua rekod.", verificationState: "needs_verification", provenance: [pIprs("ART-TXN"), pCcis("CCIS-DEMO-IP-2026-0386")], visibleIn: ["relationship"] },
  { id: "RE-C3", sourceId: "N-DOMAIN", targetId: "N-CCIS-386", linkType: "EXACT_MATCH", label: "Padanan tepat: quantum-crest.example", evidenceRefIds: ["EV-RPT-L13", "EV-CCIS-386-1"], assessment: "fact", rationale: "Domain yang sama muncul dalam kedua-dua rekod.", verificationState: "needs_verification", provenance: [pIprs("ART-REPORT-TEXT"), pCcis("CCIS-DEMO-IP-2026-0386")], visibleIn: ["relationship"] },
  { id: "RE-C4", sourceId: "N-QCC", targetId: "N-CCIS-442", linkType: "SIMILAR_MO", label: "Keserupaan analitik kuat (0.83, ilustrasi) + ref=QC7712", score: 0.83, evidenceRefIds: ["EV-WA-M09", "EV-CCIS-442-1", "EV-CCIS-442-2"], assessment: "analytical_indicator", rationale: "Skrip kempen, taktik desakan dan rujukan penjejakan serupa. Keserupaan tidak membuktikan pengarang, kawalan atau identiti sama.", verificationState: "needs_verification", provenance: [pIprs("ART-PROMO"), pCcis("CCIS-DEMO-IP-2026-0442")], visibleIn: ["relationship"] },
];

export const relationshipGraphBefore: GraphPayload = {
  caseId: CASE,
  view: "relationship",
  nodes: relBaseNodes,
  edges: relBaseEdges,
  generatedFromStateHash: "fixture",
};

export const relationshipGraphAfter: GraphPayload = {
  caseId: CASE,
  view: "relationship",
  nodes: [...relBaseNodes, ...relCcisNodes],
  edges: [...relBaseEdges, ...relCcisEdges],
  generatedFromStateHash: "fixture",
};

// --- Money Trail ---
export const moneyGraph: GraphPayload = {
  caseId: CASE,
  view: "money",
  nodes: [
    { id: "M-VICTIM", nodeType: "person_alias", label: "Akaun mangsa", sublabel: "Nur Aina Rahman (samaran)", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-TXN-CSV"], position: { x: 40, y: 240 } },
    { id: "M-24018", nodeType: "bank_account", label: "DEMO-MY-24018", sublabel: "Terima RM25,000", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-TXN-CSV"], position: { x: 340, y: 80 } },
    { id: "M-77105", nodeType: "bank_account", label: "DEMO-MY-77105", sublabel: "Terima RM20,000", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-TXN-CSV"], position: { x: 340, y: 240 } },
    { id: "M-55431", nodeType: "bank_account", label: "DEMO-MY-55431", sublabel: "Terima RM37,500", sourceBadges: ["IPRS"], verificationState: "confirmed", evidenceRefIds: ["EV-TXN-CSV"], position: { x: 340, y: 420 } },
    { id: "M-99820", nodeType: "bank_account", label: "DEMO-MY-99820", sublabel: "Akaun hiliran dalam rekod", sourceBadges: ["IPRS"], verificationState: "needs_verification", evidenceRefIds: ["EV-TXN-D2", "EV-TXN-D3"], position: { x: 680, y: 240 } },
    { id: "M-UNRESOLVED", nodeType: "unresolved", label: "RM3,500 tidak selesai", sublabel: "Tiada destinasi dalam rekod dibekalkan", sourceBadges: ["AI_DERIVED"], verificationState: "needs_verification", evidenceRefIds: [], rationale: "Beza antara RM82,500 dilaporkan dan RM79,000 pergerakan hiliran direkodkan. Tiada destinasi direka.", position: { x: 680, y: 480 } },
  ],
  edges: [
    { id: "ME-01", sourceId: "M-VICTIM", targetId: "M-24018", linkType: "TRANSFERRED_TO", label: "RM25,000 (TX-0471-01, 02)", evidenceRefIds: ["EV-TXN-CSV"], assessment: "fact", rationale: "Dua pindahan FPX mangsa.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["money"] },
    { id: "ME-02", sourceId: "M-VICTIM", targetId: "M-77105", linkType: "TRANSFERRED_TO", label: "RM20,000 (TX-0471-03)", evidenceRefIds: ["EV-TXN-CSV"], assessment: "fact", rationale: "Pindahan FPX mangsa.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["money"] },
    { id: "ME-03", sourceId: "M-VICTIM", targetId: "M-55431", linkType: "TRANSFERRED_TO", label: "RM37,500 (TX-0471-04, 05)", evidenceRefIds: ["EV-TXN-CSV"], assessment: "fact", rationale: "Dua pindahan FPX mangsa.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["money"] },
    { id: "ME-04", sourceId: "M-24018", targetId: "M-55431", linkType: "TRANSFERRED_TO", label: "RM19,000 (TX-0471-D1)", evidenceRefIds: ["EV-TXN-D1"], assessment: "fact", rationale: "Pergerakan hiliran dalam rekod dibekalkan.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["money"] },
    { id: "ME-05", sourceId: "M-77105", targetId: "M-99820", linkType: "TRANSFERRED_TO", label: "RM19,500 (TX-0471-D2)", evidenceRefIds: ["EV-TXN-D2"], assessment: "fact", rationale: "Pergerakan hiliran dalam rekod dibekalkan.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["money"] },
    { id: "ME-06", sourceId: "M-55431", targetId: "M-99820", linkType: "TRANSFERRED_TO", label: "RM40,500 (TX-0471-D3)", evidenceRefIds: ["EV-TXN-D3"], assessment: "fact", rationale: "Pergerakan hiliran dalam rekod dibekalkan.", verificationState: "confirmed", provenance: [pIprs("ART-TXN")], visibleIn: ["money"] },
    { id: "ME-07", sourceId: "M-VICTIM", targetId: "M-UNRESOLVED", linkType: "REQUIRES_VERIFICATION", label: "RM3,500 tidak dipadankan", evidenceRefIds: [], assessment: "analytical_indicator", rationale: "RM82,500 dilaporkan tolak RM79,000 direkodkan hiliran. Destinasi tidak diketahui daripada rekod dibekalkan.", verificationState: "needs_verification", provenance: [pIprs("ART-TXN")], visibleIn: ["money"] },
  ],
  generatedFromStateHash: "fixture",
};
