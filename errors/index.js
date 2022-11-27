const NotFoundError = require('./NotFoundError');
const AuthorizationError = require('./AuthorizationError');
const ForbiddenError = require('./ForbiddenError');
const ConflictError = require('./ConflictError');
const ValidationError = require('./ValidationError');

const handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = {
  NotFoundError, AuthorizationError, ForbiddenError, ConflictError, ValidationError, handleErrors,
};
