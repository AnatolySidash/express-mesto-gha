const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_AUTHORIZED_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');

const User = require('../models/user');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res.cookie('jwt', token, { httpOnly: true });
      return res.status(OK_STATUS_CODE).send({ message: 'Авторизация прошла успешно! Доступ разрешён!' });
    })
    .catch(() => {
      res.status(NOT_AUTHORIZED_REQUEST_STATUS_CODE).send({ message: 'Отказ в доступе' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(OK_STATUS_CODE).send({ data: user }))
    .catch(() => res.status(SERVER_ERROR_STATUS_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_STATUS_CODE).send({
          message: 'Пользователь по указанному id не найден.',
        });
      }
      return res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch(() => {
      res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_STATUS_CODE).send({
          message: 'Пользователь по указанному id не найден.',
        });
      }
      return res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({
          message: 'Переданы некорректные данные пользователя',
        });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED_STATUS_CODE).send({ _id: user._id, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({
            message: 'Пользователь по указанному id не найден.',
          });
      }
      return res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({
            message: 'Пользователь по указанному id не найден.',
          });
      }
      return res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};
