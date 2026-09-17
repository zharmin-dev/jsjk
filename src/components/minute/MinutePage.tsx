import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ClipboardCheck, Download, FileText, Map, Network, Search, Sparkles } from "lucide-react";
import { chargeMinuteSample, policeReportSample } from "../../fixtures/sample-documents";
import { useDemoStore } from "../../state/demo-store";
import { BasicDropdown, type DropdownItem } from "../shared/BasicDropdown";
import { downloadChargeMinutePdf } from "./chargeMinutePdf";

const STEPS = [
  { id: 1, title: "iPRS Intake", description: "Police report and attachments received.", icon: FileText },
  { id: 2, title: "Fact Extraction", description: "AI structures key facts from the report.", icon: Sparkles },
  { id: 3, title: "Officer Verification", description: "Officer confirms or flags extracted facts.", icon: Search },
  { id: 4, title: "CCIS Enrichment", description: "Cross-reference identifiers and MO patterns.", icon: Network },
  { id: 5, title: "Visual Intelligence", description: "Map activity, relationships and money trail.", icon: Map },
  { id: 6, title: "Draft Minit Prepared", description: "Verified facts support the draft minute.", icon: ClipboardCheck },
] as const;

const DRAFT_STATUS_ITEMS: DropdownItem<string>[] = [
  { id: "Draf untuk semakan pegawai", label: "Draf untuk semakan pegawai" },
  { id: "Perlu pindaan", label: "Perlu pindaan" },
  { id: "Sedia untuk kelulusan", label: "Sedia untuk kelulusan" },
];

function MultiStepProgress({ currentStep }: { currentStep: number }) {
  return (
    <section className="multi-step" aria-label="Case processing progress">
      <div className="multi-step-track" aria-hidden>
        <span style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
      </div>
      {STEPS.map((step) => {
        const Icon = step.icon;
        const state = step.id < currentStep ? "complete" : step.id === currentStep ? "active" : "waiting";
        return (
          <article className={`multi-step-item ${state}`} key={step.id}>
            <div className="multi-step-dot">
              {state === "complete" ? <Check size={16} aria-hidden /> : <Icon size={16} aria-hidden />}
            </div>
            <div>
              <span>Step {step.id}</span>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function MinutePage() {
  const navigate = useNavigate();
  const analysisRun = useDemoStore((s) => s.analysisRun);
  const ccisEnriched = useDemoStore((s) => s.ccisEnriched);
  const minuteReady = analysisRun && ccisEnriched;
  const currentStep = !analysisRun ? 2 : !ccisEnriched ? 4 : 6;
  const [status, setStatus] = useState("Draf untuk semakan pegawai");
  const [savedStatus, setSavedStatus] = useState(status);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const hasUnsavedStatus = status !== savedStatus;

  function saveDraftStatus() {
    setSavedStatus(status);
    setSavedAt(new Date().toLocaleString("en-MY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }));
  }

  return (
    <div className="page minute-output-page">
      <div className="page-title-row">
        <div>
          <h1>Cadangan Pertuduhan</h1>
          <p className="lede">
            {policeReportSample.reportNo} · {chargeMinuteSample.section}
          </p>
        </div>
      </div>

      <MultiStepProgress currentStep={currentStep} />

      <section className="panel report-action-panel">
        <div>
          <span>{minuteReady ? "Step 6 output" : "Pending inputs"}</span>
          <h2>{minuteReady ? "Draft minit prepared from verified intelligence" : "Draft minit not yet prepared"}</h2>
          <p>
            {minuteReady
              ? "This page is the output after intake, extraction, officer verification, CCIS enrichment and visual intelligence review."
              : "The charge recommendation is drafted only after fact extraction, officer verification and CCIS enrichment are complete."}
          </p>
        </div>
        <button onClick={() => navigate("/intelligence")}>Back to intelligence</button>
      </section>

      {!minuteReady ? (
        <section className="panel">
          <div className="empty-review">
            <ClipboardCheck size={28} aria-hidden />
            <strong>{!analysisRun ? "Fact extraction not run" : "CCIS enrichment not run"}</strong>
            <p>
              {!analysisRun
                ? "Extract and verify the report facts first. The draft minit is built from verified facts."
                : "Run CCIS enrichment to complete the cross-case checks cited in the draft minit."}
            </p>
            <button className="btn-primary" onClick={() => navigate("/report")}>
              {!analysisRun ? "Open report review" : "Run CCIS enrichment in report review"}
            </button>
          </div>
        </section>
      ) : (
      <div className="minute-output-grid">
        <section className="panel document-panel">
          <article className="document-view charge-document">
            <header>
              <span>CADANGAN PERTUDUHAN</span>
              <h2>{chargeMinuteSample.title}</h2>
              <p>{chargeMinuteSample.section}</p>
            </header>

            <dl className="document-meta">
              <div><dt>No. laporan</dt><dd>{policeReportSample.reportNo}</dd></div>
              <div><dt>Status</dt><dd>{savedStatus}</dd></div>
              <div><dt>Klasifikasi</dt><dd>{chargeMinuteSample.classification}</dd></div>
              <div><dt>Orang Kena Tuduh</dt><dd>{chargeMinuteSample.suspect}</dd></div>
            </dl>

            <h3>Cadangan</h3>
            <p>{chargeMinuteSample.recommendation}</p>

            <h3>Bukti Sokongan</h3>
            <ul className="document-lines compact">
              {chargeMinuteSample.evidence.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <h3>Sebelum Pertuduhan</h3>
            <p>{chargeMinuteSample.beforeCharge}</p>
          </article>
        </section>

        <aside className="panel minute-side-panel">
          <h2>Semakan pegawai</h2>
          <label>
            Status draf
            <BasicDropdown
              label="Status draf"
              items={DRAFT_STATUS_ITEMS}
              value={status}
              onChange={(item) => setStatus(item.id)}
            />
          </label>
          <button className="btn-primary minute-save-button" disabled={!hasUnsavedStatus} onClick={saveDraftStatus}>
            Save draft status
          </button>
          <p className={`minute-save-note ${hasUnsavedStatus ? "unsaved" : ""}`} role="status">
            {hasUnsavedStatus
              ? "Status changed. Save to update the draft document."
              : savedAt
                ? `Draft status saved on ${savedAt}.`
                : "Current draft status is saved."}
          </p>

          <button
            className="minute-download-button"
            disabled={savedStatus !== "Sedia untuk kelulusan"}
            onClick={downloadChargeMinutePdf}
          >
            <Download size={14} aria-hidden /> Muat turun PDF
          </button>
          <p className="minute-save-note" role="status">
            {savedStatus === "Sedia untuk kelulusan"
              ? "Minit cadangan pertuduhan sedia dimuat turun sebagai PDF."
              : 'Tetapkan status kepada "Sedia untuk kelulusan" dan simpan untuk memuat turun PDF.'}
          </p>

          <div className="minute-checklist">
            <strong>Input yang digunakan</strong>
            <span><Check size={14} aria-hidden /> Laporan polis iPRS</span>
            <span><Check size={14} aria-hidden /> Fakta disahkan pegawai</span>
            <span><Check size={14} aria-hidden /> Padanan CCIS dan rekod bank</span>
            <span><Check size={14} aria-hidden /> Peta hubungan dan aliran wang</span>
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}
