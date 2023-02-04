import mongoose from 'mongoose';
import { urlRegExp } from '../constants/constants.js';

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле должно быть валидным url-адресом.',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле должно быть валидным url-адресом.',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле должно быть валидным url-адресом.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

export default mongoose.model('movie', movieSchema);
