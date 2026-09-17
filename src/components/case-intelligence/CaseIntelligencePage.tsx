import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Check, FileText, Sparkles, Search, Network, Map, ClipboardCheck } from "lucide-react";
import { chargeMinuteSample, policeReportSample } from "../../fixtures/sample-documents";
import { useDemoStore } from "../../state/demo-store";
import { BasicDropdown, type DropdownItem } from "../shared/BasicDropdown";
import { layoutGraph } from "./layoutGraph";

type IntelligenceView = "relationship" | "money" | "cases";
type IntelligenceSource = "IPRS" | "BANK" | "DEVICE" | "CCIS" | "TELCO" | "AI";
type VerificationState = "confirmed" | "needs_verification" | "indicator";

interface IntelLocation {
  lat: number;
  lng: number;
  towerId: string;
  address: string;
  district: string;
  state: string;
  share: string;
}

interface IntelNode {
  id: string;
  label: string;
  sublabel: string;
  kind: string;
  source: IntelligenceSource;
  status: VerificationState;
  view: IntelligenceView[];
  variant?: "metric" | "note" | "map";
  timestamp?: string;
  location?: IntelLocation;
  stats?: Array<{ label: string; value: string; delta?: string }>;
  details: string[];
}

interface IntelEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  sourceSystem: IntelligenceSource;
  status: VerificationState;
  score?: number;
  view: IntelligenceView[];
  details: string;
}

interface IntelNodeData extends Record<string, unknown> {
  label: string;
  sublabel: string;
  source: IntelligenceSource;
  kind: string;
  status: VerificationState;
  variant: "metric" | "note" | "map";
  timestamp?: string;
  location?: IntelLocation;
  stats?: Array<{ label: string; value: string; delta?: string }>;
}

const STEPS = [
  { id: 1, title: "iPRS Intake", icon: FileText },
  { id: 2, title: "Fact Extraction", icon: Sparkles },
  { id: 3, title: "Officer Verification", icon: Search },
  { id: 4, title: "CCIS Enrichment", icon: Network },
  { id: 5, title: "Visual Intelligence", icon: Map },
  { id: 6, title: "Draft Minit Prepared", icon: ClipboardCheck },
] as const;

const SOURCE_LABEL: Record<IntelligenceSource, string> = {
  IPRS: "iPRS",
  BANK: "Bank",
  DEVICE: "Digital forensics",
  CCIS: "CCIS",
  TELCO: "Telco",
  AI: "AI indicator",
};

const NODE_COLOR: Record<IntelligenceSource, string> = {
  IPRS: "#010044",
  BANK: "#0f766e",
  DEVICE: "#6d5bd0",
  CCIS: "#b45309",
  TELCO: "#1d4ed8",
  AI: "#64748b",
};

const STATUS_LABEL: Record<VerificationState, string> = {
  confirmed: "Confirmed",
  needs_verification: "Needs verification",
  indicator: "Analytical indicator",
};

const SOURCE_ICON: Record<IntelligenceSource, string> = {
  IPRS: "IR",
  BANK: "BK",
  DEVICE: "DF",
  CCIS: "CC",
  TELCO: "TC",
  AI: "AI",
};

const INTEL_NODES: IntelNode[] = [
  {
    id: "report",
    label: policeReportSample.reportNo,
    sublabel: "Police report received",
    kind: "Report",
    source: "IPRS",
    status: "confirmed",
    view: ["relationship", "cases"],
    timestamp: "05/07 1045",
    stats: [
      { label: "Date", value: "05/07/26" },
      { label: "Loss", value: "RM48.75k" },
      { label: "Docs", value: "12" },
    ],
    details: [
      `${policeReportSample.category}`,
      `Reported loss: ${policeReportSample.loss}`,
      `Station: ${policeReportSample.station}`,
    ],
  },
  {
    id: "victim",
    label: policeReportSample.complainant,
    sublabel: "A1 / complainant",
    kind: "Person",
    source: "IPRS",
    status: "confirmed",
    view: ["relationship", "money"],
    stats: [
      { label: "Role", value: "A1" },
      { label: "Age", value: "34" },
      { label: "Items", value: "3" },
    ],
    details: [`Phone: ${policeReportSample.phone}`, "Submitted receipts, WhatsApp screenshots and website screenshots."],
  },
  {
    id: "whatsapp",
    label: policeReportSample.scamContact,
    sublabel: "WhatsApp contact",
    kind: "Contact",
    source: "IPRS",
    status: "confirmed",
    view: ["relationship", "cases"],
    timestamp: "05/07 0915",
    stats: [
      { label: "First msg", value: "0915" },
      { label: "Channel", value: "WA" },
      { label: "Status", value: "Open" },
    ],
    details: ["First contact at approximately 0915 on 05/07/2026.", "Introduced as customer service for an investment platform."],
  },
  {
    id: "website",
    label: policeReportSample.website,
    sublabel: "Investment website",
    kind: "URL",
    source: "IPRS",
    status: "confirmed",
    view: ["relationship", "cases"],
    variant: "note",
    timestamp: "05/07 0920",
    details: ["Used to display alleged profits.", "Withdrawal was blocked after the third transfer."],
  },
  {
    id: "b1",
    label: chargeMinuteSample.suspect,
    sublabel: "B1 / account holder",
    kind: "Person",
    source: "BANK",
    status: "needs_verification",
    view: ["relationship", "money"],
    stats: [
      { label: "Role", value: "B1" },
      { label: "Paid", value: "RM800" },
      { label: "Risk", value: "High" },
    ],
    details: [
      "Registered owner of Bank Alfa Berhad account 1234 5644 3200.",
      "Cadangan pertuduhan sample states B1 admitted handing over debit card, PIN, online banking ID and OTP phone to Riz.",
    ],
  },
  {
    id: "account",
    label: "Bank Alfa 1234 5644 3200",
    sublabel: "Recipient account",
    kind: "Bank account",
    source: "BANK",
    status: "confirmed",
    view: ["relationship", "money", "cases"],
    stats: [
      { label: "Credits", value: "3" },
      { label: "Total", value: "RM48.75k" },
      { label: "Out", value: "32m" },
    ],
    details: [
      "Received three transfers totalling RM48,750.00.",
      "Bank review in the sample minute says funds moved out within 32 minutes.",
    ],
  },
  {
    id: "riz",
    label: "Riz",
    sublabel: "Identity pending",
    kind: "Person of interest",
    source: "DEVICE",
    status: "needs_verification",
    view: ["relationship"],
    stats: [
      { label: "ID", value: "Pending" },
      { label: "Link", value: "B1" },
      { label: "Proof", value: "Chat" },
    ],
    details: [
      "Telegram conversation with B1 contains account handover phrases.",
      "Full identity remains under investigation.",
    ],
  },
  {
    id: "device",
    label: "H1 Orbis X2",
    sublabel: "Seized phone",
    kind: "Evidence",
    source: "DEVICE",
    status: "confirmed",
    view: ["relationship"],
    stats: [
      { label: "Item", value: "H1" },
      { label: "Chat", value: "Found" },
      { label: "OTP", value: "Seen" },
    ],
    details: [
      "Forensic analysis found Telegram conversation between B1 and Riz.",
      "Conversation includes debit card image, online banking details and RM800 confirmation.",
    ],
  },
  {
    id: "bts",
    label: "BTS Taman Pertama",
    sublabel: "Estimated suspect area",
    kind: "Telco base station",
    source: "TELCO",
    status: "indicator",
    view: ["relationship"],
    variant: "map",
    location: {
      lat: 3.1120,
      lng: 101.7290,
      towerId: "BTS-KUL-0412",
      address: "Jalan Cheras, Taman Pertama, 56100 Kuala Lumpur",
      district: "Cheras",
      state: "Wilayah Persekutuan Kuala Lumpur",
      share: "72%",
    },
    details: [
      "Telco CDR sample: 013-333 2300 connected to tower BTS-KUL-0412 in 72% of observed sessions between 03/07/2026 and 06/07/2026.",
      "Tower address: Jalan Cheras, Taman Pertama, 56100 Kuala Lumpur (Cheras, Wilayah Persekutuan Kuala Lumpur).",
      "BTS coverage gives an area estimate, not a precise position. Requires telco confirmation before operational use.",
    ],
  },
  {
    id: "tx1",
    label: "RM15,000.00",
    sublabel: "First transfer",
    kind: "Transaction",
    source: "BANK",
    status: "confirmed",
    view: ["money"],
    timestamp: "05/07 0928",
    stats: [
      { label: "Seq", value: "T1" },
      { label: "Amount", value: "RM15k" },
    ],
    details: ["First transfer from A1 to Bank Alfa account 1234 5644 3200."],
  },
  {
    id: "tx2",
    label: "RM18,750.00",
    sublabel: "Second transfer",
    kind: "Transaction",
    source: "BANK",
    status: "confirmed",
    view: ["money"],
    timestamp: "05/07 0947",
    stats: [
      { label: "Seq", value: "T2" },
      { label: "Amount", value: "RM18.75k" },
    ],
    details: ["Second transfer from A1 to Bank Alfa account 1234 5644 3200."],
  },
  {
    id: "tx3",
    label: "RM15,000.00",
    sublabel: "Third transfer",
    kind: "Transaction",
    source: "BANK",
    status: "confirmed",
    view: ["money"],
    timestamp: "05/07 1002",
    stats: [
      { label: "Seq", value: "T3" },
      { label: "Amount", value: "RM15k" },
    ],
    details: ["Third transfer from A1 to Bank Alfa account 1234 5644 3200."],
  },
  {
    id: "outflow",
    label: "Two downstream accounts",
    sublabel: "Moved out within 32 minutes",
    kind: "Money trail",
    source: "AI",
    status: "needs_verification",
    view: ["money"],
    variant: "note",
    timestamp: "05/07 1034",
    details: ["Exact downstream account identifiers require bank confirmation before operational use."],
  },
  {
    id: "case318",
    label: "CCIS-DEMO-IP-2026-0318",
    sublabel: "Related report · phone match",
    kind: "Related case",
    source: "CCIS",
    status: "confirmed",
    view: ["cases"],
    stats: [
      { label: "Year", value: "2026" },
      { label: "Loss", value: "RM36k" },
      { label: "Status", value: "Open" },
    ],
    details: [
      "CCIS record: report received March 2026 describing contact from 013-333 2300 offering an AI-assisted investment scheme.",
      "Matched excerpt (this case): contacted through WhatsApp 013-333 2300 introducing an investment platform.",
      "Matched excerpt (0318): contact from 013-333 2300 offering an AI-assisted investment scheme.",
      "Identifier match does not establish identity or common control.",
    ],
  },
  {
    id: "case386",
    label: "CCIS-DEMO-IP-2026-0386",
    sublabel: "Related report · account + website match",
    kind: "Related case",
    source: "CCIS",
    status: "confirmed",
    view: ["cases"],
    stats: [
      { label: "Year", value: "2026" },
      { label: "Loss", value: "RM42.5k" },
      { label: "Status", value: "Open" },
    ],
    details: [
      "CCIS record: report received May 2026; victim transferred to Bank Alfa account 1234 5644 3200 with the portal invest-pro-demo.example shown to the victim.",
      "Exact account and domain identifiers appear in both reports.",
      "Requires officer verification before operational use.",
    ],
  },
  {
    id: "case442",
    label: "CCIS-DEMO-IP-2026-0442",
    sublabel: "Related report · similar MO",
    kind: "Related case",
    source: "CCIS",
    status: "indicator",
    view: ["cases"],
    stats: [
      { label: "Year", value: "2026" },
      { label: "Loss", value: "RM12.7k" },
      { label: "Status", value: "Referred" },
    ],
    details: [
      "CCIS record: June 2026 report describing an investment campaign script with guaranteed weekly returns and a final release-fee demand.",
      "Analytical similarity 0.83 (text similarity 0.88, shared tactics 0.90, temporal proximity 0.62).",
      "Similarity indicates shared language or tactics; it does not establish common authorship, control or identity.",
    ],
  },
  {
    id: "combined",
    label: "Combined loss RM91,200",
    sublabel: "3 related reports · 03–06/07/2026",
    kind: "Cross-case indicator",
    source: "AI",
    status: "indicator",
    view: ["cases"],
    variant: "note",
    details: [
      "Combined reported loss across the three related reports: RM91,200.00.",
      "Figure is an analytical aggregate for intelligence support, not a verified charge amount.",
    ],
  },
];

const INTEL_EDGES: IntelEdge[] = [
  { id: "e1", source: "report", target: "whatsapp", label: "reports contact", sourceSystem: "IPRS", status: "confirmed", score: 0.96, view: ["relationship", "cases"], details: "The police report records initial contact through WhatsApp." },
  { id: "e2", source: "whatsapp", target: "website", label: "sends link", sourceSystem: "IPRS", status: "confirmed", score: 0.91, view: ["relationship", "cases"], details: "The contact sent the investment platform URL to the complainant." },
  { id: "e3", source: "victim", target: "account", label: "transfers RM48,750", sourceSystem: "BANK", status: "confirmed", score: 0.98, view: ["relationship", "money"], details: "Three reported transfers total RM48,750.00." },
  { id: "e4", source: "account", target: "b1", label: "registered to", sourceSystem: "BANK", status: "confirmed", score: 0.97, view: ["relationship", "money"], details: "Bank sample evidence identifies B1 as the registered owner." },
  { id: "e5", source: "b1", target: "riz", label: "handover alleged", sourceSystem: "DEVICE", status: "needs_verification", score: 0.82, view: ["relationship"], details: "B1 allegedly handed over account control to Riz for RM800.00." },
  { id: "e6", source: "device", target: "riz", label: "Telegram chat", sourceSystem: "DEVICE", status: "confirmed", score: 0.94, view: ["relationship"], details: "Digital forensic review found Telegram communication with Riz." },
  { id: "e23", source: "whatsapp", target: "bts", label: "frequent BTS connection", sourceSystem: "TELCO", status: "indicator", score: 0.72, view: ["relationship"], details: "Telco CDR sample shows 013-333 2300 connected to BTS-KUL-0412 in 72% of observed sessions. Coverage-based area estimate, not a precise position." },
  { id: "e8", source: "victim", target: "tx1", label: "0928", sourceSystem: "BANK", status: "confirmed", score: 0.99, view: ["money"], details: "First transfer: RM15,000.00." },
  { id: "e11", source: "tx1", target: "account", label: "credited", sourceSystem: "BANK", status: "confirmed", score: 0.98, view: ["money"], details: "Transfer credited to Bank Alfa account." },
  { id: "e12", source: "tx2", target: "account", label: "credited", sourceSystem: "BANK", status: "confirmed", score: 0.98, view: ["money"], details: "Transfer credited to Bank Alfa account." },
  { id: "e13", source: "tx3", target: "account", label: "credited", sourceSystem: "BANK", status: "confirmed", score: 0.98, view: ["money"], details: "Transfer credited to Bank Alfa account." },
  { id: "e14", source: "account", target: "outflow", label: "funds moved out", sourceSystem: "AI", status: "needs_verification", score: 0.79, view: ["money"], details: "Sample minute states the money moved out within 32 minutes to two downstream accounts." },
  { id: "e15", source: "report", target: "account", label: "recipient account", sourceSystem: "IPRS", status: "confirmed", score: 0.97, view: ["cases"], details: "The featured report records Bank Alfa 1234 5644 3200 as the recipient account." },
  { id: "e16", source: "whatsapp", target: "case318", label: "same phone number", sourceSystem: "CCIS", status: "confirmed", score: 0.99, view: ["cases"], details: "Exact phone identifier 013-333 2300 appears in both reports. An exact identifier match is not proof that the same person used the number." },
  { id: "e17", source: "account", target: "case386", label: "same recipient account", sourceSystem: "CCIS", status: "confirmed", score: 0.98, view: ["cases"], details: "Exact account identifier Bank Alfa 1234 5644 3200 appears in both reports. Requires officer verification before operational use." },
  { id: "e18", source: "website", target: "case386", label: "same website", sourceSystem: "CCIS", status: "confirmed", score: 0.96, view: ["cases"], details: "Exact domain identifier invest-pro-demo.example appears in both reports." },
  { id: "e19", source: "report", target: "case442", label: "similar modus operandi", sourceSystem: "AI", status: "needs_verification", score: 0.83, view: ["cases"], details: "Strong analytical similarity: shared campaign script language and urgency tactics. Similarity does not establish common authorship, control or identity." },
  { id: "e20", source: "case318", target: "combined", label: "contributes to combined loss", sourceSystem: "AI", status: "indicator", view: ["cases"], details: "Reported losses aggregated across linked reports for intelligence support." },
  { id: "e21", source: "case386", target: "combined", label: "contributes to combined loss", sourceSystem: "AI", status: "indicator", view: ["cases"], details: "Reported losses aggregated across linked reports for intelligence support." },
  { id: "e22", source: "case442", target: "combined", label: "contributes to combined loss", sourceSystem: "AI", status: "indicator", view: ["cases"], details: "Reported losses aggregated across linked reports for intelligence support." },
];

function MultiStepProgress({ currentStep }: { currentStep: number }) {
  return (
    <section className="multi-step intelligence-steps" aria-label="Case processing progress">
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
            </div>
          </article>
        );
      })}
    </section>
  );
}

function cleanLabel(value: string) {
  return value.replace(/MOCK\/JSJK\/KS\/001\/26/g, "JSJK/KS/001/26");
}

const IntelligenceFlowNode = memo(function IntelligenceFlowNode({ data, selected }: NodeProps<Node<IntelNodeData>>) {
  const color = NODE_COLOR[data.source];
  if (data.variant === "note") {
    return (
      <div className={`intel-flow-node note ${selected ? "selected" : ""}`} style={{ ["--node-color" as string]: color }}>
        <Handle className="intel-handle left" type="target" position={Position.Left} />
        <strong>{cleanLabel(data.label)}</strong>
        <p>{data.sublabel}</p>
        {data.timestamp && <span className="intel-node-time note-time" aria-label={`Time ${data.timestamp}`}>{data.timestamp}</span>}
        <Handle className="intel-handle right" type="source" position={Position.Right} />
      </div>
    );
  }
  if (data.variant === "map" && data.location) {
    const loc = data.location;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
    return (
      <div className={`intel-flow-node map ${selected ? "selected" : ""}`} style={{ ["--node-color" as string]: color }}>
        <Handle className="intel-handle left" type="target" position={Position.Left} />
        <div className="intel-node-head">
          <span className="intel-node-source">{SOURCE_LABEL[data.source]} / KPI</span>
          <span className="intel-node-time">{loc.share} sessions</span>
        </div>
        <a
          className="intel-map-canvas"
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${loc.towerId} in Google Maps`}
        >
          <svg viewBox="0 0 236 96" role="img" aria-hidden focusable="false">
            <rect width="236" height="96" fill="#eaf1e6" />
            <path d="M0 62 L70 54 L128 66 L188 50 L236 58" stroke="#ffffff" strokeWidth="7" fill="none" />
            <path d="M52 0 L64 40 L58 96" stroke="#ffffff" strokeWidth="5" fill="none" />
            <path d="M150 0 L142 44 L166 96" stroke="#ffffff" strokeWidth="5" fill="none" />
            <path d="M0 24 L90 20 L236 30" stroke="#ffffff" strokeWidth="3.5" fill="none" />
            <rect x="18" y="30" width="18" height="12" fill="#d8e2d0" />
            <rect x="196" y="66" width="22" height="14" fill="#d8e2d0" />
            <rect x="84" y="72" width="16" height="12" fill="#d8e2d0" />
            <circle cx="118" cy="48" r="34" fill="#1d4ed8" opacity="0.12" />
            <circle cx="118" cy="48" r="18" fill="#1d4ed8" opacity="0.16" />
            <path d="M118 30 c-7.2 0-13 5.7-13 12.8 0 9.6 13 23.2 13 23.2 s13-13.6 13-23.2 c0-7.1-5.8-12.8-13-12.8 z" fill="#c22f2f" />
            <circle cx="118" cy="42.6" r="4.6" fill="#ffffff" />
          </svg>
          <span className="intel-map-open">Open in Google Maps ↗</span>
        </a>
        <strong>{cleanLabel(data.label)}</strong>
        <p>{data.sublabel}</p>
        <div className="intel-map-tooltip" role="tooltip">
          <strong>{loc.towerId}</strong>
          <span>{loc.address}</span>
          <span>District: {loc.district}</span>
          <span>State: {loc.state}</span>
          <span>Connected: {loc.share} of observed sessions</span>
        </div>
        <Handle className="intel-handle right" type="source" position={Position.Right} />
      </div>
    );
  }
  return (
    <div className={`intel-flow-node metric ${selected ? "selected" : ""}`} style={{ ["--node-color" as string]: color }}>
      <Handle className="intel-handle left" type="target" position={Position.Left} />
      <div className="intel-node-head">
        <span className="intel-node-source">{SOURCE_LABEL[data.source]} / KPI</span>
        {data.timestamp ? (
          <span className="intel-node-time" aria-label={`Time ${data.timestamp}`}>{data.timestamp}</span>
        ) : (
          <span className="intel-node-open" aria-hidden>↗</span>
        )}
      </div>
      <div className="intel-node-title-row">
        <div className="intel-node-icon" aria-hidden>{SOURCE_ICON[data.source]}</div>
        <div className="intel-node-copy">
          <strong>{cleanLabel(data.label)}</strong>
          <p>{data.sublabel}</p>
        </div>
      </div>
      {data.stats && (
        <div className="intel-node-stats">
          {data.stats.map((stat) => (
            <div key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              {stat.delta && <em>{stat.delta}</em>}
            </div>
          ))}
        </div>
      )}
      <Handle className="intel-handle right" type="source" position={Position.Right} />
    </div>
  );
});

const nodeTypes = { intel: IntelligenceFlowNode };

function toFlowNode(node: IntelNode): Node<IntelNodeData> {
  const color = NODE_COLOR[node.source];
  return {
    id: node.id,
    type: "intel",
    position: { x: 0, y: 0 },
    data: {
      label: node.label,
      sublabel: node.sublabel,
      source: node.source,
      kind: node.kind,
      status: node.status,
      variant: node.variant ?? "metric",
      timestamp: node.timestamp,
      location: node.location,
      stats: node.stats,
    },
    draggable: true,
    style: { ["--node-color" as string]: color },
  };
}

function toFlowEdge(edge: IntelEdge): Edge {
  const color = "#48c78e";
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: "simplebezier",
    label: edge.score ? edge.score.toFixed(3) : undefined,
    animated: false,
    style: {
      stroke: color,
      strokeWidth: 2.2,
      strokeDasharray: "2 6",
    },
    labelStyle: { fill: "#fff", fontSize: 10, fontWeight: 800 },
    labelBgStyle: { fill: "#48c78e", fillOpacity: 1 },
    labelBgPadding: [7, 4],
    labelBgBorderRadius: 4,
    markerEnd: { type: MarkerType.ArrowClosed, color },
  };
}

export function CaseIntelligencePage() {
  const navigate = useNavigate();
  const [view, setView] = useState<IntelligenceView>("relationship");
  const [sourceFilter, setSourceFilter] = useState<"all" | IntelligenceSource>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | VerificationState>("all");
  const [showTable, setShowTable] = useState(false);
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<IntelNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const analysisRun = useDemoStore((state) => state.analysisRun);
  const ccisEnriched = useDemoStore((state) => state.ccisEnriched);
  const runAnalysis = useDemoStore((state) => state.runAnalysis);
  const enrichCcis = useDemoStore((state) => state.enrichCcis);
  const analysisLocked = !analysisRun;
  const casesLocked = analysisRun && view === "cases" && !ccisEnriched;
  const currentStep = !analysisRun ? 2 : ccisEnriched ? 5 : 4;

  const visibleNodes = useMemo(() => {
    if (!analysisRun) return [];
    if (view === "cases" && !ccisEnriched) return [];
    return INTEL_NODES.filter((node) => {
      if (!node.view.includes(view)) return false;
      if (sourceFilter !== "all" && node.source !== sourceFilter) return false;
      if (statusFilter !== "all" && node.status !== statusFilter) return false;
      return true;
    });
  }, [analysisRun, ccisEnriched, sourceFilter, statusFilter, view]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return INTEL_EDGES.filter((edge) => {
      if (!edge.view.includes(view)) return false;
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) return false;
      if (sourceFilter !== "all" && edge.sourceSystem !== sourceFilter) return false;
      if (statusFilter !== "all" && edge.status !== statusFilter) return false;
      return true;
    });
  }, [sourceFilter, statusFilter, view, visibleNodeIds]);

  useEffect(() => {
    const flowEdges = visibleEdges.map((edge) => toFlowEdge(edge));
    setNodes(layoutGraph(visibleNodes.map((node) => toFlowNode(node)), flowEdges));
    setEdges(flowEdges);
  }, [setEdges, setNodes, visibleEdges, visibleNodes]);

  const selectedNode = selected?.type === "node" ? INTEL_NODES.find((node) => node.id === selected.id) : null;
  const selectedEdge = selected?.type === "edge" ? INTEL_EDGES.find((edge) => edge.id === selected.id) : null;

  const sourceCounts = useMemo(() => {
    return INTEL_NODES.reduce<Record<IntelligenceSource, number>>(
      (acc, node) => {
        if (node.view.includes(view)) acc[node.source] += 1;
        return acc;
      },
      { IPRS: 0, BANK: 0, DEVICE: 0, CCIS: 0, TELCO: 0, AI: 0 },
    );
  }, [view]);

  const sourceFilterItems = useMemo<DropdownItem<"all" | IntelligenceSource>[]>(() => [
    { id: "all", label: "All sources" },
    ...Object.entries(SOURCE_LABEL).map(([source, label]) => ({
      id: source as IntelligenceSource,
      label: `${label} (${sourceCounts[source as IntelligenceSource]})`,
    })),
  ], [sourceCounts]);

  const statusFilterItems: DropdownItem<"all" | VerificationState>[] = [
    { id: "all", label: "All statuses" },
    { id: "confirmed", label: "Confirmed" },
    { id: "needs_verification", label: "Needs verification" },
    { id: "indicator", label: "Analytical indicator" },
  ];

  return (
    <div className="page intelligence-page">
      <div className="page-title-row">
        <div>
          <h1>Risikan Kes</h1>
          <p className="lede">
            {policeReportSample.reportNo} · {policeReportSample.category} · {policeReportSample.loss}
          </p>
        </div>
      </div>

      <MultiStepProgress currentStep={currentStep} />

      <section className="panel report-action-panel">
        <div>
          <span>Visual intelligence</span>
          <h2>{view === "relationship" ? "Relationship map" : view === "money" ? "Money trail" : "Cross-case linkage"}</h2>
          <p>
            Review the relationship, money-trail and cross-case views. When the map supports the case theory, prepare the draft minit.
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/minute")}>Prepare draft minit</button>
      </section>

      <section className="intelligence-toolbar panel">
        <div className="segmented-control" aria-label="Intelligence view">
          {(["relationship", "money", "cases"] as IntelligenceView[]).map((item) => (
            <button key={item} className={view === item ? "active" : ""} onClick={() => { setView(item); setSelected(null); }}>
              {item === "relationship" ? "Relationship" : item === "money" ? "Money" : "Cases"}
            </button>
          ))}
        </div>
        <label>
          Source
          <BasicDropdown
            label="All sources"
            items={sourceFilterItems}
            value={sourceFilter}
            onChange={(item) => {
              setSourceFilter(item.id);
              setSelected(null);
            }}
          />
        </label>
        <label>
          Status
          <BasicDropdown
            label="All statuses"
            items={statusFilterItems}
            value={statusFilter}
            onChange={(item) => {
              setStatusFilter(item.id);
              setSelected(null);
            }}
          />
        </label>
        <button onClick={() => setShowTable((value) => !value)}>{showTable ? "Show graph" : "Show table"}</button>
      </section>

      <div className="intelligence-grid">
        <section className="panel graph-panel">
          <div className="graph-panel-header">
            <h2>{showTable ? "Graph table" : "Interactive graph"}</h2>
            <span>{visibleNodes.length} nodes · {visibleEdges.length} links</span>
          </div>

          {analysisLocked ? (
            <div className="intelligence-flow-wrap">
              <div className="empty-review intelligence-locked">
                <Sparkles size={28} aria-hidden />
                <strong>Fact extraction not run</strong>
                <p>Run fact extraction on the report to build the relationship, money-trail and cross-case views.</p>
                <button className="btn-primary" onClick={runAnalysis}>Run fact extraction</button>
              </div>
            </div>
          ) : casesLocked ? (
            <div className="intelligence-flow-wrap">
              <div className="empty-review intelligence-locked">
                <Network size={28} aria-hidden />
                <strong>CCIS enrichment not run</strong>
                <p>Run CCIS enrichment to cross-reference this case against related police reports and reveal shared identifiers.</p>
                <button className="btn-primary" onClick={enrichCcis}>Run CCIS enrichment</button>
              </div>
            </div>
          ) : !showTable ? (
            <div className="intelligence-flow-wrap">
              <ReactFlow
                key={`${view}-${sourceFilter}-${statusFilter}`}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(_, node) => setSelected({ type: "node", id: node.id })}
                onEdgeClick={(_, edge) => setSelected({ type: "edge", id: edge.id })}
                onPaneClick={() => setSelected(null)}
                fitView
                minZoom={0.25}
                maxZoom={1.5}
                nodesDraggable
                nodesConnectable={false}
                elementsSelectable
                proOptions={{ hideAttribution: true }}
              >
                <Background gap={18} color="#dfe3eb" />
                <Controls showInteractive />
              </ReactFlow>
            </div>
          ) : (
            <table className="data intelligence-table">
              <thead>
                <tr><th>Item</th><th>Type</th><th>Source</th><th>Status</th><th>Details</th></tr>
              </thead>
              <tbody>
                {visibleNodes.map((node) => (
                  <tr key={node.id} onClick={() => setSelected({ type: "node", id: node.id })}>
                    <td><strong>{cleanLabel(node.label)}</strong><br /><small>{node.sublabel}</small></td>
                    <td>{node.kind}</td>
                    <td>{SOURCE_LABEL[node.source]}</td>
                    <td>{STATUS_LABEL[node.status]}</td>
                    <td>{node.details[0]}</td>
                  </tr>
                ))}
                {visibleEdges.map((edge) => (
                  <tr key={edge.id} onClick={() => setSelected({ type: "edge", id: edge.id })}>
                    <td><strong>{edge.label}</strong><br /><small>{edge.source} to {edge.target}</small></td>
                    <td>Link</td>
                    <td>{SOURCE_LABEL[edge.sourceSystem]}</td>
                    <td>{STATUS_LABEL[edge.status]}</td>
                    <td>{edge.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <aside className="panel intelligence-detail-panel">
          <h2>Selected item</h2>
          {!selectedNode && !selectedEdge && (
            <div className="empty-review">
              <Map size={28} aria-hidden />
              <strong>Select a node or link</strong>
              <p>The source, verification status and supporting notes will appear here.</p>
            </div>
          )}
          {selectedNode && (
            <article className="intel-detail-card">
              <span>{selectedNode.kind}</span>
              <h3>{cleanLabel(selectedNode.label)}</h3>
              <p>{selectedNode.sublabel}</p>
              <div className="intel-tags">
                <span style={{ borderColor: NODE_COLOR[selectedNode.source], color: NODE_COLOR[selectedNode.source] }}>{SOURCE_LABEL[selectedNode.source]}</span>
                <span>{STATUS_LABEL[selectedNode.status]}</span>
              </div>
              <ul>
                {selectedNode.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </article>
          )}
          {selectedEdge && (
            <article className="intel-detail-card">
              <span>Link</span>
              <h3>{selectedEdge.label}</h3>
              <p>{selectedEdge.source} → {selectedEdge.target}</p>
              <div className="intel-tags">
                <span style={{ borderColor: NODE_COLOR[selectedEdge.sourceSystem], color: NODE_COLOR[selectedEdge.sourceSystem] }}>{SOURCE_LABEL[selectedEdge.sourceSystem]}</span>
                <span>{STATUS_LABEL[selectedEdge.status]}</span>
              </div>
              <ul><li>{selectedEdge.details}</li></ul>
            </article>
          )}
        </aside>
      </div>
    </div>
  );
}
