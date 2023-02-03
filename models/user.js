import mongoose from 'mongoose';
import { emailRegExp } from '../constants/constants.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => emailRegExp.test(v),
      message: 'Поле должно быть валидным почтовым адресом.',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

export default mongoose.model('user', userSchema);
