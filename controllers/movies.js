const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { NotFoundError, ForbiddenError, ValidationError } = require('../errors');

const creatMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId).orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }
      return Movie.findByIdAndRemove(movie._id);
    })
    .then(() => res.status(200).send({ status: 'deleted' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат id'));
        return;
      }
      next(err);
    });
};

module.exports = { creatMovie, getMovies, deleteMovieById };
