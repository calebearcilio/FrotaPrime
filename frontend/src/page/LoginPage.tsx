import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import api, { getApiErrorMessage } from "../api/api";
import type { AuthResponse } from "../api/api";

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);
    setIsSubmitting(true);

    try {
      const response = await api.post<AuthResponse>("/auth/login", form);
      login(response.data);
      const state = location.state as { from?: { pathname?: string } } | null;
      navigate(state?.from?.pathname ?? "/veiculos", { replace: true });
    } catch (error) {
      setNotice(getApiErrorMessage(error, "Não foi possível entrar. Tente novamente."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-content">
      <div className="form-heading">
        <p className="eyebrow">ÁREA DO CLIENTE</p>
        <h1>Entrar</h1>
        <p className="form-description">Acesse sua conta FrotaPrime.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />

        <label className="field-label" htmlFor="login-password">Senha</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Mínimo de 6 caracteres"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          minLength={6}
          required
        />

        {notice && <p className="form-notice error" role="alert">{notice}</p>}

        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar na conta"}
        </button>
      </form>

      <p className="form-switch">
        Ainda não tem cadastro?{" "}
        <Link to="/cadastro">Criar conta</Link>
      </p>
    </div>
  );
};

export default LoginPage;