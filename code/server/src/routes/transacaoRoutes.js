import { Router } from "express";

import { TransacaoController } from "../controllers/TransacaoController.js";

const router = Router();

const transacaoController = new TransacaoController();

router.get('/:id', transacaoController.getById);
router.post('/', transacaoController.create);
router.put('/:id', transacaoController.update);
router.delete('/:id', transacaoController.delete);

export { router as TransacaoRoutes }