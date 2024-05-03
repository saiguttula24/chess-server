import express from 'express';
import UserController from '../controllers/userController';
import { verifyToken } from '../utils/helper';

const router = express.Router();

// All the routes below this function will be protected
router.use(verifyToken);

router.post('/sendFriendRequest', UserController.sendFriendRequest);
router.post('/acceptFriendRequest', UserController.acceptFriendRequest);

export default router;
