import express from 'express';
import ChatRouter from './chat.route.js';

const router = express();

router.use(ChatRouter);

export default router;
