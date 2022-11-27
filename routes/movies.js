const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { creatMovie, getMovies, deleteMovieById } = require('../controllers/movies');
const { rexExpUrl } = require('../utils/constants');

moviesRouter.get('/', getMovies);

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(rexExpUrl),
    trailerLink: Joi.string().required().pattern(rexExpUrl),
    thumbnail: Joi.string().required().pattern(rexExpUrl),
    movieId: Joi.string().hex().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), creatMovie);

moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovieById);

module.exports = moviesRouter;
