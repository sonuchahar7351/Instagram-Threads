import express from 'express'
import protectRoute from '../middleware/protectRoute.js';
import { sendMessage, getMessages, getConversations } from '../controllers/messageController.js';

const router = express.Router()
 
router.get("/conversations", protectRoute ,getConversations);
router.get("/messages/:otherUserId", protectRoute ,getMessages);
router.post("/send", protectRoute ,sendMessage);



export default router;