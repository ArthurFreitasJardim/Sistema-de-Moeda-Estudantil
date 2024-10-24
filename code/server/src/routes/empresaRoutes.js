import { Router } from "express";

import { EmpresaController } from "../controllers/EmpresaController.js";

const router = Router();

const empresaController = new EmpresaController();

router.get('/', empresaController.getById);
router.post('/', empresaController.create);
router.put('/:id', empresaController.update);
router.delete('/:id', empresaController.delete);

export { router as EmpresaRoutes }