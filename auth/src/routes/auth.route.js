import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { TokenController } from '../controllers/token.controller.js';

const router = express.Router();

/**
 * Authentication Routes
 */
router.get('/:provider/login', AuthController.getLoginUrl);
router.get('/:provider/callback', AuthController.handleSocialCallback);
router.post(
  '/email/signup',
  validateRequest('signup'),
  AuthController.emailSignup,
);
router.post(
  '/email/login',
  validateRequest('login'),
  AuthController.emailLogin,
);
router.post(
  '/change-password',
  validateRequest('changePassword'),
  AuthController.changePassword,
);
router.post(
  '/forgot-password',
  validateRequest('forgotPassword'),
  AuthController.forgotPassword,
);
router.post(
  '/reset-password',
  validateRequest('resetPassword'),
  AuthController.resetPassword,
);

router.post(
  '/validate',
  validateRequest('validateToken'),
  TokenController.validateToken,
);

export default router;
