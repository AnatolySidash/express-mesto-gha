const { checkToken } = require('../utils/token');
const { NOT_AUTHORIZED_REQUEST_STATUS_CODE } = require('../utils/errors');

const auth = (req, res, next) => {
  if (!req.cookies) {
    res.status(NOT_AUTHORIZED_REQUEST_STATUS_CODE).json({ error: 'Нет доступа' });
    return;
  }

  const token = req.cookies.jwt;

  const result = checkToken(token);

  if (!result) {
    res.status(NOT_AUTHORIZED_REQUEST_STATUS_CODE).json({ error: 'Нет доступа' });
    return;
  }

  next();
};

module.exports = { auth };
