import { Router } from "express";

import { AlunoController } from "../controllers/AlunoController.js";

const router = Router();

const alunoController = new AlunoController();

router.get('/', alunoController.getAll);
router.get('/:id', alunoController.getById);
router.post('/', alunoController.create);
router.put('/:id', alunoController.update);
router.delete('/:id', alunoController.delete);

export { router as AlunoRoutes }