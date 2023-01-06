const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError, ConflictError, ValidationError } = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const addTokenAndSend = (res, user, status = 200) => {
  const newUser = user.toObject();
  delete newUser.password;

  const token = jwt.sign(
    { _id: newUser._id },
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    { expiresIn: '7d' },
  );
  res.cookie('jwt', token, {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
  })
    .status(status).send(newUser);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => {
      addTokenAndSend(res, user, 201);
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
  User.findById(req.user._id).orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Данный email уже используется'));
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
      addTokenAndSend(res, user);
    })
    .catch(next);
};

module.exports = {
  createUser, getUser, updateUser, login,
};
