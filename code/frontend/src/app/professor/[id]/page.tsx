"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Professor = {
  id: number;
  nome: string;
  departamento: string;
  instituicaoNome: string;
  saldoCorrente: number;
};

type Aluno = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  curso: string;
  instituicaoNome: string;
  saldoAtual: number;
};

type Transacao = {
  id: number;
  destinatarioNome: string;
  valor: number;
  motivo: string;
  dataHora: string;
};

const ACCENT = "#C6F135";
const ACCENT_MUTED = "rgba(198,241,53,0.12)";
const ACCENT_BORDER = "rgba(198,241,53,0.25)";

function Tag({
  children,
  color = "default",
}: {
  children: React.ReactNode;
  color?: "green" | "blue" | "red" | "default";
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#4B5563",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#D1D5DB",
          textAlign: "right",
          maxWidth: "60%",
        }}
      >
        {value}
      </span>
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

export default function PainelProfessorPorId() {
  const params = useParams();
  const router = useRouter();

  const professorId = params.id as string;

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"enviar" | "alunos" | "historico">(
    "enviar"
  );

  const [envio, setEnvio] = useState({
    alunoId: "",
    valor: "",
    motivo: "",
  });

  useEffect(() => {
    carregarDados();
  }, [professorId]);

  const buscarJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar ${url}: ${response.status}`);
    }

    return response.json();
  };

  const carregarDados = async () => {
    setLoading(true);

    try {
      if (!professorId) {
        setProfessor(null);
        setAlunos([]);
        setTransacoes([]);
        return;
      }

      const [professorCarregado, listaAlunos, listaTransacoes] =
        await Promise.all([
          buscarJson<Professor>(`http://localhost:8080/professores/${professorId}`),
          buscarJson<Aluno[]>(`http://localhost:8080/alunos/professor/${professorId}`),
          buscarJson<Transacao[]>(
            `http://localhost:8080/transacoes/professor/${professorId}`
          ),
        ]);

      setProfessor(professorCarregado);
      setAlunos(Array.isArray(listaAlunos) ? listaAlunos : []);
      setTransacoes(Array.isArray(listaTransacoes) ? listaTransacoes : []);
    } catch (err) {
      console.error("Erro ao comunicar com back-end:", err);
      toast.error("Erro ao carregar dados do professor.");
      setProfessor(null);
      setAlunos([]);
      setTransacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const enviarMoedas = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!professor || enviando) return;

    const valor = Number(envio.valor);
    const destinatarioId = Number(envio.alunoId);

    if (!destinatarioId || !valor || valor <= 0) {
      toast.warning("Preencha os dados corretamente.");
      return;
    }

    if (!envio.motivo.trim()) {
      toast.warning("Informe o motivo do envio.");
      return;
    }

    if (valor > professor.saldoCorrente) {
      toast.error("Saldo insuficiente.");
      return;
    }

    const payload = {
      remetenteId: professor.id,
      destinatarioId,
      valor,
      motivo: envio.motivo.trim(),
    };

    setEnviando(true);

    try {
      const res = await fetch("http://localhost:8080/transacoes", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      let body: any = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { erro: text };
      }

      if (res.ok) {
        toast.success("Moedas enviadas com sucesso!");
        setEnvio({ alunoId: "", valor: "", motivo: "" });
        await carregarDados();
        setAbaAtiva("historico");
      } else {
        toast.error(body.erro || "Falha ao realizar transação.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao comunicar com o servidor.");
    } finally {
      setEnviando(false);
    }
  };

  const formatarData = (dataHora: string) => {
    if (!dataHora) return "";
    return dataHora.replace("T", " ").substring(0, 16);
  };

  const totalEnviado = transacoes.reduce((total, item) => total + item.valor, 0);

  const alunoSelecionado = alunos.find(
    (aluno) => aluno.id === Number(envio.alunoId)
  );

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
          Sincronizando painel...
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!professor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080B0F",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <p style={{ color: "#4B5563", fontWeight: 700, margin: 0 }}>
          Professor não encontrado.
        </p>

        <button
          onClick={() => router.push("/")}
          style={{
            background: ACCENT,
            color: "#080B0F",
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: "0.05em",
            border: "none",
            borderRadius: 12,
            padding: "12px 28px",
            cursor: "pointer",
          }}
        >
          Voltar
        </button>
      </div>
    );
  }

  const abas = [
    { id: "enviar", label: "Enviar", count: alunos.length, dot: ACCENT },
    { id: "alunos", label: "Alunos", count: alunos.length, dot: "#60A5FA" },
    { id: "historico", label: "Histórico", count: transacoes.length, dot: "#A882FF" },
  ] as const;

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
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#6B7280",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Voltar
        </button>

        <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 16 }}>/</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
          Painel do Professor
        </span>
        <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 16 }}>/</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#D1D5DB" }}>
          {professor.nome}
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: ACCENT_MUTED,
                border: `2px solid ${ACCENT_BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 900, color: ACCENT }}>
                {professor.nome.charAt(0).toUpperCase()}
              </span>
            </div>

            <h1
              style={{
                margin: "0 0 4px",
                fontSize: 18,
                fontWeight: 800,
                color: "#F9FAFB",
                letterSpacing: "-0.02em",
              }}
            >
              {professor.nome}
            </h1>

            <p
              style={{
                margin: "0 0 16px",
                fontSize: 12,
                color: "#4B5563",
              }}
            >
              {professor.departamento}
            </p>

            <Tag>{professor.instituicaoNome}</Tag>
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
              Saldo para distribuição
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
                {professor.saldoCorrente}
              </span>

              <span
                style={{
                  fontSize: 13,
                  color: "rgba(198,241,53,0.5)",
                  fontWeight: 600,
                }}
              >
                moedas
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <StatCard label="Enviado" value={totalEnviado} sub="moedas" />
            <StatCard label="Envios" value={transacoes.length} />
            <StatCard label="Alunos" value={alunos.length} />
            <StatCard label="ID" value={professor.id} />
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
              Informações
            </span>

            <InfoRow label="Departamento" value={professor.departamento} />
            <InfoRow label="Instituição" value={professor.instituicaoNome} />
            <InfoRow label="Alunos visíveis" value={`${alunos.length}`} />
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

          {abaAtiva === "enviar" && (
            <section>
              <SectionHeader
                dot={ACCENT}
                title="Enviar moedas"
                subtitle="Reconheça um aluno do mesmo curso e instituição do professor."
              />

              <form
                onSubmit={enviarMoedas}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 18,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
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
                    Aluno destinatário
                  </label>

                  <select
                    required
                    value={envio.alunoId}
                    onChange={(e) => setEnvio({ ...envio, alunoId: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#0D1117",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#D1D5DB",
                      padding: "14px 16px",
                      borderRadius: 12,
                      outline: "none",
                    }}
                  >
                    <option value="">Selecionar aluno...</option>

                    {alunos.map((aluno) => (
                      <option key={aluno.id} value={aluno.id}>
                        {aluno.nome} — {aluno.curso} — saldo {aluno.saldoAtual}
                      </option>
                    ))}
                  </select>

                  {alunos.length === 0 && (
                    <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6B7280" }}>
                      Nenhum aluno encontrado para o curso e instituição deste professor.
                    </p>
                  )}
                </div>

                {alunoSelecionado && (
                  <div
                    style={{
                      background: "rgba(96,165,250,0.06)",
                      border: "1px solid rgba(96,165,250,0.15)",
                      borderRadius: 14,
                      padding: 16,
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#F9FAFB",
                      }}
                    >
                      {alunoSelecionado.nome}
                    </p>

                    <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
                      {alunoSelecionado.curso} — {alunoSelecionado.instituicaoNome}
                    </p>

                    <div style={{ marginTop: 10 }}>
                      <Tag color="blue">Saldo atual: {alunoSelecionado.saldoAtual}</Tag>
                    </div>
                  </div>
                )}

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
                    Quantidade de moedas
                  </label>

                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="Ex: 50"
                    value={envio.valor}
                    onChange={(e) => setEnvio({ ...envio, valor: e.target.value })}
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
                    Motivo do reconhecimento
                  </label>

                  <textarea
                    required
                    placeholder="Descreva o motivo do envio..."
                    value={envio.motivo}
                    onChange={(e) => setEnvio({ ...envio, motivo: e.target.value })}
                    rows={5}
                    style={{
                      width: "100%",
                      background: "#0D1117",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#D1D5DB",
                      padding: "14px 16px",
                      borderRadius: 12,
                      outline: "none",
                      resize: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando || alunos.length === 0}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 12,
                    border: "none",
                    cursor: enviando || alunos.length === 0 ? "not-allowed" : "pointer",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background:
                      enviando || alunos.length === 0
                        ? "rgba(255,255,255,0.04)"
                        : ACCENT,
                    color:
                      enviando || alunos.length === 0 ? "#374151" : "#080B0F",
                  }}
                >
                  {enviando ? (
                    <>
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          border: "2px solid rgba(8,11,15,0.3)",
                          borderTopColor: "#080B0F",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Enviando...
                    </>
                  ) : (
                    "Enviar moedas"
                  )}
                </button>
              </form>
            </section>
          )}

          {abaAtiva === "alunos" && (
            <section>
              <SectionHeader
                dot="#60A5FA"
                title="Alunos disponíveis"
                subtitle="Lista filtrada por instituição e curso iguais ao professor."
                count={alunos.length}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alunos.map((aluno) => (
                  <div
                    key={aluno.id}
                    onClick={() => router.push(`/aluno/${aluno.id}`)}
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
                        {aluno.curso} — {aluno.instituicaoNome}
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

                    <Tag color="blue">{aluno.saldoAtual} moedas</Tag>
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
                      Nenhum aluno disponível
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {abaAtiva === "historico" && (
            <section>
              <SectionHeader
                dot="#A882FF"
                title="Histórico de envios"
                subtitle="Moedas já enviadas por este professor."
                count={transacoes.length}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {transacoes.map((transacao) => (
                  <div
                    key={transacao.id}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(168,130,255,0.15)",
                      borderRadius: 16,
                      padding: "18px 20px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 16,
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <h3
                          style={{
                            margin: "0 0 2px",
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#F9FAFB",
                          }}
                        >
                          {transacao.destinatarioNome || "Aluno excluído"}
                        </h3>

                        <span
                          style={{
                            fontSize: 11,
                            color: "#4B5563",
                            fontWeight: 600,
                          }}
                        >
                          Destinatário
                        </span>
                      </div>

                      <div
                        style={{
                          background: "rgba(168,130,255,0.05)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          borderLeft: "2px solid rgba(168,130,255,0.2)",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            color: "#6B7280",
                            lineHeight: 1.5,
                            fontStyle: "italic",
                          }}
                        >
                          "{transacao.motivo}"
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 6,
                      }}
                    >
                      <Tag color="green">+{transacao.valor} moedas</Tag>

                      <span
                        style={{
                          fontSize: 11,
                          color: "#374151",
                          fontWeight: 600,
                        }}
                      >
                        {formatarData(transacao.dataHora)}
                      </span>
                    </div>
                  </div>
                ))}

                {transacoes.length === 0 && (
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
                      Nenhum envio registrado
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