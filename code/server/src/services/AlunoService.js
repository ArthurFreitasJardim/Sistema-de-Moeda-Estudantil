import { prismaClient } from '../database/prismaClient.js';

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
            const aluno = await prismaClient.aluno.findUnique({
                where: { id },
                include: { usuario: true },
            });

            if (!aluno) {
                throw new Error('Não possui aluno com o id: ' + id);
            }

            return aluno;
        } catch (error) {
            console.error('Erro ao buscar aluno', error);
            throw new Error('Não foi possível buscar o aluno');
        }
    }

    async createAluno(data) {
        try {
            console.log(data);

            const aluno = await prismaClient.aluno.create({
                data: {
                    saldo: data.saldo,
                    rg: data.rg,
                    cpf: data.cpf,
                    endereco: data.endereco,
                    email: data.email,
                    instituicao: {
                        connect: { id: data.instituicaoId }
                    },
                    usuario: {
                        create: {
                            nome: data.usuario.nome,
                            login: data.usuario.login,
                            senha: data.usuario.senha,
                            tipo: 'ALUNO',
                        }
                    }
                }
            });

            return { aluno };
        } catch (error) {
            console.error('Erro ao criar aluno', error);
            throw new Error('Não foi possível criar o aluno');
        }
    }

    async updateAluno(id, data) {
        const aluno = await prismaClient.aluno.update({
            where: { id },
            data: {
                saldo: data.saldo,
                cpf: data.cpf,
            },
        });

        if (data.usuario) {
            await prismaClient.usuario.update({
                where: { id: aluno.usuarioId },
                data: data.usuario
            });
        }

        return aluno;
    }

    async adicionarMoedasAluno(id, valor) {
        const aluno = await prismaClient.aluno.update({
            where: { id },
            data: {
                saldo: aluno.saldo + valor,
            },
        });
    }

    async removerMoedasAluno(id, valor) {
        const aluno = await prismaClient.aluno.update({
            where: { id },
            data: {
                saldo: aluno.saldo - valor,
            },
        });
    }

    async deleteAluno(alunoId) {
        try {
            const id = parseInt(alunoId)
            const aluno = await this.getAlunoById(id);

            await prismaClient.usuario.delete({ where: { id: aluno.usuarioId } });

            return aluno;
        } catch (error) {
            console.error('Erro ao deletar aluno', error);
            throw new Error('Não foi possível deletar aluno');
        }
    }
}

export default new AlunoService();