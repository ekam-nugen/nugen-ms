import express from 'express';
import {
  createActivityLog,
  getLogsByOrganisation,
  getUserActivityLog,
} from '../controllers/activity-log.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/user/activity-log', authenticateToken, getUserActivityLog);

router
  .route('/activity-log')
  .post(validateRequest('createActivityLog'), createActivityLog);

router.route('/organization/:organisationId/logs').get(
  // validateRequest('getActivityLogsByOrganisation'),
  getLogsByOrganisation,
);

export default router;
