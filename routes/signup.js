const signupRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');
const { URL_REGEX } = require('../utils/regex');

signupRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = signupRouter;
