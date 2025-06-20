import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', authenticateToken, UserController.getAllUserList);

export default router;
