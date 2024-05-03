import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { signupSchema,loginSchema } = require('../utils/validations');

class AuthController {

  async login(req:Request, res:Response) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ success:false, message: error.details[0].message });
      }
  
      const user = await User.findOne({ email: value.email });
      if (!user) {
        return res.status(404).send({ success:false, message: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(value.password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ success:false, message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' });
  
      res.status(200).send({ success:true, message: 'Login successful', token: token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send({ success:false, message: 'Internal server error' });
    }
  }

  async signup(req: Request, res: Response) {
    try {
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
          return res.status(400).send({ success:false, message: error.details[0].message });
        }
    
        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) {
          return res.status(400).send({ success:false, message: 'Email already registered' });
        }
    
        const hashedPassword = await bcrypt.hash(value.password, 10);
    
        const newUser = new User({ username: value.username, email: value.email, password: hashedPassword });
        await newUser.save();
    
        res.status(201).send({ success:true, message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send({ success:false, message: 'Internal server error' });
    }
  }


}

export default new AuthController();
