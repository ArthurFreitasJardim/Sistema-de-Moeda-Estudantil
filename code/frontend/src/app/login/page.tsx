"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Informe e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      });

      if (!response.ok) {
        setErro("E-mail ou senha inválidos.");
        return;
      }

      const data = await response.json();

      localStorage.setItem("usuarioLogado", JSON.stringify(data));

      router.push(data.rota || "/");
    } catch (error) {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(198, 241, 53, 0.18), transparent 32%), #080B0F",
        color: "#F9FAFB",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 440,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 28,
          padding: 28,
          boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#C6F135",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          ← Voltar
        </Link>

        <div style={{ marginTop: 28, marginBottom: 28 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 36,
              letterSpacing: "-0.06em",
              fontWeight: 900,
            }}
          >
            Entrar
          </h1>
          <p
            style={{
              color: "#8F9BAA",
              marginTop: 10,
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Acesse sua conta como aluno, professor ou empresa parceira.
          </p>
        </div>

        <form onSubmit={fazerLogin} style={{ display: "grid", gap: 14 }}>
          <label style={labelStyle}>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seuemail@exemplo.com"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              style={inputStyle}
            />
          </label>

          {erro && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                color: "#FCA5A5",
                padding: "12px 14px",
                borderRadius: 14,
                fontSize: 14,
              }}
            >
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            style={{
              border: "none",
              background: carregando ? "#9CA3AF" : "#C6F135",
              color: "#080B0F",
              borderRadius: 999,
              padding: "15px 18px",
              fontWeight: 900,
              fontSize: 15,
              cursor: carregando ? "not-allowed" : "pointer",
              marginTop: 8,
            }}
          >
            {carregando ? "Entrando..." : "Entrar no sistema"}
          </button>
        </form>

        <p
          style={{
            color: "#8F9BAA",
            fontSize: 14,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          Ainda não tem conta?{" "}
          <Link
            href="/cadastro"
            style={{ color: "#C6F135", fontWeight: 800, textDecoration: "none" }}
          >
            Cadastre-se
          </Link>
        </p>
      </section>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  color: "#D1D5DB",
  fontSize: 14,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(8, 11, 15, 0.72)",
  color: "#F9FAFB",
  borderRadius: 14,
  padding: "14px 15px",
  outline: "none",
  fontSize: 15,
};