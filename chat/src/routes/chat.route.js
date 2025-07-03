import express from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', authMiddleware, ChatController.getAllUserList);
router
  .route('/chat-thread/:chatThreadId')
  .get(authMiddleware, ChatController.getChatByChatThreadId);

router
  .route('/chat-thread')
  .get(authMiddleware, ChatController.getUserChatThreads)
  .post(authMiddleware, ChatController.createChatThread);

router
  .route('/chat-thread/archive/:chatThreadId')
  .get(authMiddleware, ChatController.archiveChatThread);

export default router;
