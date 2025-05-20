import express from 'express';
import {
  checkOrganization,
  createOrganization,
  listOrganizations,
  updateOrganization,
  joinOrganization,
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
router.put(
  '/update',
  validateRequest('updateOrganization'),
  authenticateToken,
  updateOrganization,
);
router.post(
  '/join',
  validateRequest('joinOrganization'),
  authenticateToken,
  joinOrganization,
);

export default router;
