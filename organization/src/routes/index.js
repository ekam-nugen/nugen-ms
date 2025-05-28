import express from 'express';
import OrgRoutes from './organization.route.js';
import InvitationRoutes from './invitation.route.js';

const router = express();

router.use(OrgRoutes, InvitationRoutes);

export default router;
