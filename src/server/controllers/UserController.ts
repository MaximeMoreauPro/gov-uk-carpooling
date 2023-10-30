import createHttpError from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateUserUseCase } from '@/application/use-cases/CreateUser.use-case';
import { ViewUserRidesUseCase } from '@/application/use-cases/ViewUserRides/ViewUserRides.use-case';
import logger from '../logger';

export default class UserController {
  async displayCreateUserForm(res: Response): Promise<void> {
    res.render('user/create');
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
    createUserUseCase: CreateUserUseCase
  ): Promise<void> {
    try {
      await createUserUseCase.handle(req.body);
      res.render('user/user-created');
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e);
        if (e instanceof ZodError) {
          return next(createHttpError(400, e.message));
        }

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
      const result = await viewUserRidesUseCase.handle({
        userIdOrEmail: email,
      });

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
