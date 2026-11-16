import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const successMessage = (location.state as { successMessage?: string } | null)
        ?.successMessage;

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <main className="workspace-shell">
            <header className="workspace-header">
                <NavLink className="workspace-brand" to="/veiculos" aria-label="FrotaPrime, início">
                    <span className="brand-symbol">FP</span>
                    <span>FrotaPrime</span>
                </NavLink>
                <nav className="workspace-nav" aria-label="Navegação principal">
                    <NavLink to="/veiculos">Veículos</NavLink>
                    <NavLink to="/locacoes">Locações</NavLink>
                </nav>
                <div className="workspace-account">
                    <div className="account-identity">
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                    </div>
                    <button type="button" className="logout-button" onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </header>
            <section className="workspace-content">
                {successMessage && (
                    <p className="form-notice success" role="status">
                        {successMessage}
                    </p>
                )}
                <Outlet />
            </section>
        </main>
    );
};

export default Layout;