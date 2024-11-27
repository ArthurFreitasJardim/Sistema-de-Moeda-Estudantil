import { Router } from "express";
import { InstituicaoController } from "../controllers/InstituicaoController.js";

const router = Router();

const instituicaoController = new InstituicaoController();

router.get('/', instituicaoController.getAll);
router.get('/:id', instituicaoController.getById);
router.post('/', instituicaoController.create);
router.put('/:id', instituicaoController.update);
router.delete('/:id', instituicaoController.delete);

export { router as InstituicaoRoutes };
