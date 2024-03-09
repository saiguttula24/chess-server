import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { signupSchema,loginSchema } = require('../utils/validations');

class AuthController {

  async login(req: Request, res: Response) {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
    
        const user = await User.findOne({ email: value.email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const passwordMatch = await bcrypt.compare(value.password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Incorrect password' });
        }
    
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }

  async signup(req: Request, res: Response) {
    try {
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
    
        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already registered' });
        }
    
        const hashedPassword = await bcrypt.hash(value.password, 10);
    
        const newUser = new User({ username: value.username, email: value.email, password: hashedPassword });
        await newUser.save();
    
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }


}

export default new AuthController();
