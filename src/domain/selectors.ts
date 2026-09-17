import type {
  CaseFact,
  ReviewState,
  TransactionRecord,
  CcisLink,
} from "./contracts";
import { stateHash } from "../services/state-hash";

export interface FactDecision {
  reviewState: ReviewState;
  correctedValue?: string;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export function effectiveFact(fact: CaseFact, d?: FactDecision): CaseFact {
  if (!d) return fact;
  return {
    ...fact,
    reviewState: d.reviewState,
    correctedValue: d.correctedValue,
    reviewNote: d.reviewNote,
    reviewedBy: d.reviewedBy,
    reviewedAt: d.reviewedAt,
    displayValue:
      d.reviewState === "confirmed" && d.correctedValue ? d.correctedValue : fact.displayValue,
  };
}

export function activeFacts(facts: CaseFact[], decisions: Record<string, FactDecision>): CaseFact[] {
  return facts
    .map((f) => effectiveFact(f, decisions[f.id]))
    .filter((f) => f.reviewState !== "rejected");
}

export interface GateCondition {
  id: string;
  labelBM: string;
  labelEN: string;
  met: boolean;
}

// SDS §7.2 gate conditions.
export function ccisGateConditions(
  facts: CaseFact[],
  decisions: Record<string, FactDecision>,
  seededErrorFactId: string,
  ambiguousFactId: string,
): GateCondition[] {
  const eff = (id: string) => {
    const f = facts.find((x) => x.id === id);
    return f ? effectiveFact(f, decisions[f.id]) : undefined;
  };
  const primaryAccount = eff(seededErrorFactId); // FACT-0471-06 is the primary beneficiary account fact (seeded error)
  const loss = eff("FACT-0471-09");
  const seeded = eff(seededErrorFactId);
  const ambiguous = eff(ambiguousFactId);
  const phoneOrDomain = facts
    .filter((f) => ["FACT-0471-04", "FACT-0471-05", "FACT-0471-10"].includes(f.id))
    .map((f) => effectiveFact(f, decisions[f.id]));

  return [
    {
      id: "gate-account",
      labelBM: "Akaun penerima utama disahkan atau diperbetulkan",
      labelEN: "Primary beneficiary account confirmed or corrected",
      met: !!primaryAccount && primaryAccount.reviewState === "confirmed",
    },
    {
      id: "gate-loss",
      labelBM: "Jumlah kerugian dilaporkan disahkan",
      labelEN: "Reported loss total confirmed",
      met: !!loss && loss.reviewState === "confirmed",
    },
    {
      id: "gate-seeded",
      labelBM: "Ekstrakan tidak tepat ditolak atau diperbetulkan",
      labelEN: "Seeded incorrect extraction rejected or corrected",
      met:
        !!seeded &&
        (seeded.reviewState === "rejected" ||
          (seeded.reviewState === "confirmed" && !!seeded.correctedValue)),
    },
    {
      id: "gate-ambiguous",
      labelBM: "Item samar ditanda untuk pengesahan",
      labelEN: "Ambiguous item marked for verification",
      met: !!ambiguous && ambiguous.reviewState === "needs_verification",
    },
    {
      id: "gate-contact",
      labelBM: "Sekurang-kurangnya satu fakta telefon atau domain disemak",
      labelEN: "At least one phone or domain fact reviewed",
      met: phoneOrDomain.some((f) => f.reviewState !== "unreviewed"),
    },
  ];
}

export function gateOpen(conditions: GateCondition[]): boolean {
  return conditions.every((c) => c.met);
}

// --- Money reconciliation ---
export interface MoneyReconciliation {
  reportedMYR: number;
  accountedMYR: number;
  unresolvedMYR: number;
}

export function reconcile(transactions: TransactionRecord[]): MoneyReconciliation {
  const victimTotal = transactions
    .filter((t) => t.sourceLabel === "Victim account")
    .reduce((s, t) => s + t.amountMYR, 0);
  // Accounted = victim funds matched to supplied downstream movement, capped at victim total.
  const downstreamTotal = transactions
    .filter((t) => t.sourceLabel !== "Victim account")
    .reduce((s, t) => s + t.amountMYR, 0);
  const accounted = Math.min(victimTotal, downstreamTotal);
  return { reportedMYR: victimTotal, accountedMYR: accounted, unresolvedMYR: victimTotal - accounted };
}

// --- Similarity labelling (SDS §11.3) ---
export function similarityLabel(score: number): string {
  if (score >= 0.8) return "Strong analytical similarity";
  if (score >= 0.6) return "Moderate analytical similarity";
  return "Weak analytical similarity";
}

export function visibleLinks(links: CcisLink[]): CcisLink[] {
  return links.filter((l) => l.kind === "exact_identifier" || (l.score ?? 0) >= 0.6);
}

// --- Staleness: hash of reviewed state feeding minute sections ---
export function reviewStateHash(
  facts: CaseFact[],
  decisions: Record<string, FactDecision>,
): string {
  const parts = facts
    .map((f) => {
      const d = decisions[f.id];
      return `${f.id}:${d?.reviewState ?? f.reviewState}:${d?.correctedValue ?? ""}`;
    })
    .sort();
  return stateHash(parts.join("|"));
}

export function formatMYR(n: number): string {
  return `RM${n.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`;
}

export const REVIEW_LABELS: Record<ReviewState, { bm: string; en: string }> = {
  unreviewed: { bm: "Belum disemak", en: "Unreviewed" },
  confirmed: { bm: "Disahkan", en: "Confirmed" },
  rejected: { bm: "Ditolak", en: "Rejected" },
  needs_verification: { bm: "Perlu pengesahan", en: "Needs verification" },
};
