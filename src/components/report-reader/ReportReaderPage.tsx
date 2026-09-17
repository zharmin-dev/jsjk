import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, FileText, Sparkles, Search, Network, Map, ClipboardCheck } from "lucide-react";
import {
  extractedSampleFacts,
  policeReportSample,
  policeTransactions,
  type SampleFact,
} from "../../fixtures/sample-documents";
import { useDemoStore } from "../../state/demo-store";

const STEPS = [
  { id: 1, title: "iPRS Intake", description: "Police report and attachments received.", icon: FileText },
  { id: 2, title: "Fact Extraction", description: "AI structures key facts from the report.", icon: Sparkles },
  { id: 3, title: "Officer Verification", description: "Officer confirms or flags extracted facts.", icon: Search },
  { id: 4, title: "CCIS Enrichment", description: "Cross-reference identifiers and MO patterns.", icon: Network },
  { id: 5, title: "Visual Intelligence", description: "Map activity, relationships and money trail.", icon: Map },
  { id: 6, title: "Draft Minit Prepared", description: "Verified facts support the draft minute.", icon: ClipboardCheck },
] as const;

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

function StatusChip({ fact }: { fact: SampleFact }) {
  return <span className={`review-chip ${fact.status === "confirmed" ? "confirmed" : ""}`}>{fact.status === "confirmed" ? "Disahkan" : "Menunggu semakan"}</span>;
}

export function ReportReaderPage() {
  const [facts, setFacts] = useState<SampleFact[]>(extractedSampleFacts);
  const [extracted, setExtracted] = useState(false);
  const navigate = useNavigate();
  const store = useDemoStore();

  const confirmedCount = facts.filter((fact) => fact.status === "confirmed").length;
  const allConfirmed = confirmedCount === facts.length;
  const currentStep = !extracted ? 2 : allConfirmed ? (store.ccisEnriched ? 5 : 4) : 3;

  const primaryAction = useMemo(() => {
    if (!extracted) {
      return {
        label: "Extract facts from report",
        help: "Run extraction once. The page will then show the facts that need officer verification.",
        onClick: () => {
          setExtracted(true);
          store.runAnalysis();
        },
      };
    }
    if (!allConfirmed) {
      return {
        label: "Confirm all key facts",
        help: `${confirmedCount} of ${facts.length} key facts confirmed.`,
        onClick: () => setFacts((items) => items.map((item) => ({ ...item, status: "confirmed" }))),
      };
    }
    if (!store.ccisEnriched) {
      return {
        label: "Run CCIS enrichment",
        help: "Confirmed identifiers are ready for cross-reference.",
        onClick: () => store.enrichCcis(),
      };
    }
    return {
      label: "Open visual intelligence",
      help: "Continue to the activity, relationship and money-trail view.",
      onClick: () => navigate("/intelligence"),
    };
  }, [allConfirmed, confirmedCount, extracted, facts.length, navigate, store]);

  function confirmFact(id: string) {
    setFacts((items) => items.map((item) => (item.id === id ? { ...item, status: "confirmed" } : item)));
  }

  return (
    <div className="page report-review-page">
      <div className="page-title-row">
        <div>
          <h1>Pembaca Laporan &amp; Pengesahan Fakta</h1>
          <p className="lede">
            {policeReportSample.reportNo} · {policeReportSample.category} · {policeReportSample.loss}
          </p>
        </div>
      </div>

      <MultiStepProgress currentStep={currentStep} />

      <section className="panel report-action-panel">
        <div>
          <span>Next action</span>
          <h2>{primaryAction.label}</h2>
          <p>{primaryAction.help}</p>
        </div>
        <button className="btn-primary" onClick={primaryAction.onClick}>{primaryAction.label}</button>
      </section>

      <div className="report-review-grid">
        <section className="panel document-panel">
          <div className="document-tabs" role="tablist" aria-label="Source document">
            <button className="active" role="tab" aria-selected="true">
              Laporan Polis
            </button>
          </div>

          <article className="document-view">
            <header>
              <span>POLIS DIRAJA MALAYSIA</span>
              <h2>Salinan Laporan Polis</h2>
              <p>{policeReportSample.reportNo}</p>
            </header>
            <dl className="document-meta">
              <div><dt>Tarikh / Masa</dt><dd>{policeReportSample.date} · {policeReportSample.time}</dd></div>
              <div><dt>Tempat laporan</dt><dd>{policeReportSample.station}</dd></div>
              <div><dt>Pengadu</dt><dd>{policeReportSample.complainant}</dd></div>
              <div><dt>Kerugian</dt><dd>{policeReportSample.loss}</dd></div>
              <div><dt>Akaun penerima</dt><dd>{policeReportSample.recipientBank} · {policeReportSample.recipientAccount}</dd></div>
              <div><dt>Nama penerima</dt><dd>{policeReportSample.recipientName}</dd></div>
            </dl>
            <h3>Keterangan Pengaduan</h3>
            <ol className="document-lines">
              {policeReportSample.narrative.map((line) => <li key={line}>{line}</li>)}
            </ol>
            <h3>Rekod Transaksi Yang Dilaporkan</h3>
            <table className="data">
              <thead><tr><th>Tarikh / masa</th><th>Penerima</th><th>Akaun</th><th>Amaun</th></tr></thead>
              <tbody>
                {policeTransactions.map((tx) => (
                  <tr key={tx.id}><td>{tx.occurredAt}</td><td>{tx.recipient}</td><td>{tx.account}</td><td>{tx.amount}</td></tr>
                ))}
              </tbody>
            </table>
          </article>
        </section>

        <aside className="panel fact-review-panel">
          <h2>{extracted ? "Officer Verification" : "Fact Extraction"}</h2>
          {!extracted ? (
            <div className="empty-review">
              <Sparkles size={28} aria-hidden />
              <strong>Facts have not been extracted yet</strong>
              <p>Start with the button above. Extracted facts will appear here for officer confirmation.</p>
            </div>
          ) : (
            <>
              <div className="review-summary">
                <strong>{confirmedCount}/{facts.length}</strong>
                <span>facts confirmed</span>
              </div>
              <div className="fact-review-list">
                {facts.map((fact) => (
                  <article className="sample-fact-card" key={fact.id}>
                    <div>
                      <span>{fact.label}</span>
                      <strong>{fact.value}</strong>
                      <p>{fact.source} · Confidence {fact.confidence}</p>
                    </div>
                    <div className="sample-fact-actions">
                      <StatusChip fact={fact} />
                      {fact.status !== "confirmed" && <button onClick={() => confirmFact(fact.id)}>Sahkan</button>}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
