"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function PerfilAluno() {
  const params = useParams();
  const router = useRouter();

  const alunoId = params.id as string;

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [extrato, setExtrato] = useState<TransacaoExtrato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [alunoId]);

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
      if (!alunoId) {
        setAluno(null);
        setExtrato([]);
        return;
      }

      const alunoCarregado = await buscarJson<Aluno>(
        `http://localhost:8080/alunos/${alunoId}`
      );

      setAluno(alunoCarregado);

      const extratoCarregado = await buscarJson<TransacaoExtrato[]>(
        `http://localhost:8080/transacoes/aluno/${alunoId}`
      );

      setExtrato(Array.isArray(extratoCarregado) ? extratoCarregado : []);
    } catch (error) {
      console.error("Erro ao carregar perfil do aluno:", error);
      setAluno(null);
      setExtrato([]);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataHora: string) => {
    if (!dataHora) return "";

    return dataHora.replace("T", " ").substring(0, 16);
  };

  const formatarCpf = (cpf: string) => {
    if (!cpf) return "Não informado";

    const somenteNumeros = cpf.replace(/\D/g, "");

    if (somenteNumeros.length !== 11) {
      return cpf;
    }

    return somenteNumeros.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-blue-400 font-sans gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest text-xs uppercase">
          Carregando perfil do aluno...
        </p>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-slate-200 gap-6">
        <p className="font-bold text-slate-400">Aluno não encontrado.</p>

        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-slate-500 hover:text-blue-400 font-bold uppercase mb-4"
          >
            ← Voltar para cadastros
          </button>

          <h1 className="text-3xl md:text-4xl font-black text-blue-400 uppercase tracking-tight">
            Perfil do Aluno
          </h1>

          <p className="text-slate-500 mt-2">
            Consulta de dados acadêmicos, saldo e extrato de moedas recebidas.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-2xl">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                  <span className="text-4xl font-black text-blue-400">
                    {aluno.nome.charAt(0).toUpperCase()}
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-100">
                  {aluno.nome}
                </h2>

                <p className="text-sm text-slate-500 break-all mt-1">
                  {aluno.email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                    Curso
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {aluno.curso}
                  </p>
                </div>

                <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                    Instituição
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {aluno.instituicaoNome}
                  </p>
                </div>

                <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                    CPF
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {formatarCpf(aluno.cpf)}
                  </p>
                </div>

                <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                    RG
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {aluno.rg || "Não informado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-emerald-500 rounded-3xl p-8 shadow-2xl">
              <p className="text-xs text-blue-100 uppercase font-black tracking-widest mb-2">
                Saldo atual
              </p>

              <p className="text-5xl font-black text-white">
                {aluno.saldoAtual}
              </p>

              <p className="text-sm text-blue-100 mt-1">
                moedas disponíveis
              </p>
            </div>
          </aside>

          <main className="lg:col-span-3 bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Extrato de Moedas
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Histórico de moedas recebidas por reconhecimento acadêmico.
                </p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl px-5 py-3">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
                  Total de recebimentos
                </p>

                <p className="text-xl font-black text-emerald-400">
                  {extrato.length}
                </p>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[650px] pr-2 custom-scrollbar">
              {extrato.map((transacao) => (
                <div
                  key={transacao.id}
                  className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                        Professor
                      </p>

                      <p className="font-bold text-slate-100">
                        {transacao.professorNome}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <span className="inline-flex bg-emerald-500/10 text-emerald-400 text-xs font-bold px-4 py-2 rounded-full border border-emerald-500/20">
                        + {transacao.valor} moedas
                      </span>

                      <p className="text-[10px] text-slate-600 mt-2 uppercase font-bold">
                        {formatarData(transacao.dataHora)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">
                      Motivo
                    </p>

                    <p className="text-sm text-slate-300 italic">
                      "{transacao.motivo}"
                    </p>
                  </div>
                </div>
              ))}

              {extrato.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-slate-600 font-black uppercase text-sm">
                    Nenhuma moeda recebida ainda
                  </p>

                  <p className="text-slate-700 text-sm mt-2">
                    Quando um professor enviar moedas, elas aparecerão aqui.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}