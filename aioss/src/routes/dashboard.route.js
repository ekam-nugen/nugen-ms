import express from 'express';
import {
  getCreateOrganizationJson,
  getDashboardData,
  getSidebarData,
} from '../controllers/dashboard.controller.js';

const router = express();

router.get('/create/org/json', getCreateOrganizationJson);
router.get('/dashboard/json', getDashboardData);
router.get('/sidebar/json', getSidebarData); // Assuming this is the same as dashboard data
export default router;
