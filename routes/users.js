const usersRouter = require('express').Router();
const { updateUser, getUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validation');

usersRouter.get('/me', getUser);

usersRouter.patch('/me', updateUserValidation, updateUser);

module.exports = usersRouter;
