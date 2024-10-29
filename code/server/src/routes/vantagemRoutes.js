import { Router } from "express";

import { VantagemController } from "../controllers/VantagemController.js";

const router = Router();

const vantagemController = new VantagemController();

router.get('/:id', vantagemController.getById);
router.post('/', vantagemController.create);
router.put('/:id', vantagemController.update);
router.delete('/:id', vantagemController.delete);

export { router as VantagemRoutes }