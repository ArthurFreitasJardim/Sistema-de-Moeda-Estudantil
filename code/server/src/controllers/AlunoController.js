import AlunoService from '../services/AlunoService.js';

export class AlunoController {
  async getAll(req, res) {
    try {
      const alunos = await AlunoService.getAllAlunos();

      if (!alunos || alunos.length === 0) {
        return res.status(404).json({ message: 'Nenhum aluno encontrado.' });
      }

      return res.status(200).json(alunos);
    } catch (error) {
      res.status(500).json({
        message: `Não foi possível recuperar os alunos. Tente novamente mais tarde. Erro: ${error.message}`,
      });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const aluno = await AlunoService.getAlunoById(parseInt(id));

      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado.' });
      }

      return res.status(200).json(aluno);
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível buscar o aluno ${id}. Erro: ${error.message}`,
      });
    }
  }

  async create(req, res) {
    try {
      const data = req.body;
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'Os dados do aluno são obrigatórios.' });
      }

      const aluno = await AlunoService.createAluno(data);
      return res.status(201).json(aluno);
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível cadastrar o aluno. Erro: ${error.message}`,
      });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const aluno = await AlunoService.getAlunoById(parseInt(id));

      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado.' });
      }

      const newAluno = await AlunoService.updateAluno(parseInt(id), data);
      return res.status(200).json(newAluno);
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível atualizar o aluno ${id}. Erro: ${error.message}`,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const aluno = await AlunoService.getAlunoById(parseInt(id));

      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado.' });
      }

      await AlunoService.deleteAluno(parseInt(id));
      return res.status(204).send();
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível excluir o aluno ${id}. Erro: ${error.message}`,
      });
    }
  }

  async consultarExtrato(req, res) {
    const { id } = req.params;
    try {
      const extrato = await AlunoService.consultarExtrato(parseInt(id));

      if (!extrato) {
        return res.status(404).json({ message: 'Extrato não encontrado para o aluno.' });
      }

      return res.status(200).json(extrato);
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível consultar o extrato do aluno ${id}. Erro: ${error.message}`,
      });
    }
  }

  async trocarMoeda(req, res) {
    const { id } = req.params;
    const { vantagemId, valor } = req.body;

    try {
      if (!vantagemId || !valor) {
        return res.status(400).json({ message: 'VantagemId e valor são obrigatórios.' });
      }

      const resultado = await AlunoService.trocarMoeda(parseInt(id), vantagemId, valor);
      return res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível realizar a troca de moedas para o aluno ${id}. Erro: ${error.message}`,
      });
    }
  }

  async receberMoeda(req, res) {
    const { id } = req.params;
    const { valor } = req.body;

    try {
      if (!valor) {
        return res.status(400).json({ message: 'Valor é obrigatório.' });
      }

      const resultado = await AlunoService.receberMoeda(parseInt(id), valor);
      return res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível processar o recebimento de moedas para o aluno ${id}. Erro: ${error.message}`,
      });
    }
  }
}
