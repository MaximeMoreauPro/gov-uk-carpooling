import type { RequestHandler, Router } from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';

import user from './user';

export default function routes(router: Router): Router {
  const get = (path: string, handler: RequestHandler) =>
    router.get(path, asyncMiddleware(handler));

  get('/', (req, res) => {
    res.render('pages/index');
  });

  router.use(user());

  return router;
}
