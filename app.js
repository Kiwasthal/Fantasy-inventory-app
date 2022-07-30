const createError = require('http-errors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const archieveRouter = require('./routes/archieve');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoDB = `mongodb+srv://steerpike:${process.env.MONGODB_DEVPASS}@cluster0.zv2uh.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to database');
  }
);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/archieve', archieveRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
