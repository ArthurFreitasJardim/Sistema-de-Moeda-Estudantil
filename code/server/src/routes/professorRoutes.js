import { Router } from "express";

import { ProfessorController } from "../controllers/ProfessorController.js";

const router = Router();

const professorController = new ProfessorController();

router.get('/', professorController.getAll);
router.get('/:id', professorController.getById);
router.post('/', professorController.create);
router.put('/:id', professorController.update);
router.delete('/:id', professorController.delete);

export { router as ProfessorRoutes }