import EmpresaService from '../services/EmpresaService.js';

export class EmpresaController {
  async create(req, res) {
    const data = req.body;
    const empresa = await EmpresaService.createEmpresa(data);
    return res.status(201).json(empresa);
  }

  async getById(req, res) {
    const { id } = req.params;
    const empresa = await EmpresaService.getEmpresaById(id);
    return res.status(200).json(empresa);
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const empresa = await EmpresaService.updateEmpresa(id, data);
    return res.status(200).json(empresa);
  }

  async delete(req, res) {
    const { id } = req.params;
    await EmpresaService.deleteEmpresa(id);
    return res.status(204).send();
  }

  async cadastrarVantagem(req, res) {
    const { id } = req.params;  // ID da empresa
    const vantagemData = req.body;  // Dados da vantagem
    const vantagem = await EmpresaService.cadastrarVantagem(id, vantagemData);
    return res.status(201).json(vantagem);
  }
}

export default new EmpresaController();
