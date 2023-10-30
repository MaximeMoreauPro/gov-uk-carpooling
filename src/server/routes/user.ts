import { Router } from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';
import UserController from '../controllers/UserController';
import { createUserUseCase } from '../use-cases-factories/createUserUseCase';
import { viewUserRidesUseCase } from '../use-cases-factories/viewUserRidesUseCase';

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
    asyncMiddleware(async (req, res, next) => {
      return new UserController().createUser(
        req,
        res,
        next,
        createUserUseCase()
      );
    })
  );

  router.get(
    '/user/:email/rides',
    asyncMiddleware(async (req, res) => {
      return new UserController().viewUserRides(
        req,
        res,
        viewUserRidesUseCase()
      );
    })
  );

  return router;
}
