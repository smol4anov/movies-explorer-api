const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = { auth };
