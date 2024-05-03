const Joi = require('joi');

const signupSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"|,.<>?]{8,30}$')).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"|,.<>?]{8,30}$')).required(),
});

const sendFriendRequestSchema = Joi.object({
    senderId: Joi.string().alphanum().required(),
    receiverId: Joi.string().alphanum().required()
})

const acceptFriendRequestSchema = Joi.object({
    userId: Joi.string().alphanum().required(), 
    senderId: Joi.string().alphanum().required()
})
  
module.exports = { signupSchema,loginSchema,sendFriendRequestSchema,acceptFriendRequestSchema};