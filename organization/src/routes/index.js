import express from 'express';
import OrgRoutes from './organization.route.js';
import UserRoutes from './user.route.js';
import InvitationRoutes from './invitation.route.js';

const router = express();

router.use(OrgRoutes, InvitationRoutes, UserRoutes);

export default router;
