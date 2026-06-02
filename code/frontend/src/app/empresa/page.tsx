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

export default function PainelEmpresa() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const empresaId = searchParams.get("id");

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

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

      const empresas = await buscarJson<Empresa[]>("http://localhost:8080/empresas");

      const empresaEncontrada = empresas.find(
        (item) => item.id === Number(empresaId)
      );

      if (!empresaEncontrada) {
        setEmpresa(null);
        setVantagens([]);
        return;
      }

      const vantagensCarregadas = await buscarJson<Vantagem[]>(
        `http://localhost:8080/vantagens/empresa/${empresaId}`
      );

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

    setSalvando(true);

    const payload = {
      empresaId: Number(empresaId),
      nome: formVantagem.nome.trim(),
      descricao: formVantagem.descricao.trim(),
      valorMoedas,
      quantidadeDisponivel,
    };

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
    const confirmar = window.confirm("Tem certeza que deseja excluir esta vantagem?");

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-emerald-400 font-sans gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold tracking-widest text-xs uppercase">
          Carregando painel da empresa...
        </p>
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

  const totalVantagens = vantagens.length;
  const totalUnidadesDisponiveis = vantagens.reduce(
    (total, vantagem) => total + (vantagem.quantidadeDisponivel || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-slate-500 hover:text-emerald-400 font-bold uppercase mb-4"
          >
            ← Voltar para cadastros
          </button>

          <h1 className="text-3xl md:text-4xl font-black text-emerald-400 uppercase tracking-tight">
            Painel da Empresa
          </h1>

          <p className="text-slate-500 mt-2">
            Cadastro e acompanhamento das vantagens oferecidas pela empresa parceira.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-2xl">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <span className="text-4xl font-black text-emerald-400">
                    {empresa.nome.charAt(0).toUpperCase()}
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-100">
                  {empresa.nome}
                </h2>

                <p className="text-sm text-slate-500 break-all mt-1">
                  {empresa.email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                    CNPJ
                  </p>

                  <p className="text-sm font-bold text-slate-200">
                    {formatarCnpj(empresa.cnpj)}
                  </p>
                </div>

                <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                    ID da empresa
                  </p>

                  <p className="text-sm font-bold text-slate-200">
                    {empresa.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-blue-500 rounded-3xl p-8 shadow-2xl">
              <p className="text-xs text-emerald-100 uppercase font-black tracking-widest mb-2">
                Vantagens cadastradas
              </p>

              <p className="text-5xl font-black text-white">
                {totalVantagens}
              </p>

              <p className="text-sm text-emerald-100 mt-1">
                vantagens disponíveis no sistema
              </p>
            </div>

            <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-800 shadow-2xl">
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-2">
                Unidades disponíveis
              </p>

              <p className="text-4xl font-black text-blue-400">
                {totalUnidadesDisponiveis}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                total de resgates possíveis
              </p>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-8">
            <section className="bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Cadastrar Vantagem
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Defina o nome, descrição, valor em moedas e quantidade disponível.
                </p>
              </div>

              <form onSubmit={cadastrarVantagem} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-black tracking-widest block mb-2">
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
                      className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase font-black tracking-widest block mb-2">
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
                      className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase font-black tracking-widest block mb-2">
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
                    className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase font-black tracking-widest block mb-2">
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
                    className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  disabled={salvando}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                  {salvando ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      CADASTRANDO...
                    </>
                  ) : (
                    "CADASTRAR VANTAGEM"
                  )}
                </button>
              </form>
            </section>

            <section className="bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    Vantagens da Empresa
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Lista de vantagens cadastradas por esta empresa.
                  </p>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl px-5 py-3">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
                    Total
                  </p>

                  <p className="text-xl font-black text-blue-400">
                    {vantagens.length}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {vantagens.map((vantagem) => {
                  const esgotada = vantagem.quantidadeDisponivel <= 0;

                  return (
                    <div
                      key={vantagem.id}
                      className={`bg-[#0f172a] rounded-2xl border p-5 transition-all ${
                        esgotada
                          ? "border-red-500/30"
                          : "border-slate-800 hover:border-emerald-500/40"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">
                            Vantagem
                          </p>

                          <h3 className="text-lg font-black text-slate-100">
                            {vantagem.nome}
                          </h3>
                        </div>

                        <span className="shrink-0 bg-blue-500/10 text-blue-400 text-xs font-black px-4 py-2 rounded-full border border-blue-500/20">
                          {vantagem.valorMoedas} moedas
                        </span>
                      </div>

                      <p className="text-sm text-slate-400 leading-relaxed mb-5">
                        {vantagem.descricao}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-[#1e293b]/70 p-4 rounded-xl border border-slate-800">
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                            Disponíveis
                          </p>

                          <p
                            className={`text-2xl font-black ${
                              esgotada ? "text-red-400" : "text-emerald-400"
                            }`}
                          >
                            {vantagem.quantidadeDisponivel}
                          </p>
                        </div>

                        <div className="bg-[#1e293b]/70 p-4 rounded-xl border border-slate-800">
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">
                            Status
                          </p>

                          <p
                            className={`text-sm font-black uppercase ${
                              esgotada ? "text-red-400" : "text-emerald-400"
                            }`}
                          >
                            {esgotada ? "Esgotada" : "Ativa"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => excluirVantagem(vantagem.id)}
                        className="w-full py-3 rounded-xl font-black text-sm transition-all bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                      >
                        EXCLUIR VANTAGEM
                      </button>
                    </div>
                  );
                })}

                {vantagens.length === 0 && (
                  <div className="md:col-span-2 text-center py-20">
                    <p className="text-slate-600 font-black uppercase text-sm">
                      Nenhuma vantagem cadastrada
                    </p>

                    <p className="text-slate-700 text-sm mt-2">
                      Cadastre uma vantagem para ela aparecer para os alunos.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}