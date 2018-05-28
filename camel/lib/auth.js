/**
 * Module that will handle our authentication tasks
 */
'use strict';

var User = require('../models/user');
// var bcrypt = require('bcrypt');
var crypto = require('../lib/crypto');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var faceconfig = require('../config/config');

exports.config = function(settings) {

};

/**
 * A helper method to retrieve a user from a local DB and ensure that the
 * provided password matches.
 * 
 * @param req
 * @param res
 */
exports.localStrategy = function(connection) {

  return new LocalStrategy(function(userId, password, done) {
    console.log('LocalStrategy ', userId, password);
    // Retrieve the user from the database by login
    User.findByUserId(connection, userId, function(err, user) {
      console.log("findByUserId", userId, user);
      // If something weird happens, abort.
      if (err) {
        return done(err);
      }

      // If we couldn't find a matching user, flash a message explaining
      // what happened
      if (!user) {
        return done(null, false, {
          message : 'Login not found'
        });
      }

      // var hashedPwd = bcrypt.hashSync(password,
      // crypto.getCryptLevel());
      // console.log("hashedPwd", hashedPwd);
      // Make sure that the provided password matches what's in the DB.
      if (user.password !== password) {
        return done(null, false, {
          message : 'Incorrect Password'
        });
      }
      console.log("#####User", user);
      // If everything passes, return the retrieved user object.
      done(null, user);

    });
  });
};

exports.facebookStrategy = function(connection, config) {

  return new FacebookStrategy({
    clientID : faceconfig.oauth.facebook.FACEBOOK_APP_ID,
    clientSecret : faceconfig.oauth.facebook.FACEBOOK_APP_SECRET,
    callbackURL : faceconfig.oauth.facebook.callbackURL

  }, function(accessToken, refreshToken, profile, done) {
    //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // req.session.passport 정보를 저장하는 단계이다.
    // done 메소드에 전달된 정보가 세션에 저장된다.
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //
    console.log("facebook");
    return done(null, profile);
  });
};

/**
 * A helper method to determine if a user has been authenticated, and if they
 * have the right role. If the user is not known, redirect to the login page. If
 * the role doesn't match, show a 403 page.
 * 
 * @param role
 *          The role that a user should have to pass authentication.
 */
exports.isAuthenticated = function() {

  return function(req, res, next) {
    // access map
    var auth = {
      '/api/notices' : true
    }, blacklist = {
      'user' : {
        '/api/notices' : true
      },
      'designer' : {
        '/admin' : true,
        '/manager' : true
      },
      'manager' : {
        '/admin' : true
      },
    }, route = req.url, role = (req.user && req.user.role) ? req.user.role : '';

    console.log('isAuthenticated route', req.url, role);
    if (!auth[route]) {
      next();
      return;

    } else if (!req.isAuthenticated()) {

      // If the user is not authorized, save the location that was being
      // accessed so we can redirect afterwards.
      req.session.goingTo = req.url;
      req.flash('error', 'Please log in to view this page');
      // res.redirect('/login');
      // Check blacklist for this user's role
    } else if (blacklist[role] && blacklist[role][route] === true) {

      var model = {
        url : route
      };

      // pop the user into the response
      res.locals.user = req.user;
      res.status(401);

      res.render('errors/401', model);
    } else {
      console.log("\nok\n")
      next();
    }

  };
};

/**
 * A helper method to add the user to the response context so we don't have to
 * manually do it.
 * 
 * @param req
 * @param res
 * @param next
 */
exports.injectUser = function() {
  return function injectUser(req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
      // res.cookie('userInfo', req.user.user_name+"/"+req.user.role);
      // res.cookie('user', req.user.user_name+"/"+req.user.role, {
      // maxAge: 900000 });
    }
    next();
  };
};
