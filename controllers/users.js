const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const NotAuthorizedRequestError = require('../errors/not-authorized-request-error');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res.cookie('jwt', token, { httpOnly: true });
      return res.status(OK_STATUS_CODE).send({ message: 'Авторизация прошла успешно! Доступ разрешён!' });
    })
    .catch((err) => {
      next(new NotAuthorizedRequestError('Отказ в доступе'));
      next(err);
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(OK_STATUS_CODE).send({ data: user }))
    .catch(() => res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'На сервере произошла ошибка',
        });
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED_STATUS_CODE).send({ _id: user._id, email: user.email }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).send({ message: `Пользователь с таким ${email} уже зарегистрирован` });
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'На сервере произошла ошибка',
        });
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка',
      });
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка',
      });
      next(err);
    });
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка',
      });
      next(err);
    });
};
