import { Activity, Archive, BrainCircuit, Database, FileText, Fingerprint, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import { useDemoStore } from "../../state/demo-store";
import { SourceBadge } from "../shared/SourceBadge";

const ARCH_LAYERS = [
  {
    title: "Source systems",
    detail: "iPRS, CCIS, bank confirmations and digital forensic artefacts.",
    icon: Database,
  },
  {
    title: "Secure gateway",
    detail: "Controlled read access, field mapping, audit capture and policy checks.",
    icon: LockKeyhole,
  },
  {
    title: "Case workspace",
    detail: "Report review, fact verification, intelligence graph and draft minit.",
    icon: FileText,
  },
  {
    title: "AI support layer",
    detail: "Extraction, enrichment suggestions, relationship mapping and draft generation.",
    icon: BrainCircuit,
  },
] as const;

const CONTROL_ITEMS = [
  "PDRM-controlled deployment boundary",
  "RBAC, audit trail and data-retention policy",
  "Human approval at fact review and draft minit status",
  "Model, prompt and template version tracking",
];

const LIMIT_ITEMS = [
  "No production backend, database, queue or object storage in this prototype.",
  "No live OCR, live AI model call or measured model accuracy.",
  "Browser audit events are workflow aids, not official evidence records.",
  "Real integration requires security accreditation and API validation.",
];

function actionLabel(action: string) {
  return action.replaceAll("_", " ");
}

export function ArchitecturePage() {
  const auditEvents = useDemoStore((s) => s.auditEvents);
  const recentEvents = [...auditEvents].reverse().slice(0, 8);

  return (
    <div className="page architecture-page">
      <div className="page-title-row">
        <div>
          <h1>Senibina &amp; Audit</h1>
          <p className="lede">Pandangan ringkas tentang integrasi, kawalan keselamatan dan jejak audit sesi.</p>
        </div>
      </div>

      <section className="panel architecture-hero">
        <div>
          <span>Target operating model</span>
          <h2>Controlled case-intelligence workspace for JSJK review</h2>
          <p>
            The prototype separates source systems, secure integration, officer review, AI support and audit capture so
            each generated output remains traceable to its supporting inputs.
          </p>
        </div>
        <div className="architecture-health">
          <ShieldCheck size={20} aria-hidden />
          <strong>Human approval required</strong>
          <span>Fact review, draft minit status and any write-back remain officer-controlled.</span>
        </div>
      </section>

      <section className="architecture-summary-grid" aria-label="Architecture summary">
        <article className="panel architecture-kpi">
          <span>Source systems</span>
          <strong>4</strong>
          <p>iPRS, CCIS, bank and forensic sources</p>
        </article>
        <article className="panel architecture-kpi">
          <span>Approval gates</span>
          <strong>3</strong>
          <p>fact review, intelligence use and draft minit</p>
        </article>
        <article className="panel architecture-kpi">
          <span>Audit events</span>
          <strong>{auditEvents.length}</strong>
          <p>captured in this browser session</p>
        </article>
      </section>

      <section className="panel architecture-flow-panel">
        <div className="architecture-section-head">
          <div>
            <span>System architecture</span>
            <h2>How data moves through the case workspace</h2>
          </div>
        </div>

        <div className="architecture-layer-row">
          {ARCH_LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <article className="architecture-layer-card" key={layer.title}>
                <div className="architecture-layer-icon"><Icon size={18} aria-hidden /></div>
                <h3>{layer.title}</h3>
                <p>{layer.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="architecture-detail-grid">
        <section className="panel">
          <div className="architecture-section-head">
            <div>
              <span>Integration scope</span>
              <h2>Read-only source alignment</h2>
            </div>
          </div>

          <div className="architecture-integration-list">
            <article>
              <SourceBadge system="IPRS" />
              <div>
                <strong>Police reports, metadata and attachments</strong>
                <p>Primary source for intake, extraction and officer verification.</p>
              </div>
              <em>Read only</em>
            </article>
            <article>
              <SourceBadge system="CCIS" />
              <div>
                <strong>Commercial-crime intelligence records</strong>
                <p>Supports exact identifier matching and related-case indicators.</p>
              </div>
              <em>Read only</em>
            </article>
          </div>
        </section>

        <aside className="panel architecture-control-panel">
          <div className="architecture-section-head">
            <div>
              <span>Controls</span>
              <h2>Required safeguards</h2>
            </div>
          </div>
          <div className="architecture-check-list">
            {CONTROL_ITEMS.map((item) => (
              <span key={item}><Fingerprint size={14} aria-hidden /> {item}</span>
            ))}
          </div>
        </aside>
      </div>

      <div className="architecture-detail-grid">
        <section className="panel architecture-limit-panel">
          <div className="architecture-section-head">
            <div>
              <span>Implementation limits</span>
              <h2>What this prototype does not prove</h2>
            </div>
          </div>
          <div className="architecture-limit-list">
            {LIMIT_ITEMS.map((item) => (
              <article key={item}>
                <Archive size={15} aria-hidden />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel architecture-audit-panel">
          <div className="architecture-section-head">
            <div>
              <span>Audit system</span>
              <h2>Recent session activity</h2>
            </div>
          </div>

          {recentEvents.length ? (
            <div className="architecture-audit-list">
              {recentEvents.map((event) => (
                <article key={event.id}>
                  <Activity size={15} aria-hidden />
                  <div>
                    <strong>{actionLabel(event.action)}</strong>
                    <p>{event.targetType}:{event.targetId}</p>
                  </div>
                  <time>{event.occurredAt.slice(0, 16).replace("T", " ")}</time>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-review architecture-empty">
              <Network size={28} aria-hidden />
              <strong>No session audit events yet</strong>
              <p>Workflow actions will appear here after the officer reviews facts, opens intelligence or saves draft status.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
