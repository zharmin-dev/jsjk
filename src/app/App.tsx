import { Component, type ReactNode } from "react";
import { AppRoutes } from "./routes";

interface EBState { error: Error | null }

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  override state: EBState = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  override render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "monospace" }}>
          <h1>Fixture / runtime error</h1>
          <p>The workspace hit an unrecoverable validation error. Do not continue with partial data.</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f1f5f9", padding: 16 }}>{String(this.state.error.message)}</pre>
          <button onClick={() => { localStorage.clear(); location.reload(); }}>Clear saved state and reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
