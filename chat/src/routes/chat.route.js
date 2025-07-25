import express from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', authMiddleware, ChatController.getAllUserList);
router
  .route('/chat-thread/:chatThreadId')
  .get(authMiddleware, ChatController.getChatByChatThreadId)
  .delete(authMiddleware, ChatController.deleteChatThread);

router
  .route('/chat-thread/:chatThreadId/participants')
  .get(authMiddleware, ChatController.getChatThreadInfo)
  .put(authMiddleware, ChatController.updateChatParticipantsInfo);

router
  .route('/chat-thread')
  .get(authMiddleware, ChatController.getUserChatThreads)
  .post(authMiddleware, ChatController.createChatThread);

router
  .route('/create/group-chat')
  .post(authMiddleware, ChatController.createGroupChat);

router //temporary route
  .route('/chat-thread/archive/:chatThreadId')
  .get(authMiddleware, ChatController.archiveChatThread);

router //temporary route
  .route('/chat-thread/pin/:chatThreadId')
  .get(authMiddleware, ChatController.pinChatThread);

router
  .route('/chat-thread/:method/:chatThreadId')
  .get(authMiddleware, ChatController.updateChatThreadStatus);

export default router;
