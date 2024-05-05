import express from 'express';
import AiController from '../controllers/aiController';
import { verifyToken } from '../utils/helper';

const router = express.Router();

// All the routes below this function will be protected
router.use(verifyToken);

router.post('/chat',AiController.chat);

export default router;