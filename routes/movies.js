const moviesRouter = require('express').Router();
const { creatMovie, getMovies, deleteMovieById } = require('../controllers/movies');
const { creatMovieValidation, deleteMovieValidation } = require('../middlewares/validation');

moviesRouter.get('/', getMovies);

moviesRouter.post('/', creatMovieValidation, creatMovie);

moviesRouter.delete('/:movieId', deleteMovieValidation, deleteMovieById);

module.exports = moviesRouter;
