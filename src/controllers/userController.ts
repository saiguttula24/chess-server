import { Request, Response } from 'express';

class UserController {
  getUsers(req: Request, res: Response) {
    res.send('List of users');
  }
}

export default new UserController();
