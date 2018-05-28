'use strict';

var User = require('../models/user');

var UserLibrary = function() {
  var conn;
  return {
    setConnection : function(connection) {
      conn = connection;
    },
    serialize : function(user, done) {
      console.log("lib/user.serialize", user);
      done(null, user);
    },
    deserialize : function(user, done) {
      console.log("lib/user.deserialize", user);
      done(null, user);
    }
  };
};

module.exports = UserLibrary();
