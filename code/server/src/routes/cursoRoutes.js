import { Router } from "express";

import { CursoController } from "../controllers/CursoController.js";

const router = Router();

const cursoController = new CursoController();

router.get('/', cursoController.getAll);
router.get('/:id', cursoController.getById);
router.post('/', cursoController.create);
router.put('/:id', cursoController.update);
router.delete('/:id', cursoController.delete);

export { router as CursoRoutes }