import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userSchema from '../models/user.js';
import { MONGO_DUPLICATE_ERROR, OK } from '../constants/errors.js';
import { SOLT_ROUNDS } from '../constants/constants.js';

import BadRequestError from '../errors/bad_req.js';
import NotFoundError from '../errors/not_found.js';
import ConflictError from '../errors/conflict.js';
import NotAuthorizedError from '../errors/unauthorized.js';

const { NODE_ENV, JWT_SECRET } = process.env;

export const getMyProfile = (req, res, next) => {
  userSchema.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch(next);
};

export const createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, SOLT_ROUNDS)
    .then((hash) => userSchema.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    })
      .then((user) => {
        res.status(OK).send({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Ошибка при создании пользователя'));
        } else if (err.code === MONGO_DUPLICATE_ERROR) {
          next(new ConflictError('Такой пользователь уже существует'));
        } else next(err);
      }))
    .catch(next);
};

export const login = (req, res, next) => {
  const { email, password } = req.body;
  userSchema.findOne({ email }).select('+password')
    .orFail(() => {
      next(new NotAuthorizedError('Неверный email или пароль'));
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new NotAuthorizedError('Неверный email или пароль'));
          } else {
            const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret-key', { expiresIn: '7d' });
            res.send({ token });
          }
        })
        .catch((err) => next(err));
    })
    .catch(next);
};

export const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    )
    .orFail(() => { next(new NotFoundError('Пользователь не найден')); })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.code === MONGO_DUPLICATE_ERROR) {
        next(new ConflictError('Такой email уже существует'));
      } else next(err);
    });
};
