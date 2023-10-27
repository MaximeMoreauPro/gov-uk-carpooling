import { Router } from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';
import UserController from '../controllers/UserController';
import { createUserUseCase } from '../use-cases-factories/createUserUseCase';

export default function Index(): Router {
  const router = Router();

  router.get(
    '/user/create',
    asyncMiddleware(async (req, res) => {
      return new UserController().displayCreateUserForm(res);
    })
  );

  router.post(
    '/user/create',
    asyncMiddleware(async (req, res) => {
      return new UserController().createUser(req, res, createUserUseCase());
    })
  );

  return router;
}
