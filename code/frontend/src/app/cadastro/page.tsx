"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type TipoCadastro = "ALUNO" | "EMPRESA";

export default function CadastroPage() {
  const router = useRouter();

  const [tipo, setTipo] = useState<TipoCadastro>("ALUNO");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [curso, setCurso] = useState("");
  const [instituicaoNome, setInstituicaoNome] = useState("");

  const [cnpj, setCnpj] = useState("");

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro("Nome, e-mail e senha são obrigatórios.");
      return;
    }

    if (senha.length < 3) {
      setErro("A senha precisa ter pelo menos 3 caracteres.");
      return;
    }

    try {
      setCarregando(true);

      const endpoint = tipo === "ALUNO" ? "/alunos" : "/empresas";

      const body =
        tipo === "ALUNO"
          ? {
              nome: nome.trim(),
              email: email.trim(),
              senha,
              cpf: cpf.trim(),
              rg: rg.trim(),
              curso: curso.trim(),
              instituicaoNome: instituicaoNome.trim(),
            }
          : {
              nome: nome.trim(),
              email: email.trim(),
              senha,
              cnpj: cnpj.trim(),
            };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErro(data?.message || "Não foi possível realizar o cadastro.");
        return;
      }

      setSucesso("Cadastro realizado com sucesso. Redirecionando para o login...");

      setTimeout(() => {
        router.push("/login");
      }, 900);
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
          "radial-gradient(circle at top right, rgba(198, 241, 53, 0.18), transparent 32%), #080B0F",
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
          maxWidth: 720,
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

        <div style={{ marginTop: 28, marginBottom: 24 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 36,
              letterSpacing: "-0.06em",
              fontWeight: 900,
            }}
          >
            Criar cadastro
          </h1>
          <p
            style={{
              color: "#8F9BAA",
              marginTop: 10,
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Alunos e empresas parceiras podem se cadastrar. Professores são
            cadastrados previamente pelo sistema.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 24,
            background: "rgba(8,11,15,0.72)",
            padding: 6,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <button
            type="button"
            onClick={() => setTipo("ALUNO")}
            style={tabStyle(tipo === "ALUNO")}
          >
            Aluno
          </button>

          <button
            type="button"
            onClick={() => setTipo("EMPRESA")}
            style={tabStyle(tipo === "EMPRESA")}
          >
            Empresa
          </button>
        </div>

        <form onSubmit={cadastrar} style={{ display: "grid", gap: 14 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            <label style={labelStyle}>
              Nome
              <input
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder={tipo === "ALUNO" ? "Nome do aluno" : "Nome da empresa"}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@exemplo.com"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Senha
              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Crie uma senha"
                style={inputStyle}
              />
            </label>

            {tipo === "ALUNO" && (
              <>
                <label style={labelStyle}>
                  CPF
                  <input
                    value={cpf}
                    onChange={(event) => setCpf(event.target.value)}
                    placeholder="00000000000"
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  RG
                  <input
                    value={rg}
                    onChange={(event) => setRg(event.target.value)}
                    placeholder="MG0000000"
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  Curso
                  <input
                    value={curso}
                    onChange={(event) => setCurso(event.target.value)}
                    placeholder="Engenharia de Software"
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  Instituição
                  <input
                    value={instituicaoNome}
                    onChange={(event) => setInstituicaoNome(event.target.value)}
                    placeholder="PUC Minas"
                    style={inputStyle}
                  />
                </label>
              </>
            )}

            {tipo === "EMPRESA" && (
              <label style={labelStyle}>
                CNPJ
                <input
                  value={cnpj}
                  onChange={(event) => setCnpj(event.target.value)}
                  placeholder="00000000000100"
                  style={inputStyle}
                />
              </label>
            )}
          </div>

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

          {sucesso && (
            <div
              style={{
                background: "rgba(198, 241, 53, 0.10)",
                border: "1px solid rgba(198, 241, 53, 0.35)",
                color: "#D9F99D",
                padding: "12px 14px",
                borderRadius: 14,
                fontSize: 14,
              }}
            >
              {sucesso}
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
            {carregando
              ? "Cadastrando..."
              : tipo === "ALUNO"
              ? "Cadastrar aluno"
              : "Cadastrar empresa"}
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
          Já possui conta?{" "}
          <Link
            href="/login"
            style={{
              color: "#C6F135",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}

function tabStyle(ativo: boolean): React.CSSProperties {
  return {
    border: "none",
    padding: "12px 16px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    background: ativo ? "#C6F135" : "transparent",
    color: ativo ? "#080B0F" : "#A7B0BE",
  };
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