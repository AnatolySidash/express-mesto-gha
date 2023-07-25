const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64b2cf128bade16c153b05ec',
  };
  next();
});

app.use(bodyParser.json());
app.use(cookieParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', userRouter);
app.use('/', cardRouter);
app.post('/users/signin', login);
app.post('/users/signup', createUser);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
