'use strict';

var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    request = require('request'),
    bodyParser = require('body-parser');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/test', function (req, res, next) {
  if (req.headers.cookie) {
    request({
      method: 'GET',
      url: process.env.NW_AUTH_URL,
      headers: {
        cookie: req.headers.cookie
      }
    }, function (err, response) {
      if (err) return next(err);

      if (response.statusCode !== 200) {
        return res.status(401).send('NOT AUTHENTICATED');
      }

      return res.send('YOU\'RE AUTHENTICATED!!!');
    });
  } else {
    return res.status(401).send('NO COOKIES');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res /*, next*/) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res /*, next*/) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
