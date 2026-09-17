import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, FileText, Map, Network, Search, Sparkles } from "lucide-react";
import { chargeMinuteSample, policeReportSample } from "../../fixtures/sample-documents";
import type { WorkflowStatus } from "../../domain/contracts";
import { useDemoStore } from "../../state/demo-store";
import { BasicDropdown, type DropdownItem } from "../shared/BasicDropdown";

type WorkflowStageId = "report" | "facts" | "verification" | "ccis" | "intelligence" | "minute";

interface WorkflowStage {
  id: WorkflowStageId;
  step: number;
  title: string;
  owner: string;
  route: string;
  action: string;
  evidence: string;
  icon: typeof FileText;
}

interface OfficerTask {
  id: string;
  title: string;
  detail: string;
  owner: string;
  due: string;
  status: WorkflowStatus;
}

const STAGES: WorkflowStage[] = [
  {
    id: "report",
    step: 1,
    title: "iPRS intake",
    owner: "Pegawai Penyiasat",
    route: "/report",
    action: "View report",
    evidence: policeReportSample.reportNo,
    icon: FileText,
  },
  {
    id: "facts",
    step: 2,
    title: "Fact extraction",
    owner: "Sistem / Pegawai Penyiasat",
    route: "/report",
    action: "Extract facts",
    evidence: "8 key facts from report",
    icon: Sparkles,
  },
  {
    id: "verification",
    step: 3,
    title: "Officer verification",
    owner: "Pegawai Penyiasat",
    route: "/report",
    action: "Review facts",
    evidence: "Police report, receipts and screenshots",
    icon: Search,
  },
  {
    id: "ccis",
    step: 4,
    title: "CCIS enrichment",
    owner: "Pegawai Penyiasat",
    route: "/intelligence",
    action: "Review links",
    evidence: "Related reports and identifier matches",
    icon: Network,
  },
  {
    id: "intelligence",
    step: 5,
    title: "Visual intelligence",
    owner: "Pegawai Penyiasat",
    route: "/intelligence",
    action: "Open graph",
    evidence: "Activity, relationship and money trail",
    icon: Map,
  },
  {
    id: "minute",
    step: 6,
    title: "Draft minit prepared",
    owner: "Pegawai Penyiasat",
    route: "/minute",
    action: "Open draft",
    evidence: chargeMinuteSample.section,
    icon: ClipboardCheck,
  },
];

const INITIAL_TASKS: OfficerTask[] = [
  {
    id: "task-bank",
    title: "Confirm Bank Alfa account owner",
    detail: "Verify account 1234 5644 3200, inbound RM48,750.00 and outflow within 32 minutes.",
    owner: "Pegawai Penyiasat",
    due: "Today",
    status: "in_progress",
  },
  {
    id: "task-device",
    title: "Review H1 forensic notes",
    detail: "Confirm Telegram conversation, OTP device control and RM800.00 payment reference.",
    owner: "Digital Forensics",
    due: "Today",
    status: "awaiting_information",
  },
  {
    id: "task-ccis",
    title: "Validate related-case indicator",
    detail: "Check whether the same recipient account appears in the three linked reports.",
    owner: "Pegawai Penyiasat",
    due: "Tomorrow",
    status: "not_started",
  },
];

const STATUS_LABEL: Record<WorkflowStatus, string> = {
  not_started: "Belum mula",
  in_progress: "Sedang berjalan",
  awaiting_information: "Menunggu maklumat",
  completed: "Selesai",
  returned: "Dikembalikan",
};

const STATUS_ORDER: WorkflowStatus[] = ["not_started", "in_progress", "awaiting_information", "completed", "returned"];
const STATUS_ITEMS: DropdownItem<WorkflowStatus>[] = STATUS_ORDER.map((status) => ({ id: status, label: STATUS_LABEL[status] }));

function stageStatus(stage: WorkflowStage, analysisRun: boolean, ccisEnriched: boolean): WorkflowStatus {
  if (stage.id === "report") return "completed";
  if (stage.id === "facts") return analysisRun ? "completed" : "in_progress";
  if (stage.id === "verification") return analysisRun ? "completed" : "not_started";
  if (stage.id === "ccis") return ccisEnriched ? "completed" : "not_started";
  if (stage.id === "intelligence") return "in_progress";
  return "not_started";
}

function statusClass(status: WorkflowStatus) {
  return status.replaceAll("_", "-");
}

export function WorkflowPage() {
  const navigate = useNavigate();
  const analysisRun = useDemoStore((s) => s.analysisRun);
  const ccisEnriched = useDemoStore((s) => s.ccisEnriched);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const stages = useMemo(() => {
    return STAGES.map((stage) => ({ ...stage, status: stageStatus(stage, analysisRun, ccisEnriched) }));
  }, [analysisRun, ccisEnriched]);

  const completedStages = stages.filter((stage) => stage.status === "completed").length;
  const currentStage = stages.find((stage) => stage.status === "in_progress") ?? stages.find((stage) => stage.status !== "completed") ?? stages.at(-1)!;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;

  function updateTask(id: string, status: WorkflowStatus) {
    setTasks((items) => items.map((task) => (task.id === id ? { ...task, status } : task)));
  }

  return (
    <div className="page workflow-page">
      <div className="page-title-row">
        <div>
          <h1>Kemajuan Kes</h1>
          <p className="lede">
            {policeReportSample.reportNo} · {policeReportSample.category} · {policeReportSample.loss}
          </p>
        </div>
      </div>

      <section className="panel workflow-hero">
        <div>
          <span>Current case stage</span>
          <h2>Step {currentStage.step}: {currentStage.title}</h2>
          <p>{currentStage.evidence}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate(currentStage.route)}>{currentStage.action}</button>
      </section>

      <section className="workflow-summary-grid" aria-label="Workflow summary">
        <article className="panel workflow-kpi">
          <span>Process</span>
          <strong>{completedStages}/6</strong>
          <p>steps completed</p>
        </article>
        <article className="panel workflow-kpi">
          <span>Officer tasks</span>
          <strong>{completedTasks}/{tasks.length}</strong>
          <p>tasks completed</p>
        </article>
        <article className="panel workflow-kpi">
          <span>Draft output</span>
          <strong>{chargeMinuteSample.section.split(" ")[1]}</strong>
          <p>proposed charge section</p>
        </article>
      </section>

      <section className="panel workflow-stage-panel">
        <div className="workflow-section-head">
          <div>
            <span>Case progress overview</span>
            <h2>One case, six working stages</h2>
          </div>
        </div>

        <div className="workflow-stage-list">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <article className={`workflow-stage-card ${statusClass(stage.status)}`} key={stage.id}>
                <div className="workflow-stage-icon"><Icon size={18} aria-hidden /></div>
                <div>
                  <span>Step {stage.step}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.evidence}</p>
                  <small>{stage.owner}</small>
                </div>
                <button onClick={() => navigate(stage.route)}>{stage.action}</button>
              </article>
            );
          })}
        </div>
      </section>

      <div className="workflow-detail-grid">
        <section className="panel workflow-task-panel">
          <div className="workflow-section-head">
            <div>
              <span>Supporting verification tasks</span>
              <h2>Tasks required before final approval</h2>
              <p>These tasks support the evidence used in Step 5 and Step 6. They are not separate process steps.</p>
            </div>
          </div>

          <div className="workflow-task-list">
            {tasks.map((task) => (
              <article className="workflow-task-card" key={task.id}>
                <div>
                  <span className={`workflow-status ${statusClass(task.status)}`}>{STATUS_LABEL[task.status]}</span>
                  <h3>{task.title}</h3>
                  <p>{task.detail}</p>
                  <small>{task.owner} · {task.due}</small>
                </div>
                <BasicDropdown
                  label="Status"
                  items={STATUS_ITEMS}
                  value={task.status}
                  onChange={(item) => updateTask(task.id, item.id)}
                />
              </article>
            ))}
          </div>
        </section>

        <aside className="panel workflow-next-panel">
          <span>Next handoff</span>
          <h2>Prepare the draft minit</h2>
          <p>
            After the intelligence views support the case theory, open Step 6 to review the generated cadangan pertuduhan.
          </p>
          <button className="btn-primary" onClick={() => navigate("/minute")}>Open Step 6</button>
        </aside>
      </div>
    </div>
  );
}
