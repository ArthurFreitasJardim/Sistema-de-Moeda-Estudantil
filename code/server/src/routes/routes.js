import { Router } from "express";
import { AlunoRoutes } from "../routes/alunoRoutes.js";
import { EmpresaRoutes } from "../routes/empresaRoutes.js";
import { InstituicaoRoutes } from "../routes/instituicaoRoutes.js";
import { ProfessorRoutes } from "../routes/professorRoutes.js";
import { TransacaoRoutes } from "../routes/transacaoRoutes.js";
import { VantagemRoutes } from "../routes/vantagemRoutes.js";

const routes = Router();

routes.use('/aluno', AlunoRoutes)
      .use('/empresa', EmpresaRoutes)
      .use('/instituicao', InstituicaoRoutes)
      .use('/professor', ProfessorRoutes)
      .use('/transacao', TransacaoRoutes)
      .use('/vantagem', VantagemRoutes);



export default routes;