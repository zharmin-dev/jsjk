import { useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { Bell, Shield, LayoutGrid, FileSearch, GitBranch, ListChecks, FileText, Presentation, RotateCcw, LogOut } from "lucide-react";
import { useDemoStore } from "../../state/demo-store";

const CASE_SUBNAV = [
  { to: "/report", bm: "Semakan Laporan", en: "Report Review", icon: FileSearch },
  { to: "/intelligence", bm: "Risikan Kes", en: "Case Intelligence", icon: GitBranch },
  { to: "/minute", bm: "Minit Siasatan", en: "Investigation Minute", icon: FileText },
];

function ResetDialog({ onClose }: { onClose: () => void }) {
  const reset = useDemoStore((s) => s.reset);
  const navigate = useNavigate();
  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="reset-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="reset-title">Set semula ruang kerja?</h2>
        <p>Semua keputusan semakan, versi minit dan audit sesi akan dipadam. Keadaan pembukaan dipulihkan.</p>
        <div className="dialog-actions">
          <button onClick={onClose}>Batal / Cancel</button>
          <button
            className="btn-danger"
            autoFocus
            onClick={() => {
              reset();
              onClose();
              navigate("/queue");
            }}
          >
            Set Semula
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const lang = useDemoStore((s) => s.language);
  const setLanguage = useDemoStore((s) => s.setLanguage);
  const recoveryNotice = useDemoStore((s) => s.recoveryNotice);
  const dismissRecovery = useDemoStore((s) => s.dismissRecoveryNotice);
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  if (!sessionStorage.getItem("jsjk-nexus-demo-auth")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Langkau ke kandungan / Skip to content</a>
      <header className="app-topbar">
        <div className="app-brand">
          <Shield size={24} aria-hidden />
          <span>
            Sistem Maklumat Bersepadu AI JSJK <small>Polis Diraja Malaysia</small>
          </span>
        </div>
        <div className="topbar-actions">
          <button className="topbar-icon-btn" aria-label="Notifications">
            <Bell size={15} aria-hidden />
            <span className="notification-count">5</span>
          </button>
          <button className="topbar-btn" onClick={() => setLanguage(lang === "bm" ? "en" : "bm")} aria-label="Tukar bahasa / Switch language">
            {lang === "bm" ? "EN" : "BM"}
          </button>
          <button className="topbar-btn" onClick={() => navigate("/present")} aria-label="Presentation Mode">
            <Presentation size={15} aria-hidden /> {lang === "bm" ? "Persembahan" : "Present"}
          </button>
          <button className="topbar-btn" onClick={() => setShowReset(true)} aria-label="Set semula">
            <RotateCcw size={15} aria-hidden /> Set semula
          </button>
          <button
            className="topbar-btn"
            onClick={() => {
              sessionStorage.removeItem("jsjk-nexus-demo-auth");
              navigate("/login");
            }}
            aria-label="Log out"
          >
            <LogOut size={15} aria-hidden /> {lang === "bm" ? "Log Keluar" : "Log Out"}
          </button>
          <div className="user-summary" aria-label="Current user">
            <strong>SAC Zulkifli bin Abdul Rahman</strong>
            <span>Pengarah, Integriti &amp; Pematuhan Piawaian</span>
          </div>
          <div className="user-avatar" aria-hidden>ZUL</div>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <nav aria-label="Utama / Main">
            <NavLink to="/queue" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
              <LayoutGrid size={16} aria-hidden />
              <span>{lang === "bm" ? "Baris Gilir" : "Queue"}</span>
            </NavLink>

            <div className="side-section">
              <NavLink to="/workflow" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
                <ListChecks size={16} aria-hidden />
                <span>{lang === "bm" ? "Kemajuan Kes" : "Case Progress"}</span>
              </NavLink>
              <div className="side-subnav" aria-label={lang === "bm" ? "Submenu kemajuan kes" : "Case progress submenu"}>
                {CASE_SUBNAV.map((n) => (
                  <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? "side-link side-sublink active" : "side-link side-sublink")}>
                    <n.icon size={14} aria-hidden />
                    <span>{lang === "bm" ? n.bm : n.en}</span>
                  </NavLink>
                ))}
              </div>
            </div>

          </nav>
          <div className="sidebar-foot">
            <p>Ruang kerja siasatan dan semakan bersepadu.</p>
          </div>
        </aside>

        <div className="app-content">
          <main className="app-main" id="main">
            <Outlet />
          </main>
        </div>
      </div>

      {showReset && <ResetDialog onClose={() => setShowReset(false)} />}
      {recoveryNotice && (
        <div className="recovery-toast" role="status">
          Keadaan sesi dipulihkan kepada rekod pembukaan.
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <button onClick={dismissRecovery}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
