const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const { auth } = require('./middlewares/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());

app.use(bodyParser.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(errors());

// eslint-disable-next-line no-use-before-define
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});
// eslint-disable-next-line no-use-before-define
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ужасная ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
