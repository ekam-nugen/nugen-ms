import express from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', authMiddleware, ChatController.getAllUserList);
router
  .route('/chat-thread/:chatThreadId')
  .get(authMiddleware, ChatController.getChatByChatThreadId)
  .delete(authMiddleware, ChatController.deleteChatTherad);

router
  .route('/chat-thread')
  .get(authMiddleware, ChatController.getUserChatThreads)
  .post(authMiddleware, ChatController.createChatThread);

// router.route('/create/group-chat').post();

router
  .route('/chat-thread/archive/:chatThreadId')
  .get(authMiddleware, ChatController.archiveChatThread);

router
  .route('/chat-thread/pin/:chatThreadId')
  .get(authMiddleware, ChatController.pinChatThread);

// router.route('');

export default router;
