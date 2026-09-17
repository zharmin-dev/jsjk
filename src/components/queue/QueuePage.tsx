import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Banknote, CheckCircle2, Clock3, FileText, ShieldAlert, Users } from "lucide-react";
import type { IprsQueueItem } from "../../domain/contracts";
import { iprsFixtureAdapter } from "../../services/adapters/iprs.fixture";
import { useDemoStore } from "../../state/demo-store";
import manifest from "../../fixtures/manifest.json";
import { policeReportSample } from "../../fixtures/sample-documents";

const CASE_META: Record<string, { priority: "Tinggi" | "Sederhana" | "Rendah"; stage: string; next: string; flags: string[] }> = {
  "JSJK-DEMO-2026-0471": {
    priority: "Tinggi",
    stage: "Step 2 - Fact extraction",
    next: "Buka kemajuan kes",
    flags: ["RM48.75k", "Akaun Bank Alfa", "CCIS belum"],
  },
  "JSJK-DEMO-2026-0455": {
    priority: "Sederhana",
    stage: "Semakan pegawai",
    next: "Menunggu semakan",
    flags: ["Pembelian dalam talian", "Dokumen belum lengkap"],
  },
  "JSJK-DEMO-2026-0441": {
    priority: "Sederhana",
    stage: "Analisis awal",
    next: "Semakan fakta",
    flags: ["Penyamaran", "Nombor telefon dikenal pasti"],
  },
};

const STATUS_LABEL = {
  received: "Diterima",
  analysed: "Dianalisis",
  in_review: "Dalam semakan",
  enriched: "Diperkaya",
} as const;

function caseNo(item: IprsQueueItem) {
  return item.caseId.replace("JSJK-DEMO", "CM");
}

function formatMYR(amount: number) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function receivedDate(value: string) {
  return new Intl.DateTimeFormat("ms-MY", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function daysOpen(value: string) {
  const today = new Date("2026-08-12T00:00:00+08:00").getTime();
  const received = new Date(value).getTime();
  return Math.max(0, Math.ceil((today - received) / 86_400_000));
}

function displayLocation(value: string) {
  return value.replace("Demo Utara", "Daerah Utara").replace("Demo Selatan", "Daerah Selatan");
}

function displayOfficer(value: string) {
  return value.replace("Insp. Demo Officer (synthetic)", "Insp. Khairul Anuar").replace("Sjn. Demo Analyst (synthetic)", "Sjn. Hafiz Rahman");
}

export function QueuePage() {
  const [queue, setQueue] = useState<IprsQueueItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const analysisRun = useDemoStore((s) => s.analysisRun);
  const ccisEnriched = useDemoStore((s) => s.ccisEnriched);
  const navigate = useNavigate();

  useEffect(() => {
    iprsFixtureAdapter.getQueue().then(setQueue).catch((e) => setError(String(e)));
  }, []);

  if (error) return <div className="page"><div className="notice-inline">{error}</div></div>;
  if (!queue) return <div className="page"><p>Memuatkan baris gilir…</p></div>;

  const featured = queue.find((q) => q.reportId === manifest.featuredReportId)!;
  const featuredMeta = CASE_META[featured.caseId]!;
  const totalLoss = queue.reduce((sum, item) => sum + item.reportedLossMYR, 0);
  const pendingReview = queue.filter((item) => item.reviewStatus !== "complete").length;
  const oldestAge = Math.max(...queue.map((item) => daysOpen(item.receivedAt)));

  return (
    <div className="page queue-page">
      <div className="page-title-row">
        <div>
          <h1>Papan Pemuka</h1>
          <p className="lede">Baris giliran kes, risiko awal dan tugasan yang memerlukan tindakan pegawai.</p>
        </div>
        <button>Eksport</button>
      </div>

      <div className="kpi-row">
        <div className="kpi rich"><FileText size={17} aria-hidden /><div><div className="lbl">Aduan terbuka</div><div className="num">{queue.length}</div></div></div>
        <div className="kpi rich"><Banknote size={17} aria-hidden /><div><div className="lbl">Jumlah kerugian</div><div className="num">{formatMYR(totalLoss)}</div></div></div>
        <div className="kpi rich"><Clock3 size={17} aria-hidden /><div><div className="lbl">Kes paling lama</div><div className="num danger">{oldestAge} hari</div></div></div>
        <div className="kpi rich"><Users size={17} aria-hidden /><div><div className="lbl">Perlu semakan</div><div className="num">{pendingReview}</div></div></div>
      </div>

      <section className="panel queue-featured-case">
        <div className="featured-copy">
          <span className="queue-eyebrow">Kes keutamaan</span>
          <h2>{caseNo(featured)} · {featured.scamCategory}</h2>
          <p>{policeReportSample.complainant} melaporkan kerugian {policeReportSample.loss} melibatkan {policeReportSample.recipientBank} {policeReportSample.recipientAccount}.</p>
          <div className="queue-chip-row">
            {featuredMeta.flags.map((flag) => <span key={flag}>{flag}</span>)}
          </div>
        </div>
        <div className="featured-status">
          <strong>{featuredMeta.stage}</strong>
          <span>Diterima {receivedDate(featured.receivedAt)} · {displayOfficer(featured.assignedOfficer)}</span>
          <button className="btn-primary" onClick={() => navigate("/workflow")}>
            {featuredMeta.next} <ArrowRight size={14} aria-hidden />
          </button>
        </div>
      </section>

      <div className="queue-layout-grid">
        <section className="panel queue-cases-panel">
          <div className="queue-section-head">
            <div>
              <span>Baris giliran iPRS</span>
              <h2>Kes memerlukan tindakan</h2>
            </div>
            <button className="text-action" onClick={() => navigate("/workflow")}>Buka kemajuan kes ›</button>
          </div>
          <div className="queue-case-list">
            {queue.map((q, index) => (
              <article className="queue-case-card" key={q.reportId}>
                <div className="case-main">
                  <span className={`priority ${CASE_META[q.caseId]?.priority === "Tinggi" ? "high" : ""}`}>{CASE_META[q.caseId]?.priority ?? "Sederhana"}</span>
                  <strong>{caseNo(q)}</strong>
                  <p>{q.scamCategory} · {displayLocation(q.location)}</p>
                  <div className="queue-chip-row">
                    <span>{formatMYR(q.reportedLossMYR)}</span>
                    <span>{daysOpen(q.receivedAt)} hari</span>
                    <span>{displayOfficer(q.assignedOfficer)}</span>
                  </div>
                </div>
                <div className="case-side">
                  <span className={`queue-stage ${index === 0 ? "active" : ""}`}>{STATUS_LABEL[q.processingStatus]}</span>
                  <small>{CASE_META[q.caseId]?.stage}</small>
                  {q.reportId === featured.reportId ? (
                    <button className="status-pill primary" onClick={() => navigate("/workflow")}>Buka kes</button>
                  ) : (
                    <span className={`status-pill ${index === 1 ? "outline" : "muted"}`}>
                      {index === 1 ? "Dirujuk" : "Semakan"}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="queue-side-stack">
          <section className="panel queue-next-actions">
            <h2>Tindakan hari ini</h2>
            <div className="queue-action-list">
              <article>
                <ShieldAlert size={16} aria-hidden />
                <div><strong>Sahkan akaun penerima</strong><span>Bank Alfa 1234 5644 3200</span></div>
              </article>
              <article>
                <AlertTriangle size={16} aria-hidden />
                <div><strong>Semak hubungan B1 dan Riz</strong><span>Perlu rujukan nota forensik H1</span></div>
              </article>
              <article>
                <CheckCircle2 size={16} aria-hidden />
                <div><strong>Teruskan ke kemajuan kes</strong><span>Gunakan paparan kes untuk langkah seterusnya</span></div>
              </article>
            </div>
            <button className="btn-primary" onClick={() => navigate("/workflow")}>Buka Kemajuan Kes</button>
          </section>

          <section className="panel queue-coverage-panel">
            <h2>Petunjuk operasi</h2>
            <div className="mini-stat-grid">
              <div><strong>{analysisRun ? "3/6" : "1/6"}</strong><span>Langkah selesai</span></div>
              <div><strong>{ccisEnriched ? "Aktif" : "Belum"}</strong><span>CCIS enrichment</span></div>
              <div><strong>4</strong><span>Tugas sokongan</span></div>
            </div>
          </section>

          <section className="panel">
            <h2>Ringkasan dokumen · {caseNo(featured)}</h2>
            <div className="document-signal-grid">
              <div><strong>12</strong><span>Dokumen kes</span></div>
              <div><strong>8</strong><span>Fakta diekstrak</span></div>
              <div><strong>3</strong><span>Transaksi dilaporkan</span></div>
              <div><strong>424B</strong><span>Seksyen dicadangkan</span></div>
            </div>
            <button className="text-action" onClick={() => navigate("/report")}>Buka semakan laporan ›</button>
          </section>
        </aside>
      </div>
    </div>
  );
}
