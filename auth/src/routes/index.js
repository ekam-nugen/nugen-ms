import express from 'express';
import AuthRoutes from './auth.route.js';
// import EntityRoutes from './entity.route.js';
// import RoleRoutes from './role.route.js';
import ActiveRoutes from './activity.route.js';

const router = express();

router.use(AuthRoutes);
// router.use(EntityRoutes);
// router.use(RoleRoutes);
router.use(ActiveRoutes);

export default router;
