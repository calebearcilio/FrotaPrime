import { useState } from "react";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";

const App = () => {
  const [currentPage, setCurrentPage] = useState<"login" | "register">("login");

  return (
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

      <section className="form-panel">
        {currentPage === "login" ? (
          <LoginPage onRegister={() => setCurrentPage("register")} />
        ) : (
          <RegisterPage onLogin={() => setCurrentPage("login")} />
        )}
      </section>
    </main>
  );
};

export default App;