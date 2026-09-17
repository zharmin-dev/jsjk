import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoStore } from "../../state/demo-store";

const STEPS = [
  { route: "/queue", time: "1:00", title: "1. Terima laporan", prompt: "Buka Papan Pemuka dan pilih rekod aduan keutamaan. Aliran bermula daripada iPRS." },
  { route: "/report", time: "2:15", title: "2. Baca & sahkan", prompt: "Jalankan analisis, periksa sumber, TOLAK ekstrakan ralat (DEMO-MY-24108) dan TANDA item samar (77105). Sahkan akaun utama, kerugian dan satu telefon/domain." },
  { route: "/intelligence", time: "1:30", title: "3. Jejak Aktiviti", prompt: "Pilih mod Activity. Tunjukkan kronologi dan buka satu sumber keterangan.", preset: "activity" },
  { route: "/intelligence", time: "2:00", title: "4. Penguasaan CCIS", prompt: "Tekan Cross-reference with CCIS, tunjukkan keserupaan dahulu, kemudian padanan tepat.", preset: "relationship" },
  { route: "/intelligence", time: "1:15", title: "5. Jejak Wang", prompt: "Mod Money: RM82,500 dilaporkan, RM79,000 direkodkan, RM3,500 tidak selesai. Ini rekonstruksi rekod, bukan pengesanan bank langsung.", preset: "money" },
  { route: "/minute", time: "2:15", title: "6. Draf minit", prompt: "Jana minit, buka sitasi, edit satu seksyen, jana semula satu seksyen, bandingkan versi." },
] as const;

export function PresentationPage() {
  const step = useDemoStore((s) => s.presentationStep);
  const setStep = useDemoStore((s) => s.setPresentationStep);
  const navigate = useNavigate();

  const go = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(STEPS.length - 1, n));
      setStep(clamped);
      navigate(STEPS[clamped]!.route);
    },
    [navigate, setStep],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
      if (e.key === "Escape") navigate("/queue");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, go, navigate]);

  const current = STEPS[step]!;

  return (
    <div className="page">
      <h1>Mod Persembahan / Presentation Mode</h1>
      <p className="lede">Aliran terpandu 12 minit. Kekunci: → seterusnya, ← kembali, Esc keluar.</p>

      <div className="progress-steps" aria-hidden>
        {STEPS.map((s, i) => (
          <div key={s.title} className={`step ${i <= step ? "done" : ""}`} />
        ))}
      </div>

      <div className="panel">
        <h2>{current.title} <small style={{ color: "var(--color-slate-500)" }}>· sasaran {current.time}</small></h2>
        <p style={{ fontSize: 17, lineHeight: 1.6 }}>{current.prompt}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => go(step - 1)} disabled={step === 0}>← Kembali / Back</button>
          <button className="btn-primary" onClick={() => go(step + 1)} disabled={step === STEPS.length - 1}>
            Seterusnya / Next →
          </button>
          <button onClick={() => navigate(current.route)}>Pergi ke skrin / Go to screen</button>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h2>Lompat / Jump</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STEPS.map((s, i) => (
            <button key={s.title} onClick={() => go(i)} aria-current={i === step ? "step" : undefined}>
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
