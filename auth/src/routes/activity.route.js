import express from 'express';
import {
  createActivityLog,
  getLogsByOrganisation,
} from '../controllers/activity-log.controller.js';
import { validateRequest } from '../middleware/validate-request.js';

const router = express.Router();

router
  .route('/activity-log')
  .post(validateRequest('createActivityLog'), createActivityLog);

router.route('/organization/:organisationId/logs').get(
  // validateRequest('getActivityLogsByOrganisation'),
  getLogsByOrganisation,
);
export default router;
