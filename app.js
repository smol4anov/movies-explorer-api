const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
require('dotenv').config();

const routers = require('./routes');
const { handleErrors } = require('./errors');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');

const { PORT = 3000, BASE_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

mongoose.connect(BASE_URL);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);

app.use(cors);
app.use(limiter);
app.use(routers);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
