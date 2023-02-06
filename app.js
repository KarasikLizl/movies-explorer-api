import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { celebrate, Joi, errors } from 'celebrate';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import usersRoutes from './routes/users.js';
import moviesRoutes from './routes/movies.js';
import notFoundRouter from './routes/notFoud.js';
import { createUser, login } from './controllers/users.js';
import auth from './middlewares/auth.js';
import errorHandler from './middlewares/error-handler.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { emailRegExp } from './constants/constants.js';

dotenv.config();

const __dirname = path.resolve();
const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(express.json());
app.use(cors());
// Request logger
app.use(requestLogger);
// Request limiter
app.use(limiter);
//  Not protected
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().regex(emailRegExp),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().regex(emailRegExp),
      password: Joi.string().required(),
    }),
  }),
  login,
);

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
