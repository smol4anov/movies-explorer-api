const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { createAccountLimiter } = require('../middlewares/limiter');
const { NotFoundError } = require('../errors');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post(
  '/signup',
  createAccountLimiter,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

router.use(auth);

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').end();
});

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
