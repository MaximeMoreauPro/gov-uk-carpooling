import { Application } from 'express';

import configureApplication from './app';

async function createApplication(): Promise<Application> {
  return configureApplication();
}

import logger from './logger';

createApplication()
  .then(app => {
    app.listen(app.get('port'), () => {
      logger.info(`server listening on port: ${app.get('port')}`);
    });
  })
  .catch(error => {
    logger.error(`Failed to start application: ${error.message}`);
  });
