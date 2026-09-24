import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { validateBody } from '../middlewares/validate.middleware';
import {
  CreateProjectSchema,
  CreateProjectFeedbackSchema,
} from '../dtos/project.dto';

const router = Router();

// Cadastrar novo projeto com relacionamentos (Profile 1:N e Technology N:N)
router.post('/', validateBody(CreateProjectSchema), (req, res, next) => {
  projectController.create(req, res, next);
});

// Listar projetos com suporte a filtragem por tecnologia e paginação (page & limit)
router.get('/', (req, res, next) => {
  projectController.getAll(req, res, next);
});

// Buscar projeto detalhado por ID
router.get('/:id', (req, res, next) => {
  projectController.getById(req, res, next);
});

// Incrementar curtidas/estrelas (upvote)
router.put('/:id/upvote', (req, res, next) => {
  projectController.upvote(req, res, next);
});

// Cadastrar feedback diretamente no projeto (com cálculo e atualização da nota média)
router.post(
  '/:id/feedbacks',
  validateBody(CreateProjectFeedbackSchema),
  (req, res, next) => {
    projectController.addFeedback(req, res, next);
  }
);

export default router;
