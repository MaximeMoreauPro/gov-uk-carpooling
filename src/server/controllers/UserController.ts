import { Request, Response } from 'express';

import {
  CreateUserCommand,
  CreateUserUseCase,
} from '@/application/use-cases/CreateUser.use-case';
import logger from '../logger';

export default class UserController {
  async displayCreateUserForm(res: Response): Promise<void> {
    res.render('user/create');
  }

  async createUser(
    req: Request,
    res: Response,
    createUserUseCase: CreateUserUseCase
  ): Promise<void> {
    const userData: CreateUserCommand = req.body;

    try {
      await createUserUseCase.handle(userData);
      res.render('user/user-created');
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e);
        res.render('pages/error', {
          message: e.message,
        });
      }
    }
  }
}
