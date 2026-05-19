"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const router = useRouter();

  const [abaAtiva, setAbaAtiva] = useState<"aluno" | "empresa">("aluno");

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

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

  const carregarDados = () => {
    fetch("http://localhost:8080/alunos", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setAlunos(Array.isArray(data) ? data : []))
      .catch(() => setAlunos([]));

    fetch("http://localhost:8080/empresas", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setEmpresas(Array.isArray(data) ? data : []))
      .catch(() => setEmpresas([]));
  };

  const somenteNumeros = (valor: string) => valor.replace(/\D/g, "");

  const cadastrarAluno = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: formAluno.nome.trim(),
      email: formAluno.email.trim().toLowerCase(),
      cpf: somenteNumeros(formAluno.cpf),
      rg: somenteNumeros(formAluno.rg),
      curso: formAluno.curso.trim(),
      instituicaoNome: formAluno.instituicaoNome.trim(),
      senha: formAluno.senha,
    };

    console.log("ENVIANDO ALUNO:", payload);

    try {
      const res = await fetch("http://localhost:8080/alunos", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const texto = await res.text();
      console.log("STATUS:", res.status);
      console.log("RESPOSTA DO BACKEND:", texto);

      let body: any = {};
      try {
        body = texto ? JSON.parse(texto) : {};
      } catch {
        body = { erro: texto };
      }

      if (res.ok) {
        setFormAluno({
          nome: "",
          email: "",
          cpf: "",
          rg: "",
          curso: "",
          instituicaoNome: "",
          senha: "123",
        });
        carregarDados();
      } else {
        alert(`Erro ao cadastrar aluno: ${body.erro || body.message || texto || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      alert("Erro ao comunicar com o back-end.");
    }
  };

  const cadastrarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: formEmpresa.nome.trim(),
      email: formEmpresa.email.trim().toLowerCase(),
      cnpj: somenteNumeros(formEmpresa.cnpj),
      senha: formEmpresa.senha,
    };

    console.log("ENVIANDO EMPRESA:", payload);

    try {
      const res = await fetch("http://localhost:8080/empresas", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const texto = await res.text();
      console.log("STATUS:", res.status);
      console.log("RESPOSTA DO BACKEND:", texto);

      let body: any = {};
      try {
        body = texto ? JSON.parse(texto) : {};
      } catch {
        body = { erro: texto };
      }

      if (res.ok) {
        setFormEmpresa({
          nome: "",
          email: "",
          cnpj: "",
          senha: "123",
        });
        carregarDados();
      } else {
        alert(`Erro ao cadastrar empresa: ${body.erro || body.message || texto || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
      alert("Erro ao comunicar com o back-end.");
    }
  };

  const excluirItem = async (tipo: "alunos" | "empresas", id: number) => {
    if (confirm("Tem certeza que deseja excluir este registro?")) {
      const res = await fetch(`http://localhost:8080/${tipo}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        carregarDados();
      } else {
        alert("Erro ao excluir.");
      }
    }
  };

  const abrirPainelEmpresa = (empresaId: number) => {
    router.push(`/empresa?id=${empresaId}`);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent inline-block">
            SISTEMA DE MOEDAS
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Laboratório de Desenvolvimento de Software - Sprint 02
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-2xl h-fit">
            <div className="flex p-1 bg-[#0f172a] rounded-xl mb-8">
              <button
                onClick={() => setAbaAtiva("aluno")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  abaAtiva === "aluno"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                ALUNO
              </button>

              <button
                onClick={() => setAbaAtiva("empresa")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  abaAtiva === "empresa"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                EMPRESA
              </button>
            </div>

            {abaAtiva === "aluno" ? (
              <form onSubmit={cadastrarAluno} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome"
                  required
                  value={formAluno.nome}
                  onChange={e => setFormAluno({ ...formAluno, nome: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                <input
                  type="email"
                  placeholder="E-mail"
                  required
                  value={formAluno.email}
                  onChange={e => setFormAluno({ ...formAluno, email: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                <input
                  type="text"
                  placeholder="CPF"
                  required
                  value={formAluno.cpf}
                  onChange={e => setFormAluno({ ...formAluno, cpf: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                <input
                  type="text"
                  placeholder="RG"
                  required
                  value={formAluno.rg}
                  onChange={e => setFormAluno({ ...formAluno, rg: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                <input
                  type="text"
                  placeholder="Curso"
                  required
                  value={formAluno.curso}
                  onChange={e => setFormAluno({ ...formAluno, curso: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                <input
                  type="text"
                  placeholder="Instituição"
                  required
                  value={formAluno.instituicaoNome}
                  onChange={e => setFormAluno({ ...formAluno, instituicaoNome: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20">
                  CADASTRAR ALUNO
                </button>
              </form>
            ) : (
              <form onSubmit={cadastrarEmpresa} className="space-y-4">
                <input
                  type="text"
                  placeholder="Razão Social"
                  required
                  value={formEmpresa.nome}
                  onChange={e => setFormEmpresa({ ...formEmpresa, nome: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />

                <input
                  type="email"
                  placeholder="E-mail Corporativo"
                  required
                  value={formEmpresa.email}
                  onChange={e => setFormEmpresa({ ...formEmpresa, email: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />

                <input
                  type="text"
                  placeholder="CNPJ"
                  required
                  value={formEmpresa.cnpj}
                  onChange={e => setFormEmpresa({ ...formEmpresa, cnpj: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20">
                  CADASTRAR EMPRESA
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-xl">
              <h2 className="text-blue-400 font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                ALUNOS CADASTRADOS
              </h2>

              <div className="space-y-3">
                {alunos.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center bg-[#0f172a] p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div>
                      <p className="font-bold text-slate-100">{a.nome}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">
                        {a.curso} {a.instituicaoNome ? `— ${a.instituicaoNome}` : ""}
                      </p>
                    </div>

                    <button
                      onClick={() => excluirItem("alunos", a.id)}
                      className="text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      EXCLUIR
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-xl">
              <h2 className="text-emerald-400 font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                EMPRESAS PARCEIRAS
              </h2>

              <div className="space-y-3">
                {empresas.map((empresa) => (
                  <div
                    key={empresa.id}
                    onClick={() => abrirPainelEmpresa(empresa.id)}
                    className="flex justify-between items-center bg-[#0f172a] p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-100">{empresa.nome}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">
                        Clique para acessar o painel da empresa
                      </p>
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        excluirItem("empresas", empresa.id);
                      }}
                      className="text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      EXCLUIR
                    </button>
                  </div>
                ))}

                {empresas.length === 0 && (
                  <p className="text-center py-8 text-slate-600 font-bold uppercase text-sm">
                    Nenhuma empresa cadastrada
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}