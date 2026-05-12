"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // Estados para Alunos
  const [alunos, setAlunos] = useState([]);
  const [formAluno, setFormAluno] = useState({ nome: "", email: "", cpf: "", rg: "", curso: "", senha: "123" });

  // Estados para Empresas
  const [empresas, setEmpresas] = useState([]);
  const [formEmpresa, setFormEmpresa] = useState({ nome: "", email: "", cnpj: "", senha: "123" });

  // Carregar dados ao iniciar
  useEffect(() => {
    fetchAlunos();
    fetchEmpresas();
  }, []);

  // --- FUNÇÕES DE ALUNO ---
  const fetchAlunos = async () => {
    try {
      const res = await fetch("http://localhost:8080/alunos");
      const data = await res.json();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  const handleCadastrarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8080/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formAluno),
      });
      setFormAluno({ nome: "", email: "", cpf: "", rg: "", curso: "", senha: "123" });
      fetchAlunos();
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    }
  };

  const handleDeletarAluno = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/alunos/${id}`, { method: "DELETE" });
      fetchAlunos();
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
    }
  };

  // --- FUNÇÕES DE EMPRESA ---
  const fetchEmpresas = async () => {
    try {
      const res = await fetch("http://localhost:8080/empresas");
      const data = await res.json();
      setEmpresas(data);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    }
  };

  const handleCadastrarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8080/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEmpresa),
      });
      setFormEmpresa({ nome: "", email: "", cnpj: "", senha: "123" });
      fetchEmpresas();
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
    }
  };

  const handleDeletarEmpresa = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/empresas/${id}`, { method: "DELETE" });
      fetchEmpresas();
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
    }
  };

  // --- INTERFACE ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Moeda Estudantil</h1>
          <p className="text-gray-500 mt-2">Painel de Administração - Release 1</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COLUNA: ALUNOS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-blue-700">Gestão de Alunos</h2>
            
            {/* Formulário Aluno */}
            <form onSubmit={handleCadastrarAluno} className="flex flex-col gap-3 mb-8">
              <input type="text" placeholder="Nome Completo" value={formAluno.nome} onChange={(e) => setFormAluno({ ...formAluno, nome: e.target.value })} className="p-2 border rounded focus:ring-2 focus:ring-blue-200 outline-none" required />
              <input type="email" placeholder="E-mail" value={formAluno.email} onChange={(e) => setFormAluno({ ...formAluno, email: e.target.value })} className="p-2 border rounded focus:ring-2 focus:ring-blue-200 outline-none" required />
              <div className="flex gap-3">
                <input type="text" placeholder="CPF" value={formAluno.cpf} onChange={(e) => setFormAluno({ ...formAluno, cpf: e.target.value })} className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-200 outline-none" required />
                <input type="text" placeholder="RG" value={formAluno.rg} onChange={(e) => setFormAluno({ ...formAluno, rg: e.target.value })} className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-200 outline-none" required />
              </div>
              <input type="text" placeholder="Instituição" value={formAluno.curso} onChange={(e) => setFormAluno({ ...formAluno, curso: e.target.value })} className="p-2 border rounded focus:ring-2 focus:ring-blue-200 outline-none" required />
              <button type="submit" className="bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition-colors">Cadastrar Aluno</button>
            </form>

            {/* Lista Alunos */}
            <h3 className="font-medium text-gray-600 mb-3 border-b pb-2">Alunos Cadastrados</h3>
            <ul className="flex flex-col gap-3">
              {alunos.map((aluno: any) => (
                <li key={aluno.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                  <div>
                    <p className="font-semibold text-gray-800">{aluno.nome}</p>
                    <p className="text-xs text-gray-500">{aluno.curso} | CPF: {aluno.cpf}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">Saldo: {aluno.saldoAtual} moedas</p>
                  </div>
                  <button onClick={() => handleDeletarAluno(aluno.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Excluir</button>
                </li>
              ))}
              {alunos.length === 0 && <p className="text-sm text-gray-400">Nenhum aluno encontrado.</p>}
            </ul>
          </div>

          {/* COLUNA: EMPRESAS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-purple-700">Gestão de Empresas</h2>
            
            {/* Formulário Empresa */}
            <form onSubmit={handleCadastrarEmpresa} className="flex flex-col gap-3 mb-8">
              <input type="text" placeholder="Razão Social / Nome" value={formEmpresa.nome} onChange={(e) => setFormEmpresa({ ...formEmpresa, nome: e.target.value })} className="p-2 border rounded focus:ring-2 focus:ring-purple-200 outline-none" required />
              <input type="email" placeholder="E-mail de Contato" value={formEmpresa.email} onChange={(e) => setFormEmpresa({ ...formEmpresa, email: e.target.value })} className="p-2 border rounded focus:ring-2 focus:ring-purple-200 outline-none" required />
              <input type="text" placeholder="CNPJ" value={formEmpresa.cnpj} onChange={(e) => setFormEmpresa({ ...formEmpresa, cnpj: e.target.value })} className="p-2 border rounded focus:ring-2 focus:ring-purple-200 outline-none" required />
              <button type="submit" className="bg-purple-600 text-white font-medium py-2 rounded hover:bg-purple-700 transition-colors">Cadastrar Empresa</button>
            </form>

            {/* Lista Empresas */}
            <h3 className="font-medium text-gray-600 mb-3 border-b pb-2">Empresas Cadastradas</h3>
            <ul className="flex flex-col gap-3">
              {empresas.map((empresa: any) => (
                <li key={empresa.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                  <div>
                    <p className="font-semibold text-gray-800">{empresa.nome}</p>
                    <p className="text-xs text-gray-500">{empresa.email} | CNPJ: {empresa.cnpj}</p>
                  </div>
                  <button onClick={() => handleDeletarEmpresa(empresa.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Excluir</button>
                </li>
              ))}
              {empresas.length === 0 && <p className="text-sm text-gray-400">Nenhuma empresa encontrada.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}