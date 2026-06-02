"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Aluno = {
  id: number;
  nome: string;
  curso: string;
  instituicaoNome?: string;
};

type Empresa = {
  id: number;
  nome: string;
  email: string;
  cnpj: string;
};

const ACCENT = "#C6F135";
const ACCENT_MUTED = "rgba(198,241,53,0.12)";
const ACCENT_BORDER = "rgba(198,241,53,0.25)";

function Tag({
  children,
  color = "default",
}: {
  children: React.ReactNode;
  color?: "green" | "blue" | "red" | "purple" | "default";
}) {
  const styles: Record<string, React.CSSProperties> = {
    green: {
      background: "rgba(198,241,53,0.12)",
      color: ACCENT,
      border: `1px solid ${ACCENT_BORDER}`,
    },
    blue: {
      background: "rgba(96,165,250,0.1)",
      color: "#60A5FA",
      border: "1px solid rgba(96,165,250,0.2)",
    },
    red: {
      background: "rgba(248,113,113,0.1)",
      color: "#F87171",
      border: "1px solid rgba(248,113,113,0.2)",
    },
    purple: {
      background: "rgba(168,130,255,0.1)",
      color: "#A882FF",
      border: "1px solid rgba(168,130,255,0.2)",
    },
    default: {
      background: "rgba(255,255,255,0.05)",
      color: "#9CA3AF",
      border: "1px solid rgba(255,255,255,0.08)",
    },
  };

  return (
    <span
      style={{
        ...styles[color],
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 99,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: accent ? ACCENT_MUTED : "rgba(255,255,255,0.03)",
        border: `1px solid ${accent ? ACCENT_BORDER : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: accent ? ACCENT : "#6B7280",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: accent ? ACCENT : "#F9FAFB",
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>

      {sub && (
        <span style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function SectionHeader({
  dot,
  title,
  subtitle,
  count,
}: {
  dot: string;
  title: string;
  subtitle: string;
  count?: number;
}) {
  return (
    <div
      style={{
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: dot,
              display: "inline-block",
              boxShadow: `0 0 8px ${dot}88`,
            }}
          />

          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "#F9FAFB",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
        </div>

        <p style={{ margin: 0, fontSize: 13, color: "#4B5563" }}>
          {subtitle}
        </p>
      </div>

      {count !== undefined && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#4B5563",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 8,
            padding: "4px 12px",
            whiteSpace: "nowrap",
          }}
        >
          {count} {count === 1 ? "item" : "itens"}
        </span>
      )}
    </div>
  );
}

function TextInput({
  label,
  placeholder,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#4B5563",
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </label>

      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          background: "#0D1117",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#D1D5DB",
          padding: "14px 16px",
          borderRadius: 12,
          outline: "none",
        }}
      />
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  const [abaAtiva, setAbaAtiva] = useState<"aluno" | "empresa">("aluno");

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [formAluno, setFormAluno] = useState({
    nome: "",
    email: "",
    cpf: "",
    rg: "",
    curso: "",
    instituicaoNome: "",
    senha: "123",
  });

  const [formEmpresa, setFormEmpresa] = useState({
    nome: "",
    email: "",
    cnpj: "",
    senha: "123",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);

    try {
      const [alunosResponse, empresasResponse] = await Promise.all([
        fetch("http://localhost:8080/alunos", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        }),
        fetch("http://localhost:8080/empresas", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        }),
      ]);

      const alunosData = alunosResponse.ok ? await alunosResponse.json() : [];
      const empresasData = empresasResponse.ok ? await empresasResponse.json() : [];

      setAlunos(Array.isArray(alunosData) ? alunosData : []);
      setEmpresas(Array.isArray(empresasData) ? empresasData : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar cadastros.");
      setAlunos([]);
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  const somenteNumeros = (valor: string) => valor.replace(/\D/g, "");

  const cadastrarAluno = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      nome: formAluno.nome.trim(),
      email: formAluno.email.trim().toLowerCase(),
      cpf: somenteNumeros(formAluno.cpf),
      rg: somenteNumeros(formAluno.rg),
      curso: formAluno.curso.trim(),
      instituicaoNome: formAluno.instituicaoNome.trim(),
      senha: formAluno.senha,
    };

    setSalvando(true);

    try {
      const response = await fetch("http://localhost:8080/alunos", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let body: any = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { erro: text };
      }

      if (response.ok) {
        toast.success("Aluno cadastrado com sucesso!");

        setFormAluno({
          nome: "",
          email: "",
          cpf: "",
          rg: "",
          curso: "",
          instituicaoNome: "",
          senha: "123",
        });

        await carregarDados();
      } else {
        toast.error(
          body.erro || body.message || text || "Erro ao cadastrar aluno."
        );
      }
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      toast.error("Erro ao comunicar com o back-end.");
    } finally {
      setSalvando(false);
    }
  };

  const cadastrarEmpresa = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      nome: formEmpresa.nome.trim(),
      email: formEmpresa.email.trim().toLowerCase(),
      cnpj: somenteNumeros(formEmpresa.cnpj),
      senha: formEmpresa.senha,
    };

    setSalvando(true);

    try {
      const response = await fetch("http://localhost:8080/empresas", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let body: any = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { erro: text };
      }

      if (response.ok) {
        toast.success("Empresa cadastrada com sucesso!");

        setFormEmpresa({
          nome: "",
          email: "",
          cnpj: "",
          senha: "123",
        });

        await carregarDados();
      } else {
        toast.error(
          body.erro || body.message || text || "Erro ao cadastrar empresa."
        );
      }
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
      toast.error("Erro ao comunicar com o back-end.");
    } finally {
      setSalvando(false);
    }
  };

  const excluirItem = async (tipo: "alunos" | "empresas", id: number) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este registro?");

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:8080/${tipo}/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (response.ok) {
        toast.success("Registro excluído com sucesso.");
        await carregarDados();
      } else {
        toast.error("Erro ao excluir.");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao comunicar com o back-end.");
    }
  };

  const abrirPainelEmpresa = (empresaId: number) => {
    router.push(`/empresa?id=${empresaId}`);
  };

  const abrirPerfilAluno = (alunoId: number) => {
    router.push(`/aluno/${alunoId}`);
  };

  const formatarCnpj = (cnpj: string) => {
    if (!cnpj) return "Não informado";

    const somenteNumerosCnpj = cnpj.replace(/\D/g, "");

    if (somenteNumerosCnpj.length !== 14) {
      return cnpj;
    }

    return somenteNumerosCnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  const totalCadastros = alunos.length + empresas.length;

  const abas = [
    { id: "aluno", label: "Aluno", count: alunos.length, dot: ACCENT },
    { id: "empresa", label: "Empresa", count: empresas.length, dot: "#60A5FA" },
  ] as const;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080B0F",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${ACCENT_BORDER}`,
            borderTopColor: ACCENT,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />

        <p
          style={{
            color: "#4B5563",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Carregando cadastros...
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080B0F",
        color: "#F9FAFB",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: ACCENT,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Sistema de Moedas
        </span>

        <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 16 }}>/</span>

        <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
          Cadastros
        </span>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 32px",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            position: "sticky",
            top: 32,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: 28,
            }}
          >
            <Tag color="green">Sprint 02</Tag>

            <h1
              style={{
                margin: "16px 0 8px",
                fontSize: 26,
                fontWeight: 900,
                color: "#F9FAFB",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Sistema de Moedas Estudantil
            </h1>

            <p style={{ margin: 0, fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
              Cadastro de alunos e empresas parceiras, acesso ao perfil do aluno
              e painel de vantagens.
            </p>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(198,241,53,0.08) 0%, rgba(198,241,53,0.03) 100%)",
              border: `1px solid ${ACCENT_BORDER}`,
              borderRadius: 20,
              padding: 28,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: ACCENT,
                display: "block",
                marginBottom: 8,
              }}
            >
              Total de cadastros
            </span>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: ACCENT,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {totalCadastros}
              </span>

              <span
                style={{
                  fontSize: 13,
                  color: "rgba(198,241,53,0.5)",
                  fontWeight: 600,
                }}
              >
                registros
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <StatCard label="Alunos" value={alunos.length} />
            <StatCard label="Empresas" value={empresas.length} />
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: 24,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#4B5563",
                display: "block",
                marginBottom: 12,
              }}
            >
              Navegação
            </span>

            <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
              Clique em um aluno para abrir o perfil com extrato e vantagens.
            </p>

            <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
              Clique em uma empresa para abrir o painel de cadastro de vantagens.
            </p>
          </div>
        </aside>

        <main>
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 28,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding: 4,
            }}
          >
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  background:
                    abaAtiva === aba.id ? "rgba(255,255,255,0.06)" : "transparent",
                  color: abaAtiva === aba.id ? "#F9FAFB" : "#4B5563",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: aba.dot,
                    display: "inline-block",
                    opacity: abaAtiva === aba.id ? 1 : 0.4,
                    boxShadow: abaAtiva === aba.id ? `0 0 6px ${aba.dot}88` : "none",
                  }}
                />

                {aba.label}

                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background:
                      abaAtiva === aba.id
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                    color: abaAtiva === aba.id ? "#9CA3AF" : "#374151",
                    padding: "1px 7px",
                    borderRadius: 99,
                  }}
                >
                  {aba.count}
                </span>
              </button>
            ))}
          </div>

          {abaAtiva === "aluno" && (
            <section>
              <SectionHeader
                dot={ACCENT}
                title="Cadastro de aluno"
                subtitle="Cadastre alunos para que possam receber moedas e resgatar vantagens."
                count={alunos.length}
              />

              <form
                onSubmit={cadastrarAluno}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 18,
                  padding: 24,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                <TextInput
                  label="Nome"
                  placeholder="Nome do aluno"
                  value={formAluno.nome}
                  onChange={(value) => setFormAluno({ ...formAluno, nome: value })}
                />

                <TextInput
                  label="E-mail"
                  placeholder="email@exemplo.com"
                  type="email"
                  value={formAluno.email}
                  onChange={(value) => setFormAluno({ ...formAluno, email: value })}
                />

                <TextInput
                  label="CPF"
                  placeholder="Somente números"
                  value={formAluno.cpf}
                  onChange={(value) => setFormAluno({ ...formAluno, cpf: value })}
                />

                <TextInput
                  label="RG"
                  placeholder="Somente números"
                  value={formAluno.rg}
                  onChange={(value) => setFormAluno({ ...formAluno, rg: value })}
                />

                <TextInput
                  label="Curso"
                  placeholder="Ex: Engenharia de Software"
                  value={formAluno.curso}
                  onChange={(value) => setFormAluno({ ...formAluno, curso: value })}
                />

                <TextInput
                  label="Instituição"
                  placeholder="Ex: PUC Minas"
                  value={formAluno.instituicaoNome}
                  onChange={(value) =>
                    setFormAluno({ ...formAluno, instituicaoNome: value })
                  }
                />

                <button
                  disabled={salvando}
                  style={{
                    gridColumn: "1 / -1",
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 12,
                    border: "none",
                    cursor: salvando ? "not-allowed" : "pointer",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: salvando ? "rgba(255,255,255,0.04)" : ACCENT,
                    color: salvando ? "#374151" : "#080B0F",
                  }}
                >
                  {salvando ? "Cadastrando..." : "Cadastrar aluno"}
                </button>
              </form>

              <SectionHeader
                dot="#60A5FA"
                title="Alunos cadastrados"
                subtitle="Clique em um aluno para acessar o perfil detalhado."
                count={alunos.length}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alunos.map((aluno) => (
                  <div
                    key={aluno.id}
                    onClick={() => abrirPerfilAluno(aluno.id)}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 16,
                      padding: "18px 20px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 16,
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#F9FAFB",
                        }}
                      >
                        {aluno.nome}
                      </p>

                      <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
                        {aluno.curso}{" "}
                        {aluno.instituicaoNome ? `— ${aluno.instituicaoNome}` : ""}
                      </p>

                      <p
                        style={{
                          margin: "8px 0 0",
                          fontSize: 10,
                          color: "#374151",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Clique para acessar o perfil do aluno
                      </p>
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        excluirItem("alunos", aluno.id);
                      }}
                      style={{
                        padding: "9px 14px",
                        borderRadius: 10,
                        border: "1px solid rgba(248,113,113,0.2)",
                        background: "rgba(248,113,113,0.08)",
                        color: "#F87171",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                ))}

                {alunos.length === 0 && (
                  <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <p
                      style={{
                        color: "#1F2937",
                        fontWeight: 800,
                        fontSize: 13,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      Nenhum aluno cadastrado
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {abaAtiva === "empresa" && (
            <section>
              <SectionHeader
                dot={ACCENT}
                title="Cadastro de empresa"
                subtitle="Cadastre empresas parceiras para disponibilizar vantagens."
                count={empresas.length}
              />

              <form
                onSubmit={cadastrarEmpresa}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 18,
                  padding: 24,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                <TextInput
                  label="Razão social"
                  placeholder="Nome da empresa"
                  value={formEmpresa.nome}
                  onChange={(value) => setFormEmpresa({ ...formEmpresa, nome: value })}
                />

                <TextInput
                  label="E-mail corporativo"
                  placeholder="empresa@exemplo.com"
                  type="email"
                  value={formEmpresa.email}
                  onChange={(value) =>
                    setFormEmpresa({ ...formEmpresa, email: value })
                  }
                />

                <TextInput
                  label="CNPJ"
                  placeholder="Somente números"
                  value={formEmpresa.cnpj}
                  onChange={(value) =>
                    setFormEmpresa({ ...formEmpresa, cnpj: value })
                  }
                />

                <button
                  disabled={salvando}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    alignSelf: "end",
                    borderRadius: 12,
                    border: "none",
                    cursor: salvando ? "not-allowed" : "pointer",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: salvando ? "rgba(255,255,255,0.04)" : ACCENT,
                    color: salvando ? "#374151" : "#080B0F",
                  }}
                >
                  {salvando ? "Cadastrando..." : "Cadastrar empresa"}
                </button>
              </form>

              <SectionHeader
                dot="#60A5FA"
                title="Empresas parceiras"
                subtitle="Clique em uma empresa para acessar o painel de vantagens."
                count={empresas.length}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {empresas.map((empresa) => (
                  <div
                    key={empresa.id}
                    onClick={() => abrirPainelEmpresa(empresa.id)}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 16,
                      padding: "18px 20px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 16,
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#F9FAFB",
                        }}
                      >
                        {empresa.nome}
                      </p>

                      <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
                        {empresa.email} — {formatarCnpj(empresa.cnpj)}
                      </p>

                      <p
                        style={{
                          margin: "8px 0 0",
                          fontSize: 10,
                          color: "#374151",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Clique para acessar o painel da empresa
                      </p>
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        excluirItem("empresas", empresa.id);
                      }}
                      style={{
                        padding: "9px 14px",
                        borderRadius: 10,
                        border: "1px solid rgba(248,113,113,0.2)",
                        background: "rgba(248,113,113,0.08)",
                        color: "#F87171",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                ))}

                {empresas.length === 0 && (
                  <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <p
                      style={{
                        color: "#1F2937",
                        fontWeight: 800,
                        fontSize: 13,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      Nenhuma empresa cadastrada
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>
    </div>
  );
}