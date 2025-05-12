import express from 'express';
import {
  checkOrganization,
  createOrganization,
  listOrganizations,
} from '../controllers/organization.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/create',
  validateRequest('createOrganization'),
  authenticateToken,
  createOrganization,
);
router.post(
  '/check',
  validateRequest('checkOrganization'),
  authenticateToken,
  checkOrganization,
);
router.get('/list', authenticateToken, listOrganizations);

export default router;
