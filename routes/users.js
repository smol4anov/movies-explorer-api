const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { updateUser, getUser } = require('../controllers/users');

usersRouter.get('/me', getUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = usersRouter;
