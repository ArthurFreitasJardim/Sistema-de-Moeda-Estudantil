import { prismaClient } from '../database/prismaClient.js';

class AlunoService {

    async createAluno(data) {
        const usuario = await prismaClientClient.usuario.create({
            data: {
                nome: data.nome,
                login: data.login,
                senha: data.senha,
                tipo: 'ALUNO',
            }
        });

        const aluno = await prismaClientClient.aluno.create({
            data: {
                saldo: data.saldo,
                rg: data.rg,
                cpf: data.cpf,
                endereco: data.endereco,
                usuarioId: usuario.id,
            }
        });

        return { usuario, aluno };
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

    async deleteAluno(id) {
        const aluno =  await prismaClient.aluno.delete({ where: { id } });

        await prismaClient.usuario.delete({ where: { id: aluno.usuarioId } });

        return aluno;
    }
}

export default new AlunoService();