import { prismaClient } from '../database/prismaClient.js';
import { Util } from '../util/Util.js';

class AlunoService {

    async getAllAlunos() {
        try {
            const alunos = await prismaClient.aluno.findMany({
                include: { usuario: true },
            });
            return alunos;
        } catch (error) {
            console.error('Erro ao buscar alunos', error);
            throw new Error('Não foi possível buscar alunos');
        }
    }

    async getAlunoById(id) {
        try {
            const alunoId = parseInt(id);
            if (isNaN(alunoId)) throw new Error('ID inválido');

            const aluno = await prismaClient.aluno.findUnique({
                where: { id: alunoId },
                include: { usuario: true },
            });

            return aluno;
        } catch (error) {
            console.error('Erro ao buscar aluno', error);
            throw new Error('Não foi possível buscar o aluno');
        }
    }

    async createAluno(data) {
        try {
            if (!data || !data.email || !data.senha || !data.rg || !data.cpf || !data.endereco || !data.instituicao || !data.nome) {
                throw new Error('Dados obrigatórios estão ausentes');
            }

            const { hash, salt } = Util.encryptPassword(data.senha);

            const aluno = await prismaClient.aluno.create({
                data: {
                    saldo: 0,
                    rg: data.rg,
                    cpf: data.cpf,
                    endereco: data.endereco,
                    email: data.email,
                    instituicao: {
                        connect: { id: parseInt(data.instituicao) },
                    },
                    usuario: {
                        create: {
                            nome: data.nome,
                            login: data.email,
                            senha: hash,
                            senha_salt: salt,
                            tipo: "ALUNO",
                        },
                    },
                },
            });

            return aluno;
        } catch (error) {
            console.error('Erro ao criar aluno', error);
            throw new Error('Não foi possível criar o aluno');
        }
    }

    async updateAluno(id, data) {
        try {
            const alunoId = parseInt(id);
            if (isNaN(alunoId)) throw new Error('ID inválido');

            const aluno = await prismaClient.aluno.update({
                where: { id: alunoId },
                data: {
                    saldo: data.saldo,
                    cpf: data.cpf,
                },
            });

            if (data.usuario) {
                await prismaClient.usuario.update({
                    where: { id: aluno.usuarioId },
                    data: data.usuario,
                });
            }

            return aluno;
        } catch (error) {
            console.error('Erro ao atualizar aluno', error);
            throw new Error('Não foi possível atualizar o aluno');
        }
    }

    async adicionarMoedasAluno(id, valor) {
        try {
            const alunoId = parseInt(id);
            if (isNaN(alunoId)) throw new Error('ID inválido');

            const aluno = await prismaClient.aluno.findUnique({
                where: { id: alunoId },
            });

            if (!aluno) throw new Error('Aluno não encontrado');

            const updatedAluno = await prismaClient.aluno.update({
                where: { id: alunoId },
                data: {
                    saldo: aluno.saldo + valor,
                },
            });

            return updatedAluno;
        } catch (error) {
            console.error('Erro ao adicionar moedas', error);
            throw new Error('Não foi possível adicionar moedas');
        }
    }

    async removerMoedasAluno(id, valor) {
        try {
            const alunoId = parseInt(id);
            if (isNaN(alunoId)) throw new Error('ID inválido');

            const aluno = await prismaClient.aluno.findUnique({
                where: { id: alunoId },
            });

            if (!aluno) throw new Error('Aluno não encontrado');

            if (aluno.saldo < valor) throw new Error('Saldo insuficiente');

            const updatedAluno = await prismaClient.aluno.update({
                where: { id: alunoId },
                data: {
                    saldo: aluno.saldo - valor,
                },
            });

            return updatedAluno;
        } catch (error) {
            console.error('Erro ao remover moedas', error);
            throw new Error('Não foi possível remover moedas');
        }
    }

    async deleteAluno(alunoId) {
        try {
            const id = parseInt(alunoId);
            if (isNaN(id)) throw new Error('ID inválido');

            const aluno = await this.getAlunoById(id);
            if (!aluno) throw new Error('Aluno não encontrado');

            await prismaClient.usuario.delete({ where: { id: aluno.usuarioId } });

            return aluno;
        } catch (error) {
            console.error('Erro ao deletar aluno', error);
            throw new Error('Não foi possível deletar aluno');
        }
    }
}

export default new AlunoService();
