const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError, ConflictError, ValidationError } = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже зарегистрирован'));
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user).orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(200).send({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат id'));
        return;
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат id'));
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .status(201).end();
    })
    .catch(next);
};

module.exports = {
  createUser, getUser, updateUser, login,
};
