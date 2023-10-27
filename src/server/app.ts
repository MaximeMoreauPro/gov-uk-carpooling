import express, { Application } from 'express';
import path from 'path';
import createError from 'http-errors';
import 'reflect-metadata';

import indexRoutes from './routes';
import nunjucksSetup from './utils/nunjucksSetup';
import errorHandler from './errorHandler';

import setUpStaticResources from './middleware/setUpStaticResources';
import setUpWebRequestParsing from './middleware/setupRequestParsing';

export default function createApplication(): Application {
  const app = express();

  app.set('json spaces', 2);
  app.set('trust proxy', true);
  app.set('port', process.env.PORT || 3000);

  app.use(setUpWebRequestParsing());
  app.use(setUpStaticResources());
  nunjucksSetup(app, path);

  app.use('/', indexRoutes(app._router));

  app.use((req, res, next) => next(createError(404, 'Not found')));
  app.use(errorHandler(process.env.NODE_ENV === 'production'));

  return app;
}
