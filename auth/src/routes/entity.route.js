import express from 'express';
import { EntityController } from '../controllers/entity.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/sync/entities', EntityController.syncEntities);
router
  .route('/entities')
  .get(authenticateToken, EntityController.getEntitiesData);

router
  .route('/entity/route')
  .post(authenticateToken, EntityController.createEntityRoute);

export default router;
