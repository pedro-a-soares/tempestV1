import express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { getMessages, sendMessage } from '../controllers/chats.controller';
import { getMessagesSchema, sendMessageSchema } from '../schemas/chats.schema';

const router = express.Router();
router.use(deserializeUser, requireUser);

// Get user info route
router.post('/read', validate(getMessagesSchema), getMessages);
router.post('/send', validate(sendMessageSchema), sendMessage)

export default router;

