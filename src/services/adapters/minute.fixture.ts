import type {
  CitedParagraph,
  InvestigationMinute,
  MinuteGenerationInput,
  MinuteSection,
  MinuteSectionType,
  SectionRegenerationInput,
} from "../../domain/contracts";
import { activeFacts, formatMYR, reconcile } from "../../domain/selectors";
import manifest from "../../fixtures/manifest.json";

export interface MinuteAdapter {
  generate(input: MinuteGenerationInput): InvestigationMinute;
  regenerateSection(input: SectionRegenerationInput, existing: MinuteSection[]): MinuteSection;
}

const TITLES: Record<MinuteSectionType, { bm: string; en: string }> = {
  report_summary: { bm: "Ringkasan Laporan Polis", en: "Summary of Police Report" },
  material_facts: { bm: "Fakta Material Disahkan Pegawai", en: "Material Facts Verified by Officer" },
  chronology: { bm: "Kronologi", en: "Chronology" },
  parties_entities: { bm: "Pihak dan Entiti Terlibat", en: "Parties and Entities Involved" },
  financial_transactions: { bm: "Transaksi Kewangan", en: "Financial Transactions" },
  evidence_received: { bm: "Keterangan Diterima", en: "Evidence Received" },
  investigation_conducted: { bm: "Siasatan Dijalankan", en: "Investigation Conducted" },
  related_indicators: { bm: "Rekod CCIS Berkaitan dan Petunjuk Analitik", en: "Related CCIS Records and Analytical Indicators" },
  outstanding_information: { bm: "Maklumat Tertungtung dan Percanggahan", en: "Outstanding Information and Contradictions" },
  proposed_actions: { bm: "Cadangan Tindakan Seterusnya", en: "Proposed Next Actions" },
  officer_notes: { bm: "Nota Pegawai dan Status Semakan", en: "Officer Notes and Review Status" },
  source_index: { bm: "Indeks Sumber", en: "Source Index" },
};

const ORDER: MinuteSectionType[] = [
  "report_summary",
  "material_facts",
  "chronology",
  "parties_entities",
  "financial_transactions",
  "evidence_received",
  "investigation_conducted",
  "related_indicators",
  "outstanding_information",
  "proposed_actions",
  "officer_notes",
  "source_index",
];

const para = (id: string, text: string, evidenceRefIds: string[] = []): CitedParagraph => ({ id, text, evidenceRefIds });

function sectionContent(type: MinuteSectionType, input: MinuteGenerationInput): CitedParagraph[] {
  const { analysis, reviewDecisions, correctedValues, ccis } = input;
  const decisions = Object.fromEntries(
    Object.entries(reviewDecisions).map(([k, v]) => [
      k,
      { reviewState: v, correctedValue: correctedValues[k] },
    ]),
  );
  const facts = activeFacts(analysis.facts, decisions);
  const confirmed = facts.filter((f) => f.reviewState === "confirmed");
  const needsVer = facts.filter((f) => f.reviewState === "needs_verification");
  const rec = reconcile(analysis.transactions);
  const evidenceFor = (factId: string) => analysis.facts.find((f) => f.id === factId)?.evidenceRefIds ?? [];

  switch (type) {
    case "report_summary":
      return [
        para("p1", `Laporan ${manifest.featuredReportId} (simulasi iPRS) diterima pada 29/07/2026 berkaitan kes ${manifest.featuredCaseId}. Pengadu melaporkan penipuan pelaburan tidak wujud melibatkan kempen "Quantum Crest Capital" dengan kerugian dilaporkan ${formatMYR(rec.reportedMYR)}.`, ["EV-RPT-L1", "EV-RPT-L12"]),
        para("p2", "Kandungan ini adalah ilustrasi berasaskan data sintetik dan memerlukan semakan pegawai."),
      ];
    case "material_facts": {
      const lines = confirmed.length
        ? confirmed.map((f, i) => para(`mf${i}`, `${f.displayValue}.`, f.evidenceRefIds))
        : [para("mf0", "Tiada fakta disahkan setakat ini.")];
      return lines;
    }
    case "chronology":
      return analysis.timeline.map((e, i) => para(`c${i}`, `${e.occurredAt.slice(0, 10)} ${e.occurredAt.slice(11, 16)} — ${e.title}: ${e.description}`, e.evidenceRefIds));
    case "parties_entities": {
      const parties = facts.filter((f) => f.factType === "person_alias");
      const entities = facts.filter((f) => ["organisation", "url", "phone", "bank_account"].includes(f.factType));
      return [
        ...parties.map((f, i) => para(`pe${i}`, `${f.displayValue} — peranan seperti dilaporkan; identiti sebenar memerlukan pengesahan.`, f.evidenceRefIds)),
        ...entities.map((f, i) => para(`pe${i + 10}`, `${f.displayValue}.`, f.evidenceRefIds)),
      ];
    }
    case "financial_transactions": {
      const victimTx = analysis.transactions.filter((t) => t.sourceLabel === "Victim account");
      const downstream = analysis.transactions.filter((t) => t.sourceLabel !== "Victim account");
      return [
        ...victimTx.map((t) => para(`ft-${t.id}`, `${t.occurredAt.slice(0, 10)} — ${formatMYR(t.amountMYR)} ke ${t.destinationAccountEntityId === "FACT-0471-06" ? "DEMO-MY-24018" : t.destinationAccountEntityId === "FACT-0471-07" ? "DEMO-MY-77105" : "DEMO-MY-55431"} melalui ${t.channel} (${t.reference ?? "tiada rujukan"}).`, t.evidenceRefIds)),
        para("ft-sum", `Jumlah dilaporkan: ${formatMYR(rec.reportedMYR)}. Rekod dibekalkan mengambil kira ${formatMYR(rec.accountedMYR)} pergerakan hiliran. ${formatMYR(rec.unresolvedMYR)} tidak dipadankan kepada mana-mana destinasi dalam rekod dibekalkan.`, ["EV-TXN-CSV", "EV-TXN-D1", "EV-TXN-D2", "EV-TXN-D3"]),
        ...downstream.map((t) => para(`ft-${t.id}`, `Hiliran: ${t.occurredAt.slice(0, 10)} — ${formatMYR(t.amountMYR)} dari ${t.sourceLabel} ke ${t.destinationAccountEntityId === "ACCT-99820" ? "DEMO-MY-99820" : "DEMO-MY-55431"} (${t.reference ?? ""}).`, t.evidenceRefIds)),
      ];
    }
    case "evidence_received":
      return [
        para("ev1", "Transkrip WhatsApp (40 mesej, BM/English bercampur).", ["EV-WA-M01"]),
        para("ev2", "Transkrip panggilan bertarikh 21/07/2026.", ["EV-CALL-C07"]),
        para("ev3", "Penyata transaksi CSV — lima pindahan mangsa dan tiga pergerakan hiliran.", ["EV-TXN-CSV"]),
        para("ev4", "Imej promosi pelaburan sintetik.", ["EV-PROMO"]),
        para("ev5", "Representasi imbasan laporan polis.", ["EV-RPT-L1"]),
      ];
    case "investigation_conducted":
      return [
        para("ic1", "Analisis laporan terkomputasi dijalankan; ekstrakan disemak pegawai.", evidenceFor("FACT-0471-09")),
        ...(ccis
          ? [para("ic2", "Semakan silang CCIS (simulasi) dijalankan ke atas identifier telefon, akaun, domain dan rujukan.", ["EV-CCIS-318-1"])]
          : [para("ic2", "Semakan silang CCIS belum dijalankan.")]),
      ];
    case "related_indicators": {
      if (!ccis) return [para("ri0", "Tiada data CCIS dimuatkan.")];
      const exact = ccis.links.filter((l) => l.kind === "exact_identifier");
      const sim = ccis.links.filter((l) => l.kind === "analytical_similarity");
      return [
        ...exact.map((l, i) => para(`ri-e${i}`, `Padanan identifier tepat: ${l.identifierValue} turut muncul dalam ${l.ccisRecordId}. Padanan identifier bukan bukti identiti atau kawalan sama. Pengesahan pegawai diperlukan.`, l.evidenceRefIds)),
        ...sim.map((l, i) => para(`ri-s${i}`, `Petunjuk analitik: skrip kempen dalam ${l.ccisRecordId} menunjukkan keserupaan analitik kuat (skor ilustrasi ${l.score}). Keserupaan bahasa atau taktik tidak membuktikan pengarang, kawalan atau identiti yang sama.`, l.evidenceRefIds)),
      ];
    }
    case "outstanding_information": {
      const gaps = analysis.missingInformation.map((g, i) => para(`og${i}`, `${g.label}: ${g.detail}`));
      const contra = analysis.contradictions.map((c, i) => para(`oc${i}`, `Percanggahan: ${c.label} — ${c.detail}`, c.evidenceRefIds));
      const unverified = needsVer.map((f, i) => para(`ov${i}`, `Petunjuk untuk pengesahan: ${f.displayValue}.`, f.evidenceRefIds));
      return [...gaps, ...contra, ...unverified];
    }
    case "proposed_actions":
      return [
        para("pa1", "Kemukakan permintaan pengesahan bank bagi DEMO-MY-24018, DEMO-MY-77105, DEMO-MY-55431 dan DEMO-MY-99820. (Memerlukan keputusan pegawai)"),
        para("pa2", "Kemukakan permintaan maklumat pelanggan telco bagi 010-000-7712 dan 010-000-4839. (Memerlukan keputusan pegawai)"),
        para("pa3", "Dapatkan penyata penuh akaun hiliran DEMO-MY-99820 bagi menjejak baki RM3,500 yang tidak dipadankan. (Memerlukan keputusan pegawai)"),
        para("pa4", "Sahkan percanggahan tarikh pembayaran pertama dengan pengadu. (Memerlukan keputusan pegawai)"),
      ];
    case "officer_notes":
      return [para("on1", "Draf ilustrasi dijana daripada keadaan semakan semasa. Status semakan direkodkan dalam ruangan status.")];
    case "source_index": {
      const ids = new Set<string>();
      for (const s of ORDER) {
        if (s === "source_index") continue;
        for (const p of sectionContent(s, input)) p.evidenceRefIds.forEach((e) => ids.add(e));
      }
      return [...ids].sort().map((id, i) => {
        const ref = [...analysis.evidenceRefs, ...(ccis?.additionalEvidenceRefs ?? [])].find((r) => r.id === id);
        return para(`si${i}`, `${id} — ${ref ? `${ref.artifactId} · ${ref.excerpt.slice(0, 90)}` : "rujukan keterangan"}`);
      });
    }
  }
}

function buildSection(type: MinuteSectionType, input: MinuteGenerationInput): MinuteSection {
  return {
    id: `sec-${type}`,
    sectionType: type,
    titleBM: TITLES[type].bm,
    titleEN: TITLES[type].en,
    content: sectionContent(type, input),
    stale: false,
    sourceStateHash: input.stateHash,
  };
}

export const minuteFixtureAdapter: MinuteAdapter = {
  generate(input) {
    return {
      id: `MIN-${manifest.featuredCaseId}`,
      caseId: input.caseId,
      templateVersion: "illustrative-1.0",
      version: 1,
      status: "draft",
      generatedAt: new Date().toISOString(),
      generatedBy: "demo-officer",
      sections: ORDER.map((t) => buildSection(t, input)),
      comments: [],
      syntheticNotice:
        "Synthetic demonstration data. AI output is for investigative support and requires human verification. It is not a finding of fact, identity or guilt.",
      templateNotice:
        "Illustrative Minit Kertas Siasatan format, subject to validation by JSJK. Draft content requires officer review and approval.",
    };
  },
  regenerateSection(input, _existing) {
    void _existing;
    return buildSection(input.sectionType, input);
  },
};
