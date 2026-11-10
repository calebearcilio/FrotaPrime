import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";
import Layout from "./components/Layout";
import { GuestOnlyRoute, ProtectedRoute } from "./components/ProtectedRoute";
import AutomobilePage from "./page/AutomobilePage";
import LocacoesPage from "./page/LocacoesPage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";

const AuthFrame = ({ children }: { children: ReactNode }) => (
  <main className="auth-layout">
    <aside className="brand-panel">
      <div className="brand-lockup" aria-label="FrotaPrime">
        <span className="brand-symbol">FP</span>
        <span>FrotaPrime</span>
      </div>
      <img
        className="brand-image"
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85"
        alt="Automóvel em exposição"
      />
      <div className="brand-caption">
        <span>FROTA PRIME</span>
        <span>PORTAL DE ACESSO</span>
      </div>
      <span className="brand-index" aria-hidden="true">01 / 26</span>
    </aside>

    <section className="form-panel">{children}</section>
  </main>
);

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/veiculos" : "/login"} replace />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<AuthFrame><LoginPage /></AuthFrame>} />
          <Route path="/cadastro" element={<AuthFrame><RegisterPage /></AuthFrame>} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/veiculos" element={<AutomobilePage />} />
            <Route path="/locacoes" element={<LocacoesPage />} />
          </Route>
        </Route>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;