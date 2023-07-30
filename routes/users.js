const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REGEX } = require('../utils/regex');
const {
  getUsers, getCurrentUser, getUserById, updateUserInfo, changeAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL_REGEX),
  }),
}), changeAvatar);

module.exports = userRouter;
