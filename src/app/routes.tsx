import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "../components/shell/AppShell";
import { LoginPage } from "../components/auth/LoginPage";
import { QueuePage } from "../components/queue/QueuePage";
import { ReportReaderPage } from "../components/report-reader/ReportReaderPage";
import { CaseIntelligencePage } from "../components/case-intelligence/CaseIntelligencePage";
import { WorkflowPage } from "../components/workflow/WorkflowPage";
import { MinutePage } from "../components/minute/MinutePage";
import { PresentationPage } from "../components/presentation/PresentationPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/queue" replace />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/report" element={<ReportReaderPage />} />
        <Route path="/intelligence" element={<CaseIntelligencePage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/minute" element={<MinutePage />} />
        <Route path="/architecture" element={<Navigate to="/queue" replace />} />
        <Route path="/present" element={<PresentationPage />} />
        <Route path="*" element={<Navigate to="/queue" replace />} />
      </Route>
    </Routes>
  );
}
