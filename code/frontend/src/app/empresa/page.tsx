"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type Empresa = {
  id: number;
  nome: string;
  email: string;
  cnpj: string;
};

type Vantagem = {
  id: number;
  nome: string;
  descricao: string;
  valorMoedas: number;
  quantidadeDisponivel: number;
  empresaId: number;
  empresaNome: string;
};

type FormVantagem = {
  nome: string;
  descricao: string;
  valorMoedas: string;
  quantidadeDisponivel: string;
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

export default function PainelEmpresa() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const empresaId = searchParams.get("id");

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"cadastrar" | "vantagens">(
    "cadastrar"
  );

  const [formVantagem, setFormVantagem] = useState<FormVantagem>({
    nome: "",
    descricao: "",
    valorMoedas: "",
    quantidadeDisponivel: "",
  });

  useEffect(() => {
    carregarDados();
  }, [empresaId]);

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
      if (!empresaId) {
        setEmpresa(null);
        setVantagens([]);
        return;
      }

      const [empresas, vantagensCarregadas] = await Promise.all([
        buscarJson<Empresa[]>("http://localhost:8080/empresas"),
        buscarJson<Vantagem[]>(
          `http://localhost:8080/vantagens/empresa/${empresaId}`
        ),
      ]);

      const empresaEncontrada = empresas.find(
        (item) => item.id === Number(empresaId)
      );

      if (!empresaEncontrada) {
        setEmpresa(null);
        setVantagens([]);
        return;
      }

      setEmpresa(empresaEncontrada);
      setVantagens(Array.isArray(vantagensCarregadas) ? vantagensCarregadas : []);
    } catch (error) {
      console.error("Erro ao carregar empresa:", error);
      toast.error("Erro ao carregar dados da empresa.");
      setEmpresa(null);
      setVantagens([]);
    } finally {
      setLoading(false);
    }
  };

  const cadastrarVantagem = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!empresaId) {
      toast.error("Empresa inválida.");
      return;
    }

    const valorMoedas = Number(formVantagem.valorMoedas);
    const quantidadeDisponivel = Number(formVantagem.quantidadeDisponivel);

    if (!formVantagem.nome.trim()) {
      toast.error("Informe o nome da vantagem.");
      return;
    }

    if (!formVantagem.descricao.trim()) {
      toast.error("Informe a descrição da vantagem.");
      return;
    }

    if (!valorMoedas || valorMoedas <= 0) {
      toast.error("O valor em moedas deve ser maior que zero.");
      return;
    }

    if (!quantidadeDisponivel || quantidadeDisponivel <= 0) {
      toast.error("A quantidade disponível deve ser maior que zero.");
      return;
    }

    const payload = {
      empresaId: Number(empresaId),
      nome: formVantagem.nome.trim(),
      descricao: formVantagem.descricao.trim(),
      valorMoedas,
      quantidadeDisponivel,
    };

    setSalvando(true);

    try {
      const response = await fetch("http://localhost:8080/vantagens", {
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
        toast.success("Vantagem cadastrada com sucesso!");

        setFormVantagem({
          nome: "",
          descricao: "",
          valorMoedas: "",
          quantidadeDisponivel: "",
        });

        await carregarDados();
        setAbaAtiva("vantagens");
      } else {
        toast.error(body.erro || "Erro ao cadastrar vantagem.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar vantagem:", error);
      toast.error("Erro ao comunicar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  const excluirVantagem = async (vantagemId: number) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta vantagem?"
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://localhost:8080/vantagens/${vantagemId}`,
        {
          method: "DELETE",
          cache: "no-store",
        }
      );

      if (response.ok) {
        toast.success("Vantagem excluída com sucesso!");
        await carregarDados();
      } else {
        toast.error("Erro ao excluir vantagem.");
      }
    } catch (error) {
      console.error("Erro ao excluir vantagem:", error);
      toast.error("Erro ao comunicar com o servidor.");
    }
  };

  const formatarCnpj = (cnpj: string) => {
    if (!cnpj) return "Não informado";

    const somenteNumeros = cnpj.replace(/\D/g, "");

    if (somenteNumeros.length !== 14) {
      return cnpj;
    }

    return somenteNumeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  const totalVantagens = vantagens.length;

  const totalUnidadesDisponiveis = vantagens.reduce(
    (total, vantagem) => total + (vantagem.quantidadeDisponivel || 0),
    0
  );

  const vantagensAtivas = vantagens.filter(
    (vantagem) => vantagem.quantidadeDisponivel > 0
  ).length;

  const vantagensEsgotadas = vantagens.filter(
    (vantagem) => vantagem.quantidadeDisponivel <= 0
  ).length;

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
          Carregando painel da empresa...
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!empresa) {
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
          Empresa não encontrada.
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
    { id: "cadastrar", label: "Cadastrar", count: totalVantagens, dot: ACCENT },
    { id: "vantagens", label: "Vantagens", count: totalVantagens, dot: "#60A5FA" },
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
          Painel da Empresa
        </span>

        <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 16 }}>/</span>

        <span style={{ fontSize: 12, fontWeight: 600, color: "#D1D5DB" }}>
          {empresa.nome}
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
                {empresa.nome.charAt(0).toUpperCase()}
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
              {empresa.nome}
            </h1>

            <p
              style={{
                margin: "0 0 16px",
                fontSize: 12,
                color: "#4B5563",
                wordBreak: "break-all",
              }}
            >
              {empresa.email}
            </p>

            <Tag color="green">Empresa parceira</Tag>
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
              Unidades disponíveis
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
                {totalUnidadesDisponiveis}
              </span>

              <span
                style={{
                  fontSize: 13,
                  color: "rgba(198,241,53,0.5)",
                  fontWeight: 600,
                }}
              >
                resgates
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <StatCard label="Vantagens" value={totalVantagens} />
            <StatCard label="Ativas" value={vantagensAtivas} />
            <StatCard label="Esgotadas" value={vantagensEsgotadas} />
            <StatCard label="ID" value={empresa.id} />
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

            <InfoRow label="CNPJ" value={formatarCnpj(empresa.cnpj)} />
            <InfoRow label="E-mail" value={empresa.email} />
            <InfoRow label="Vantagens" value={`${totalVantagens}`} />
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

          {abaAtiva === "cadastrar" && (
            <section>
              <SectionHeader
                dot={ACCENT}
                title="Cadastrar vantagem"
                subtitle="Defina o benefício, valor em moedas e quantidade disponível."
              />

              <form
                onSubmit={cadastrarVantagem}
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
                    Nome da vantagem
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Ex: Desconto de 10%"
                    value={formVantagem.nome}
                    onChange={(event) =>
                      setFormVantagem({
                        ...formVantagem,
                        nome: event.target.value,
                      })
                    }
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
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
                      Valor em moedas
                    </label>

                    <input
                      type="number"
                      min={1}
                      required
                      placeholder="Ex: 100"
                      value={formVantagem.valorMoedas}
                      onChange={(event) =>
                        setFormVantagem({
                          ...formVantagem,
                          valorMoedas: event.target.value,
                        })
                      }
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
                      Quantidade disponível
                    </label>

                    <input
                      type="number"
                      min={1}
                      required
                      placeholder="Ex: 5"
                      value={formVantagem.quantidadeDisponivel}
                      onChange={(event) =>
                        setFormVantagem({
                          ...formVantagem,
                          quantidadeDisponivel: event.target.value,
                        })
                      }
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
                    Descrição
                  </label>

                  <textarea
                    required
                    placeholder="Explique o benefício oferecido ao aluno."
                    value={formVantagem.descricao}
                    onChange={(event) =>
                      setFormVantagem({
                        ...formVantagem,
                        descricao: event.target.value,
                      })
                    }
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
                  disabled={salvando}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 12,
                    border: "none",
                    cursor: salvando ? "not-allowed" : "pointer",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: salvando ? "rgba(255,255,255,0.04)" : ACCENT,
                    color: salvando ? "#374151" : "#080B0F",
                  }}
                >
                  {salvando ? (
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
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar vantagem"
                  )}
                </button>
              </form>
            </section>
          )}

          {abaAtiva === "vantagens" && (
            <section>
              <SectionHeader
                dot="#60A5FA"
                title="Vantagens cadastradas"
                subtitle="Lista de benefícios cadastrados por esta empresa parceira."
                count={vantagens.length}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {vantagens.map((vantagem) => {
                  const esgotada = vantagem.quantidadeDisponivel <= 0;

                  return (
                    <div
                      key={vantagem.id}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${
                          esgotada
                            ? "rgba(248,113,113,0.2)"
                            : "rgba(255,255,255,0.06)"
                        }`,
                        borderRadius: 18,
                        padding: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#374151",
                              display: "block",
                              marginBottom: 4,
                            }}
                          >
                            Vantagem
                          </span>

                          <h3
                            style={{
                              margin: 0,
                              fontSize: 15,
                              fontWeight: 800,
                              color: "#F9FAFB",
                              lineHeight: 1.3,
                            }}
                          >
                            {vantagem.nome}
                          </h3>
                        </div>

                        <Tag color="blue">{vantagem.valorMoedas}m</Tag>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "#6B7280",
                          lineHeight: 1.6,
                        }}
                      >
                        {vantagem.descricao}
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 12,
                            padding: 12,
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 4px",
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#374151",
                            }}
                          >
                            Estoque
                          </p>

                          <p
                            style={{
                              margin: 0,
                              fontSize: 22,
                              fontWeight: 900,
                              color: esgotada ? "#F87171" : ACCENT,
                            }}
                          >
                            {vantagem.quantidadeDisponivel}
                          </p>
                        </div>

                        <div
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 12,
                            padding: 12,
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 4px",
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#374151",
                            }}
                          >
                            Status
                          </p>

                          <div>
                            <Tag color={esgotada ? "red" : "green"}>
                              {esgotada ? "Esgotada" : "Ativa"}
                            </Tag>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => excluirVantagem(vantagem.id)}
                        style={{
                          width: "100%",
                          padding: "11px 0",
                          borderRadius: 12,
                          border: "1px solid rgba(248,113,113,0.2)",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 800,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          background: "rgba(248,113,113,0.08)",
                          color: "#F87171",
                        }}
                      >
                        Excluir vantagem
                      </button>
                    </div>
                  );
                })}

                {vantagens.length === 0 && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "80px 0",
                    }}
                  >
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
                      Nenhuma vantagem cadastrada
                    </p>

                    <p style={{ color: "#374151", fontSize: 12, marginTop: 8 }}>
                      Cadastre uma vantagem para ela aparecer aos alunos.
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