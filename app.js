const createError = require('http-errors');
const express = require("express");
const app = express();
const bodyParser =require("body-parser");
const expressLayouts = require('express-ejs-layouts');
const cors= require("cors");
const path = require("path");

const APPSETTING   = require('./configs/app_setting');
const INDEXROUTE   = require('./routes/index.routes');
const session = require('express-session');
const morgan = require('morgan');
app.use(morgan("tiny"));

// Connect Database
APPSETTING.connectDatabase();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,}));
  
//using the JSON data iun our whole application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json({ limit: 100000000000000 }));
app.use(express.urlencoded({ extended: false }));

//static file
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static(path.join(__dirname, 'public')));
//Routes
app.use('/',INDEXROUTE);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log(":: PORT :: ",process.env.PORT);

module.exports = app;
