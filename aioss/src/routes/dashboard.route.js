import express from 'express';
import {
  getCreateOrganizationJson,
  getDashboardData,
  getlayoutData,
} from '../controllers/dashboard.controller.js';

const router = express();

router.get('/create/org/json', getCreateOrganizationJson);
router.get('/dashboard/json', getDashboardData);
router.get('/layout/json', getlayoutData);

export default router;
