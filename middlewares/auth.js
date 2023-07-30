const { checkToken } = require('../utils/token');
const { NOT_AUTHORIZED_REQUEST_STATUS_CODE } = require('../utils/errors');

const auth = (req, res, next) => {
  if (!req.cookies) {
    res.status(NOT_AUTHORIZED_REQUEST_STATUS_CODE).json({ message: 'Нет доступа. Нужно авторизоваться!' });
    return;
  }

  const token = req.cookies.jwt;

  const payload = checkToken(token);

  if (!payload) {
    res.status(NOT_AUTHORIZED_REQUEST_STATUS_CODE).json({ message: 'Нет доступа' });
    return;
  }

  req.user = payload;

  next();
};

module.exports = { auth };
