import express from 'express';
import AuthRoutes from './auth.route.js';

const router = express();

router.use(AuthRoutes);

export default router;
