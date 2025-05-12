import express from 'express';
import OrgRoutes from './organization.route.js';

const router = express();

router.use(OrgRoutes);

export default router;
