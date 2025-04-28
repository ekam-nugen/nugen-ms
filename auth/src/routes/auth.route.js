import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Authentication Routes
 */
router.get('/:provider/login', AuthController.getLoginUrl);
router.get('/:provider/callback', AuthController.handleSocialCallback);
router.post('/email/signup', AuthController.emailSignup);
router.post('/email/login', AuthController.emailLogin);

export default router;
