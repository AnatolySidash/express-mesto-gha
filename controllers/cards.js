const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');

const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res
      .status(OK_STATUS_CODE).send(card))
    .catch(() => res
      .status(SERVER_ERROR_STATUS_CODE)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user.payload._id })
    .then((card) => res
      .status(CREATED_STATUS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для создания карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному id не найдена.');
      }
      if (String(card.owner) === String(req.user.payload._id)) {
        Card.deleteOne(card).then(() => res.status(OK_STATUS_CODE).send(card));
        return;
      }
      if (String(card.owner) !== String(req.user.payload._id)) {
        throw new ForbiddenError('Доступ запрещён');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.payload._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному id не найдена.');
      }
      res.status(OK_STATUS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.payload._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному id не найдена.');
      }
      res.status(OK_STATUS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные карточки'));
      } else {
        next(err);
      }
    });
};
