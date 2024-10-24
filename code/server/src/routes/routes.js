import { Router } from "express";
import { AlunoRoutes } from "../routes/alunoRoutes.js";
import { EmpresaRoutes } from "../routes/empresaRoutes.js";
import { InstituicaoRoutes } from "../routes/instituicaoRoutes.js";
import { ProfessorRoutes } from "../routes/professorRoutes.js";
import { TransacaoRoutes } from "../routes/transacaoRoutes.js";
import { VantagemRoutes } from "../routes/vantagemRoutes.js";

const routes = Router();

routes.use('/aluno', AlunoRoutes);
routes.use('/empresa', EmpresaRoutes);
routes.use('/instituicao', InstituicaoRoutes);
routes.use('/professor', ProfessorRoutes);
routes.use('/transacao', TransacaoRoutes);
routes.use('/vantagem', VantagemRoutes);

export default routes;