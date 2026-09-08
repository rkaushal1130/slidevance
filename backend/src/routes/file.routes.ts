import { Router } from 'express';
import { fileController } from '../controllers/file.controller.js';

const router = Router();

router.get('/portfolio/:filename', (req, res, next) => {
  fileController.getPortfolioFile(req, res, next);
});

router.get('/:filenameOrId', (req, res, next) => {
  fileController.getPortfolioFile(req, res, next);
});

export default router;
