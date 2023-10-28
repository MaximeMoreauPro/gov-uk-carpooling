import { Request, Response } from 'express';

import {
  CreateUserCommand,
  CreateUserUseCase,
} from '@/application/use-cases/CreateUser.use-case';
import logger from '../logger';
import { ViewUserRidesUseCase } from '@/application/use-cases/ViewUserRides/ViewUserRides.use-case';

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

  async viewUserRides(
    req: Request,
    res: Response,
    viewUserRidesUseCase: ViewUserRidesUseCase
  ): Promise<void> {
    const { email } = req.params;
    try {
      const result = await viewUserRidesUseCase.handle({ userEmail: email });

      res.render('pages/error', {
        message: JSON.stringify(result),
      });
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
