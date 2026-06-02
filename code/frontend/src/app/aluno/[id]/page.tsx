"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

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

type TransacaoExtrato = {
  id: number;
  professorId: number;
  professorNome: string;
  alunoId: number;
  alunoNome: string;
  valor: number;
  motivo: string;
  dataHora: string;
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

type Resgate = {
  id: number;
  alunoId: number;
  alunoNome: string;
  vantagemId: number;
  vantagemNome: string;
  vantagemDescricao: string;
  valorMoedas: number;
  empresaId: number;
  empresaNome: string;
  dataHora: string;
};

const ACCENT = "#C6F135";
const ACCENT_MUTED = "rgba(198,241,53,0.12)";
const ACCENT_BORDER = "rgba(198,241,53,0.25)";

function Tag({ children, color = "default" }: { children: React.ReactNode; color?: "green" | "purple" | "default" }) {
  const styles: Record<string, React.CSSProperties> = {
    green: { background: "rgba(198,241,53,0.12)", color: ACCENT, border: `1px solid ${ACCENT_BORDER}` },
    purple: { background: "rgba(168,130,255,0.1)", color: "#A882FF", border: "1px solid rgba(168,130,255,0.2)" },
    default: { background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" },
  };
  return (
    <span style={{ ...styles[color], fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: React.ReactNode; sub?: string; accent?: boolean }) {
  return (
    <div style={{ background: accent ? ACCENT_MUTED : "rgba(255,255,255,0.03)", border: `1px solid ${accent ? ACCENT_BORDER : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent ? ACCENT : "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 32, fontWeight: 800, color: accent ? ACCENT : "#F9FAFB", lineHeight: 1.1 }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{sub}</span>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4B5563" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#D1D5DB", textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function SectionHeader({ dot, title, subtitle, count }: { dot: string; title: string; subtitle: string; count?: number }) {
  return (
    <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, display: "inline-block", boxShadow: `0 0 8px ${dot}88` }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#F9FAFB", letterSpacing: "-0.01em" }}>{title}</h2>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#4B5563" }}>{subtitle}</p>
      </div>
      {count !== undefined && (
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#4B5563", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "4px 12px" }}>
          {count} {count === 1 ? "item" : "itens"}
        </span>
      )}
    </div>
  );
}

export default function PerfilAluno() {
  const params = useParams();
  const router = useRouter();
  const alunoId = params.id as string;

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [extrato, setExtrato] = useState<TransacaoExtrato[]>([]);
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [resgates, setResgates] = useState<Resgate[]>([]);
  const [loading, setLoading] = useState(true);
  const [resgatandoId, setResgatandoId] = useState<number | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"extrato" | "vantagens" | "resgates">("extrato");

  useEffect(() => { carregarDados(); }, [alunoId]);

  const buscarJson = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Erro ao buscar ${url}: ${res.status}`);
    return res.json();
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [alunoData, extratoData, vantagensData, resgatesData] = await Promise.all([
        buscarJson<Aluno>(`http://localhost:8080/alunos/${alunoId}`),
        buscarJson<TransacaoExtrato[]>(`http://localhost:8080/transacoes/aluno/${alunoId}`),
        buscarJson<Vantagem[]>("http://localhost:8080/vantagens"),
        buscarJson<Resgate[]>(`http://localhost:8080/resgates/aluno/${alunoId}`),
      ]);
      setAluno(alunoData);
      setExtrato(Array.isArray(extratoData) ? extratoData : []);
      setVantagens(Array.isArray(vantagensData) ? vantagensData : []);
      setResgates(Array.isArray(resgatesData) ? resgatesData : []);
    } catch {
      toast.error("Erro ao carregar dados do aluno.");
      setAluno(null); setExtrato([]); setVantagens([]); setResgates([]);
    } finally {
      setLoading(false);
    }
  };

  const resgatarVantagem = async (vantagem: Vantagem) => {
    if (!aluno) return;
    if (resgates.some(r => r.vantagemId === vantagem.id)) { toast.error("Você já resgatou esta vantagem."); return; }
    if (vantagem.quantidadeDisponivel <= 0) { toast.error("Vantagem esgotada."); return; }
    if (aluno.saldoAtual < vantagem.valorMoedas) { toast.error("Saldo insuficiente."); return; }
    setResgatandoId(vantagem.id);
    try {
      const res = await fetch("http://localhost:8080/resgates", {
        method: "POST", cache: "no-store",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ alunoId: aluno.id, vantagemId: vantagem.id }),
      });
      const text = await res.text();
      let body: any = {};
      try { body = text ? JSON.parse(text) : {}; } catch { body = { erro: text }; }
      if (res.ok) { toast.success("Vantagem resgatada!"); await carregarDados(); }
      else { toast.error(body.erro || "Erro ao resgatar."); }
    } catch { toast.error("Erro ao comunicar com o servidor."); }
    finally { setResgatandoId(null); }
  };

  const formatarData = (d: string) => d ? d.replace("T", " ").substring(0, 16) : "";
  const formatarCpf = (cpf: string) => {
    if (!cpf) return "Não informado";
    const n = cpf.replace(/\D/g, "");
    return n.length === 11 ? n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpf;
  };

  const totalRecebido = extrato.reduce((s, t) => s + t.valor, 0);
  const totalGasto = resgates.reduce((s, r) => s + r.valorMoedas, 0);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080B0F", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${ACCENT_BORDER}`, borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#4B5563", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Carregando perfil...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div style={{ minHeight: "100vh", background: "#080B0F", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <p style={{ color: "#4B5563", fontWeight: 700, margin: 0 }}>Aluno não encontrado.</p>
        <button onClick={() => router.push("/")} style={{ background: ACCENT, color: "#080B0F", fontWeight: 800, fontSize: 13, letterSpacing: "0.05em", border: "none", borderRadius: 12, padding: "12px 28px", cursor: "pointer" }}>Voltar</button>
      </div>
    );
  }

  const abas = [
    { id: "extrato", label: "Extrato", count: extrato.length, dot: ACCENT },
    { id: "vantagens", label: "Vantagens", count: vantagens.length, dot: "#60A5FA" },
    { id: "resgates", label: "Resgates", count: resgates.length, dot: "#A882FF" },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: "#080B0F", color: "#F9FAFB", fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "16px 32px", display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.01)" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.07)", color: "#6B7280", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          ← Voltar
        </button>
        <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 16 }}>/</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Perfil do Aluno</span>
        <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 16 }}>/</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#D1D5DB" }}>{aluno.nome}</span>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px", display: "grid", gridTemplateColumns: "300px 1fr", gap: 32, alignItems: "start" }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 32 }}>

          {/* Avatar + Name card */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: ACCENT_MUTED, border: `2px solid ${ACCENT_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: ACCENT }}>{aluno.nome.charAt(0).toUpperCase()}</span>
            </div>
            <h1 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#F9FAFB", letterSpacing: "-0.02em" }}>{aluno.nome}</h1>
            <p style={{ margin: "0 0 16px", fontSize: 12, color: "#4B5563", wordBreak: "break-all" }}>{aluno.email}</p>
            <Tag color="default">{aluno.instituicaoNome}</Tag>
          </div>

          {/* Saldo */}
          <div style={{ background: `linear-gradient(135deg, rgba(198,241,53,0.08) 0%, rgba(198,241,53,0.03) 100%)`, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 20, padding: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ACCENT, display: "block", marginBottom: 8 }}>Saldo disponível</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: ACCENT, lineHeight: 1, letterSpacing: "-0.04em" }}>{aluno.saldoAtual}</span>
              <span style={{ fontSize: 13, color: "rgba(198,241,53,0.5)", fontWeight: 600 }}>moedas</span>
            </div>
          </div>

          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <StatCard label="Recebido" value={totalRecebido} sub="moedas" />
            <StatCard label="Gasto" value={totalGasto} sub="moedas" />
            <StatCard label="Transações" value={extrato.length} />
            <StatCard label="Resgates" value={resgates.length} />
          </div>

          {/* Info pessoal */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4B5563", display: "block", marginBottom: 12 }}>Informações</span>
            <InfoRow label="Curso" value={aluno.curso} />
            <InfoRow label="CPF" value={formatarCpf(aluno.cpf)} />
            <InfoRow label="RG" value={aluno.rg || "Não informado"} />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 4 }}>
            {abas.map(aba => (
              <button key={aba.id} onClick={() => setAbaAtiva(aba.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", transition: "all 0.15s", background: abaAtiva === aba.id ? "rgba(255,255,255,0.06)" : "transparent", color: abaAtiva === aba.id ? "#F9FAFB" : "#4B5563" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: aba.dot, display: "inline-block", opacity: abaAtiva === aba.id ? 1 : 0.4, boxShadow: abaAtiva === aba.id ? `0 0 6px ${aba.dot}88` : "none" }} />
                {aba.label}
                <span style={{ fontSize: 10, fontWeight: 700, background: abaAtiva === aba.id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)", color: abaAtiva === aba.id ? "#9CA3AF" : "#374151", padding: "1px 7px", borderRadius: 99 }}>{aba.count}</span>
              </button>
            ))}
          </div>

          {/* EXTRATO */}
          {abaAtiva === "extrato" && (
            <section>
              <SectionHeader dot={ACCENT} title="Extrato de moedas" subtitle="Histórico de moedas recebidas por reconhecimento acadêmico." count={extrato.length} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {extrato.map(tx => (
                  <div key={tx.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px", display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start", transition: "border-color 0.15s" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4B5563" }}>Prof.</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#D1D5DB" }}>{tx.professorNome}</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", borderLeft: `2px solid ${ACCENT_BORDER}` }}>
                        <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF", fontStyle: "italic", lineHeight: 1.5 }}>"{tx.motivo}"</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <Tag color="green">+{tx.valor} moedas</Tag>
                      <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>{formatarData(tx.dataHora)}</span>
                    </div>
                  </div>
                ))}
                {extrato.length === 0 && (
                  <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <p style={{ color: "#1F2937", fontWeight: 800, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Nenhuma moeda recebida</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* VANTAGENS */}
          {abaAtiva === "vantagens" && (
            <section>
              <SectionHeader dot="#60A5FA" title="Vantagens disponíveis" subtitle="Cada aluno pode resgatar cada vantagem uma única vez." count={vantagens.length} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {vantagens.map(vantagem => {
                  const jaResgatada = resgates.some(r => r.vantagemId === vantagem.id);
                  const semEstoque = vantagem.quantidadeDisponivel <= 0;
                  const saldoInsuficiente = aluno.saldoAtual < vantagem.valorMoedas;
                  const estaResgatando = resgatandoId === vantagem.id;
                  const bloqueado = jaResgatada || semEstoque || saldoInsuficiente;

                  return (
                    <div key={vantagem.id} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${jaResgatada ? "rgba(168,130,255,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", gap: 12, transition: "border-color 0.15s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1, marginRight: 12 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#374151", display: "block", marginBottom: 4 }}>{vantagem.empresaNome || "Parceiro"}</span>
                          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#F9FAFB", lineHeight: 1.3 }}>{vantagem.nome}</h3>
                        </div>
                        <Tag color="default">{vantagem.valorMoedas}m</Tag>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{vantagem.descricao}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>Estoque: {vantagem.quantidadeDisponivel}</span>
                        {jaResgatada && <Tag color="purple">✓ Resgatada</Tag>}
                      </div>
                      <button
                        disabled={bloqueado || estaResgatando}
                        onClick={() => resgatarVantagem(vantagem)}
                        style={{ width: "100%", padding: "11px 0", borderRadius: 12, border: "none", cursor: bloqueado ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: bloqueado ? "rgba(255,255,255,0.03)" : "#60A5FA", color: bloqueado ? "#374151" : "#080B0F", opacity: bloqueado ? 0.6 : 1 }}
                      >
                        {estaResgatando ? (
                          <><span style={{ width: 12, height: 12, border: "2px solid rgba(8,11,15,0.3)", borderTopColor: "#080B0F", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />Resgatando...</>
                        ) : jaResgatada ? "Já resgatada" : semEstoque ? "Esgotada" : saldoInsuficiente ? "Saldo insuficiente" : "Resgatar"}
                      </button>
                    </div>
                  );
                })}
                {vantagens.length === 0 && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0" }}>
                    <p style={{ color: "#1F2937", fontWeight: 800, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Nenhuma vantagem disponível</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* RESGATES */}
          {abaAtiva === "resgates" && (
            <section>
              <SectionHeader dot="#A882FF" title="Histórico de resgates" subtitle="Vantagens já resgatadas pelo aluno." count={resgates.length} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {resgates.map(resgate => (
                  <div key={resgate.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(168,130,255,0.15)", borderRadius: 16, padding: "18px 20px", display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <h3 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 800, color: "#F9FAFB" }}>{resgate.vantagemNome}</h3>
                        <span style={{ fontSize: 11, color: "#4B5563", fontWeight: 600 }}>{resgate.empresaNome || "Empresa parceira"}</span>
                      </div>
                      <div style={{ background: "rgba(168,130,255,0.05)", borderRadius: 10, padding: "10px 14px", borderLeft: "2px solid rgba(168,130,255,0.2)" }}>
                        <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{resgate.vantagemDescricao}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <Tag color="purple">-{resgate.valorMoedas} moedas</Tag>
                      <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>{formatarData(resgate.dataHora)}</span>
                    </div>
                  </div>
                ))}
                {resgates.length === 0 && (
                  <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <p style={{ color: "#1F2937", fontWeight: 800, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Nenhum resgate realizado</p>
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