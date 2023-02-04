import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getMovies,
  createMovie,
  deleteMovie,
} from '../controllers/movies.js';
import { urlRegExp } from '../constants/constants.js';

const moviesRoutes = express.Router();

moviesRoutes.get('/movies', express.json(), getMovies);

moviesRoutes.post('/movies', express.json(), celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(urlRegExp),
    trailerLink: Joi.string().required().regex(urlRegExp),
    thumbnail: Joi.string().required().regex(urlRegExp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

moviesRoutes.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex(),
  }),
}), deleteMovie);

export default moviesRoutes;
