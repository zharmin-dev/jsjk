import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

export function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("jsjk-nexus-demo-auth", "1");
    navigate("/queue");
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-brand">
          <Shield size={34} aria-hidden />
          <h1>Sistem Maklumat Bersepadu AI JSJK</h1>
          <p>Polis Diraja Malaysia</p>
        </div>
        <label className="field required" htmlFor="login-id">ID Pengguna</label>
        <input
          id="login-id"
          type="text"
          autoComplete="username"
          placeholder="contohnya JIPS-00231"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <label className="field required" htmlFor="login-pw">Kata Laluan</label>
        <input
          id="login-pw"
          type="password"
          autoComplete="current-password"
          placeholder="•••••••••"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button className="login-submit" type="submit">
          Daftar Masuk
        </button>
        <div className="login-links">
          <a href="#/login" onClick={(e) => e.preventDefault()}>Lupa kata laluan?</a>
        </div>
        <p className="login-notice">
          Hanya kakitangan PDRM yang dibenarkan. Akses tanpa kebenaran adalah dilarang.
        </p>
      </form>
    </div>
  );
}
