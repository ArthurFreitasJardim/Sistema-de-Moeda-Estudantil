import { prismaClient } from '../database/prismaClient.js';

class EmpresaService {
  async createEmpresa(data) {
    // Cria o usuário genérico na tabela Usuario
    const usuario = await prismaClient.usuario.create({
      data: {
        nome: data.nome,
        login: data.login,
        senha: data.senha,
        tipo: 'EMPRESA',
      }
    });

    // Cria os dados específicos de empresa e vincula ao usuário
    const empresa = await prismaClient.empresa.create({
      data: {
        usuarioId: usuario.id,
      }
    });

    return { usuario, empresa };
  }

  async getEmpresaById(id) {
    return prismaClient.empresa.findUnique({
      where: { id },
      include: { usuario: true },
    });
  }

  async updateEmpresa(id, data) {
    // Atualiza os dados da empresa e, se necessário, do usuário
    const empresa = await prismaClient.empresa.update({
      where: { id },
      data: {}
    });

    if (data.usuario) {
      await prismaClient.usuario.update({
        where: { id: empresa.usuarioId },
        data: data.usuario
      });
    }

    return empresa;
  }

  async deleteEmpresa(id) {
    // Deleta a empresa e o usuário associado
    const empresa = await prismaClient.empresa.delete({
      where: { id }
    });

    await prismaClient.usuario.delete({
      where: { id: empresa.usuarioId }
    });

    return empresa;
  }

  async cadastrarVantagem(empresaId, vantagemData) {
    return await prismaClient.vantagem.create({
      data: { ...vantagemData, empresaId },
    });
  }
}

export default new EmpresaService();
