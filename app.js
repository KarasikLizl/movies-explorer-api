/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { celebrate, Joi, errors } from 'celebrate';
import cors from 'cors';
import helmet from 'helmet';
import usersRoutes from './routes/users.js';
import moviesRoutes from './routes/movies.js';
import notFoundRouter from './routes/notFoud.js';
import { createUser, login } from './controllers/users.js';
import auth from './middlewares/auth.js';
import errorHandler from './middlewares/error-handler.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { emailRegExp } from './constants/constants.js';

const __dirname = path.resolve();
const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(express.json());
app.use(cors());
// Request logger
app.use(requestLogger);
//  Not protected
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().regex(emailRegExp),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().regex(emailRegExp),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);
//  Protected
app.use(usersRoutes);
app.use(moviesRoutes);
app.use(notFoundRouter);
// Error logger
app.use(errorLogger);
//  Errors
app.use(errors());
app.use(errorHandler);

async function connect() {
  await mongoose.connect(MONGO_URL, {});
  app.listen(PORT);
}

connect();
