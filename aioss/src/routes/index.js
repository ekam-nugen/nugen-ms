import express from 'express';
import dashboardRoutes from './dashboard.route.js';

const router = express();

router.use(dashboardRoutes);

export default router;
