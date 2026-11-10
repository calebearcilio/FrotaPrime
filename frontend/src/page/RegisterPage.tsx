import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/api";
import type { AuthResponse } from "../api/api";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type FormNotice = {
    kind: "success" | "error";
    message: string;
};

const RegisterPage = () => {
    const [form, setForm] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [notice, setNotice] = useState<FormNotice | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setNotice(null);
        setIsSubmitting(true);

        try {
            const response = await api.post<AuthResponse>("/auth/cadastro", form);
            setNotice({
                kind: "success",
                message: `Cadastro realizado com sucesso para ${response.data.data.name}.`,
            });
        } catch (error) {
            setNotice({
                kind: "error",
                message: getApiErrorMessage(error, "Não foi possível criar a conta. Tente novamente."),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-content">
            <div className="form-heading">
                <p className="eyebrow">NOVA CONTA</p>
                <h1>Criar cadastro</h1>
                <p className="form-description">Preencha seus dados para continuar.</p>
            </div>

            <form className="auth-form register-form" onSubmit={handleSubmit}>
                <label className="field-label" htmlFor="register-name">Nome</label>
                <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Seu nome completo"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    minLength={2}
                    required
                />

                <label className="field-label" htmlFor="register-email">E-mail</label>
                <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    required
                />

                <label className="field-label" htmlFor="register-password">Senha</label>
                <input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo de 6 caracteres"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    minLength={6}
                    required
                />

                <label className="field-label" htmlFor="register-confirm-password">Confirmar senha</label>
                <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repita sua senha"
                    value={form.confirmPassword}
                    onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                    minLength={6}
                    required
                />

                {notice && (
                    <p className={`form-notice ${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
                        {notice.message}
                    </p>
                )}

                <button className="submit-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Criando conta..." : "Criar conta"}
                </button>
            </form>

            <p className="form-switch">
                Já tem cadastro?{" "}
                <Link to="/login">Entrar</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
