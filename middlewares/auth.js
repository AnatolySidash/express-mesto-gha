const { checkToken } = require('../utils/token');
const NotAuthorizedRequestError = require('../errors/not-authorized-request-error');

const auth = (req, res, next) => {
  if (!req.cookies) {
    next(new NotAuthorizedRequestError('Нет доступа. Нужно авторизоваться!'));
    return;
  }

  const token = req.cookies.jwt;

  const payload = checkToken(token);

  if (!payload) {
    next(new NotAuthorizedRequestError('Нет доступа. Нужно авторизоваться!'));
    return;
  }

  req.user = payload;

  next();
};

module.exports = { auth };
