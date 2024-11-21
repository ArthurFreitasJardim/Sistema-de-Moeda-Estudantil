import { prismaClient } from '../database/prismaClient.js';
import { Util } from '../util/Util.js';

class EmpresaService {

  async getAllEmpresas(){
    return prismaClient.empresa.findMany({
      include: { usuario: true },
    });
  }

  async createEmpresa(data) {

    if (!data.nome ||!data.login ||!data.senha ||!data.email) {
      throw new Error('Os dados obrigatórios (nome, login, senha, email) não foram preenchidos.');
    }
    const login = data.login;
    const loginExiste = await prismaClient.usuario.findUnique({
      where: { login: login },
    });

    if (loginExiste) {
      throw new Error('Este login já está em uso.');
    }

    const { hash, salt } = Util.encryptPassword(data.senha);

    const usuario = await prismaClient.usuario.create({
      data: {
        nome: data.nome,
        login: data.login,
        senha: hash,
        senha_salt: salt,
        tipo: 'EMPRESA',
      }
    });

    const empresa = await prismaClient.empresa.create({
      data: {
        usuarioId: usuario.id,
        email: data.email,
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
