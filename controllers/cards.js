const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(card => res.status(200).send({ data: card }))
    .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => res.status(200).send({ data: card }))
    .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then(card => res.status(201).send({ data: card }))
    .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then(card => res.status(200).send({ data: card }))
    .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then(card => res.status(200).send({ data: card }))
    .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};
