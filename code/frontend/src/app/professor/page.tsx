"use client";

import { useState, useEffect } from "react";

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

export default function PainelProfessor() {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  const [envio, setEnvio] = useState({
    alunoId: "",
    valor: "",
    motivo: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

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
      const listaProfs = await buscarJson<Professor[]>("http://localhost:8080/professores");

      console.log("PROFESSORES:", listaProfs);

      if (!Array.isArray(listaProfs) || listaProfs.length === 0) {
        setProfessor(null);
        setAlunos([]);
        setTransacoes([]);
        return;
      }

      const profLogado = listaProfs[0];
      setProfessor(profLogado);

      const listaAlunos = await buscarJson<Aluno[]>(
        `http://localhost:8080/alunos/professor/${profLogado.id}`
      );

      setAlunos(Array.isArray(listaAlunos) ? listaAlunos : []);

      const listaTransacoes = await buscarJson<Transacao[]>(
        `http://localhost:8080/transacoes/professor/${profLogado.id}`
      );

      setTransacoes(Array.isArray(listaTransacoes) ? listaTransacoes : []);

    } catch (err) {
      console.error("Erro ao comunicar com back-end:", err);
      setProfessor(null);
      setAlunos([]);
      setTransacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const enviarMoedas = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!professor) return;

    const valor = Number(envio.valor);
    const destinatarioId = Number(envio.alunoId);

    if (!destinatarioId || !valor || valor <= 0) {
      alert("Preencha os dados corretamente.");
      return;
    }

    if (valor > professor.saldoCorrente) {
      alert("Saldo insuficiente!");
      return;
    }

    const payload = {
      remetenteId: professor.id,
      destinatarioId,
      valor,
      motivo: envio.motivo,
    };

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

      const body = await res.json();

      if (res.ok) {
        alert("Moedas enviadas com sucesso!");
        setEnvio({ alunoId: "", valor: "", motivo: "" });
        carregarDados();
      } else {
        alert(`Erro: ${body.erro || "Falha ao realizar transação"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao comunicar com o servidor.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-blue-400 font-sans gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest text-xs uppercase">Sincronizando Painel...</p>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-200">
        <p className="font-bold text-slate-400">Nenhum professor encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-black text-blue-400 uppercase tracking-tight">
              Painel do Professor
            </h1>

            <p className="text-slate-500 font-medium">
              {professor.nome} — {professor.departamento}
            </p>

            <p className="text-slate-600 text-sm font-medium">
              {professor.instituicaoNome}
            </p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-3xl border border-blue-500/30 shadow-xl">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">
              Saldo para Distribuição
            </p>
            <p className="text-4xl font-black text-blue-500">
              {professor.saldoCorrente}
              <span className="text-sm font-normal text-slate-400"> Moedas</span>
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              RECONHECER ALUNO
            </h2>

            <form onSubmit={enviarMoedas} className="space-y-4">
              <select
                required
                value={envio.alunoId}
                onChange={(e) => setEnvio({ ...envio, alunoId: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-300"
              >
                <option value="">Selecionar Aluno...</option>

                {alunos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome} — {a.curso} — {a.instituicaoNome} (Saldo: {a.saldoAtual})
                  </option>
                ))}
              </select>

              {alunos.length === 0 && (
                <p className="text-xs text-slate-500">
                  Nenhum aluno encontrado para o curso e instituição deste professor.
                </p>
              )}

              <input
                type="number"
                placeholder="Quantidade de Moedas"
                required
                value={envio.valor}
                onChange={(e) => setEnvio({ ...envio, valor: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <textarea
                placeholder="Descreva o motivo..."
                required
                value={envio.motivo}
                onChange={(e) => setEnvio({ ...envio, motivo: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
              />

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all">
                ENVIAR MOEDAS
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              HISTÓRICO DE ENVIOS
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[550px] pr-4 custom-scrollbar">
              {transacoes.map((t) => (
                <div key={t.id} className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                        Destinatário
                      </p>
                      <span className="font-bold text-slate-100">
                        {t.destinatarioNome || "Aluno Excluído"}
                      </span>
                    </div>

                    <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-4 py-2 rounded-full border border-blue-500/20">
                      + {t.valor} Moedas
                    </span>
                  </div>

                  <div className="bg-[#1e293b]/50 p-3 rounded-xl border border-slate-800/50">
                    <p className="text-sm text-slate-400 italic">"{t.motivo}"</p>
                  </div>

                  <p className="text-[10px] text-slate-600 mt-4 uppercase font-bold text-right">
                    {t.dataHora ? t.dataHora.replace("T", " ").substring(0, 16) : ""}
                  </p>
                </div>
              ))}

              {transacoes.length === 0 && (
                <p className="text-center py-20 text-slate-600 font-bold uppercase text-sm">
                  Nenhum envio registrado
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}