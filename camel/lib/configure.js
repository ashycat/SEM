'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../lib/auth');
var pool = require('../lib/generic-pool');
var db = require('../lib/database');
var userLib = require('./user');
var crypto = require('../lib/crypto');
var cookieParser = require('cookie-parser');
//var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');


module.exports = function configure(app) {
  var conn;
  app.on('middleware:after:session', function configPassport(eventargs) {
    passport.use(auth.localStrategy(conn));
    passport.use(auth.facebookStrategy(conn));
    passport.serializeUser(userLib.serialize);
    passport.deserializeUser(userLib.deserialize);
//    app.use(multipart());
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
//    app.user(bodyParser());
    app.use(bodyParser.json({limit: '500mb'}));
    app.use(bodyParser.urlencoded({extended: true, limit: '500mb'}));
  });
  
  return {
    onconfig: function(config, next) {
      var dbConfig = config.get('databaseConfig');
      var cryptConfig = config.get('bcrypt');
      pool.set(dbConfig);
      crypto.setCryptLevel(cryptConfig.difficulty);
      conn = db.config(dbConfig);
      userLib.setConnection(conn);
      next(null, config);
    }
  };
};