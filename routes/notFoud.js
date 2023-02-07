import express from 'express';
import NotFoundError from '../errors/not_found.js';

const notFoundRouter = express.Router();

notFoundRouter.all('*', () => {
  throw new NotFoundError('Страница не найдена');
});

export default notFoundRouter;
