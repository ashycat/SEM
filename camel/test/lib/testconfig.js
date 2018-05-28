'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../../lib/auth');
var pool = require('../../lib/generic-pool');
var db = require('../../lib/database');
var userLib = require('../lib/testuser');
var crypto = require('../../lib/crypto');
var cookieParser = require('cookie-parser');

module.exports = function testconfig(app) {
  var conn;
  app.on('middleware:after:session', function configPassport(eventargs) {
    passport.use(auth.localStrategy(conn));
    passport.use(auth.facebookStrategy(conn));
    passport.serializeUser(userLib.serialize);
    passport.deserializeUser(userLib.deserialize);
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
  });
  
  return {
    onconfig: function(config, next) {
      var dbConfig = config.get('testDatabaseConfig');
      var cryptConfig = config.get('bcrypt');
      pool.set(dbConfig);
      crypto.setCryptLevel(cryptConfig.difficulty);
      conn = db.config(dbConfig);
      userLib.setConnection(conn);
      next(null, config);
    }
  };
};