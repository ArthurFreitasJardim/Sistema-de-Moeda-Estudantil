import { prismaClient } from '../database/prismaClient.js';

class AlunoService {

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

    async getAllAlunos() {
        return await prismaClient.aluno.findMany({
            include: { usuario: true },
        });
    }

    async getAlunoById(id) {
        return await prismaClient.aluno.findUnique({
            where: { id },
            include: { usuario: true },
        });
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

    async deleteUsuario(id) {
        // Deleta o aluno e o usuário associado
        try {

            const usuario = await prismaClient.usuario.findUnique({
                where: { id },
            });

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            usuario.prismaClient.usuario.delete({
                where: { id }
            });
        } catch (error) {
            console.error('Erro ao deletar usuario', error);
            throw new Error('Não foi possível deletar usuario');
        }
    }

    async deleteAluno(id) {

        try {
            const aluno = await prismaClient.aluno.delete({ where: { id } });

            await prismaClient.usuario.delete({ where: { id: aluno.usuarioId } });

            return aluno;
        } catch (error) {
            console.error('Erro ao deletar aluno', error);
            throw new Error('Não foi possível deletar aluno');
        }
    }
}

export default new AlunoService();