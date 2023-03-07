import rateLimit from 'express-rate-limit';
// solt
export const SOLT_ROUNDS = 10;
// regex
export const urlRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
export const emailRegExp = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
