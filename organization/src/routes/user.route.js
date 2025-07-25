import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router
  .route('/users')
  .get(authenticateToken, UserController.getAllUserList)
  .patch(authenticateToken, UserController.userActivityStatus);

router
  .route('/user/:userId')
  .get(authenticateToken, UserController.getUserInfoById)
  .put(authenticateToken, UserController.updateUserInfo);

export default router;
