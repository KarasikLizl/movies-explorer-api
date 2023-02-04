import movieSchema from '../models/movie.js';
import { OK } from '../constants/errors.js';

import BadRequestError from '../errors/bad_req.js';
import NotFoundError from '../errors/not_found.js';
import ForbiddenError from '../errors/forbidden.js';

export const getMovies = (req, res, next) => {
  movieSchema
    .find({})
    .then((movies) => {
      res.status(OK).send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

export const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  movieSchema
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    })
    .then((movie) => {
      res.status(OK).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const deleteMovie = (req, res, next) => {
  movieSchema
    .findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм по этому id не найден');
    })
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        movieSchema.deleteOne(movie).then(() => {
          res.status(OK).send({ message: 'Фильма удален' });
        })
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не можете удалить этот фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Фильм не найден'));
      } else {
        next(err);
      }
    });
};
