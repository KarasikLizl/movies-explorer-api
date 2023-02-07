import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getMyProfile,
  updateProfile,
} from '../controllers/users.js';
import { emailRegExp } from '../constants/constants.js';

const usersRoutes = express.Router();

usersRoutes.get('/users/me', express.json(), getMyProfile);

usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().regex(emailRegExp),
  }),
}), updateProfile);

export default usersRoutes;
