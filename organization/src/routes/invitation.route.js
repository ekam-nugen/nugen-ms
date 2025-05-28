import express from 'express';
import { validateRequest } from '../middleware/validate-request.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { createInvitation } from '../controllers/invitation.controller.js';

const router = express.Router();

router.post(
  '/invitation/create',
  validateRequest('createInvitation'),
  authenticateToken,
  createInvitation,
);

export default router;
