import { Router } from "express";
import { AuthRoutes } from "../routes/authRoutes.js";
import { AlunoRoutes } from "../routes/alunoRoutes.js";
import { EmpresaRoutes } from "../routes/empresaRoutes.js";
import { InstituicaoRoutes } from "../routes/instituicaoRoutes.js";
import { ProfessorRoutes } from "../routes/professorRoutes.js";
import { TransacaoRoutes } from "../routes/transacaoRoutes.js";
import { VantagemRoutes } from "../routes/vantagemRoutes.js";
import { CursoRoutes } from "../routes/cursoRoutes.js";

const routes = Router();

routes.use('/aluno', AlunoRoutes);
routes.use('/empresa', EmpresaRoutes);
routes.use('/instituicao', InstituicaoRoutes);
routes.use('/professor', ProfessorRoutes);
routes.use('/transacao', TransacaoRoutes);
routes.use('/vantagem', VantagemRoutes);
routes.use('/curso', CursoRoutes);
routes.use('/login', AuthRoutes);

export default routes;