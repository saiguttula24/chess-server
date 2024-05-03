import { Request, Response } from 'express';
import { getIO } from '../utils/socket';
const User = require('../models/userModel');
const { sendFriendRequestSchema,acceptFriendRequestSchema } = require('../utils/validations');

class UserController {
  async sendFriendRequest(req: Request, res: Response) {
    try{
      const { error, value } = sendFriendRequestSchema.validate(req.body);

      if (error) {
        return res.status(400).send({ success:false, message: error.details[0].message });
      }

      const { senderId, receiverId } = value;

      await User.findByIdAndUpdate(senderId, { $addToSet: { friendRequestsSent: receiverId } });
  
      await User.findByIdAndUpdate(receiverId, { $addToSet: { friendRequestsReceived: senderId } });
  
      const io = getIO();
      io.to(receiverId).emit('friendRequest', { senderId });
  
      res.status(200).json({success: true, message: 'Friend request sent successfully' });
    }catch (error) {
      console.error('Error during login:', error);
      res.status(500).send({ success:false, message: 'Internal server error' });
    }
  }

  async acceptFriendRequest(req: Request, res: Response) {
    try{
      const { error, value } = acceptFriendRequestSchema.validate(req.body);

      if (error) {
        return res.status(400).send({ success:false, message: error.details[0].message });
      }

      const { userId, senderId } = value;

      await User.findByIdAndUpdate(userId, { $addToSet: { friends: senderId } });

      await User.findByIdAndUpdate(senderId, { $addToSet: { friends: userId} });

      await User.findByIdAndUpdate(userId, { $pull: { friendRequestsReceived: senderId } });

      await User.findByIdAndUpdate(senderId, { $pull: { friendRequestsSent: userId } });

      const io = getIO();
      io.to(senderId).emit('friendRequestAccepted', { userId });

      res.status(200).json({success:true, message: 'Friend request accepted successfully' });
    }catch (error) {
      console.error('Error during login:', error);
      res.status(500).send({ success:false, message: 'Internal server error' });
    }
  }
}

export default new UserController();

