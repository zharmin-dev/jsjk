import type { SourceSystem } from "../../domain/contracts";

const MAP: Record<SourceSystem, { cls: string; label: string }> = {
  IPRS: { cls: "badge-iprs", label: "iPRS" },
  CCIS: { cls: "badge-ccis", label: "CCIS" },
  AI_DERIVED: { cls: "badge-ai", label: "AI Extracted" },
  OFFICER_ENTERED: { cls: "badge-officer", label: "Officer Entered" },
  EVIDENCE: { cls: "badge-evidence", label: "Evidence" },
};

export function SourceBadge({ system }: { system: SourceSystem }) {
  const m = MAP[system];
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}

export function ReviewTag({ state }: { state: string }) {
  const labels: Record<string, string> = {
    unreviewed: "Belum disemak",
    confirmed: "Disahkan",
    rejected: "Ditolak",
    needs_verification: "Perlu pengesahan",
  };
  return <span className={`tag tag-${state}`}>{labels[state] ?? state}</span>;
}
