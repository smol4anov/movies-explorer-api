const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { createAccountLimiter } = require('../middlewares/limiter');
const { NotFoundError } = require('../errors');
const { createUserValidation, loginUserValidation } = require('../middlewares/validation');

router.post('/signin', loginUserValidation, login);

router.post('/signup', createAccountLimiter, createUserValidation, createUser);

router.use(auth);

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({});
});

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурc не найден');
});

module.exports = router;
