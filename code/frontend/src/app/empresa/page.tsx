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
  empresaId: number;
  empresaNome: string;
};

export default function PainelEmpresa() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const empresaId = searchParams.get("id");

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(true);

  const [formVantagem, setFormVantagem] = useState({
    nome: "",
    descricao: "",
    valorMoedas: "",
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

      const empresaCarregada = await buscarJson<Empresa>(
        `http://localhost:8080/empresas/${empresaId}`
      );

      setEmpresa(empresaCarregada);

      const vantagensCarregadas = await buscarJson<Vantagem[]>(
        `http://localhost:8080/vantagens/empresa/${empresaId}`
      );

      setVantagens(Array.isArray(vantagensCarregadas) ? vantagensCarregadas : []);

    } catch (error) {
      console.error("Erro ao carregar painel da empresa:", error);
      setEmpresa(null);
      setVantagens([]);
    } finally {
      setLoading(false);
    }
  };

  const cadastrarVantagem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empresa) return;

    const valorMoedas = Number(formVantagem.valorMoedas);

    if (!formVantagem.nome.trim() || !formVantagem.descricao.trim() || !valorMoedas || valorMoedas <= 0) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }

    const payload = {
      empresaId: empresa.id,
      nome: formVantagem.nome.trim(),
      descricao: formVantagem.descricao.trim(),
      valorMoedas,
    };

    try {
      const res = await fetch("http://localhost:8080/vantagens", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const texto = await res.text();

      let body: any = {};
      try {
        body = texto ? JSON.parse(texto) : {};
      } catch {
        body = { erro: texto };
      }

      if (res.ok) {
        toast.success("Vantagem cadastrada com sucesso!");
        setFormVantagem({
          nome: "",
          descricao: "",
          valorMoedas: "",
        });
        carregarDados();
      } else {
        toast.error(`Erro ao cadastrar vantagem: ${body.erro || body.message || texto || "Erro desconhecido"}`);
      }

    } catch (error) {
      console.error("Erro ao cadastrar vantagem:", error);
      toast.error("Erro ao comunicar com o back-end.");
    }
  };

  const excluirVantagem = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta vantagem?")) return;

    try {
      const res = await fetch(`http://localhost:8080/vantagens/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (res.ok) {
        carregarDados();
      } else {
        toast.error("Erro ao excluir vantagem.");
      }
    } catch (error) {
      console.error("Erro ao excluir vantagem:", error);
      toast.error("Erro ao comunicar com o back-end.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-emerald-400 font-sans gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest text-xs uppercase">Carregando Painel da Empresa...</p>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-slate-200 gap-6">
        <p className="font-bold text-slate-400">Empresa não encontrada.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <button
              onClick={() => router.push("/")}
              className="text-xs text-slate-500 hover:text-emerald-400 font-bold uppercase mb-4"
            >
              ← Voltar para cadastros
            </button>

            <h1 className="text-3xl font-black text-emerald-400 uppercase tracking-tight">
              Painel da Empresa
            </h1>

            <p className="text-slate-500 font-medium">
              {empresa.nome}
            </p>

            <p className="text-slate-600 text-sm font-medium">
              {empresa.email}
            </p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-3xl border border-emerald-500/30 shadow-xl">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">
              Vantagens Cadastradas
            </p>
            <p className="text-4xl font-black text-emerald-500">
              {vantagens.length}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              CADASTRAR VANTAGEM
            </h2>

            <form onSubmit={cadastrarVantagem} className="space-y-4">
              <input
                type="text"
                placeholder="Nome da vantagem"
                required
                value={formVantagem.nome}
                onChange={(e) => setFormVantagem({ ...formVantagem, nome: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />

              <input
                type="number"
                placeholder="Quantidade de moedas"
                required
                value={formVantagem.valorMoedas}
                onChange={(e) => setFormVantagem({ ...formVantagem, valorMoedas: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />

              <textarea
                placeholder="Descrição da vantagem..."
                required
                value={formVantagem.descricao}
                onChange={(e) => setFormVantagem({ ...formVantagem, descricao: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none transition-all"
              />

              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all">
                CADASTRAR VANTAGEM
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              VANTAGENS DISPONÍVEIS
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[550px] pr-4 custom-scrollbar">
              {vantagens.map((vantagem) => (
                <div
                  key={vantagem.id}
                  className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <p className="font-bold text-slate-100 text-lg">
                        {vantagem.nome}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">
                        {vantagem.empresaNome}
                      </p>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-4 py-2 rounded-full border border-emerald-500/20">
                      {vantagem.valorMoedas} Moedas
                    </span>
                  </div>

                  <div className="bg-[#1e293b]/50 p-3 rounded-xl border border-slate-800/50 mb-4">
                    <p className="text-sm text-slate-400">
                      {vantagem.descricao}
                    </p>
                  </div>

                  <button
                    onClick={() => excluirVantagem(vantagem.id)}
                    className="text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    EXCLUIR VANTAGEM
                  </button>
                </div>
              ))}

              {vantagens.length === 0 && (
                <p className="text-center py-20 text-slate-600 font-bold uppercase text-sm">
                  Nenhuma vantagem cadastrada
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}