/**
 * A model for our user
 */
'use strict';
//var bcrypt = require('bcrypt');
var crypto = require('../lib/crypto');

var UserModel = function() {
  return {
    findByUserId : function(connection, userId, callback) {
      console.log("userModel.findByUserId ", userId);
      connection.query("SELECT u.*, ua.api_key, ua.secret_key " +
      		"FROM users u, users_apikey ua " +
      		"WHERE u.user_id=? and u.id = ua.user_id", 
          [userId], function(err, rows, fields) {
        console.log("userModel.findByUserId.result : ", rows, err);
        if (err) {
          throw err;
        }
        for ( var i in rows) {
          callback(null, rows[i]);
        }
        console.log("userModel.findByUserId end");
      });
    },
    findById : function(connection, id, callback) {
      console.log("userModel.findById ", id);
      connection.query("SELECT u.*, ua.api_key, ua.secret_key " +
      		"FROM users u, users_apikey ua " +
      		"WHERE u.id=? and u.id = ua.user_id", 
          id, function(err, rows, fields) {
        if (err) {
          throw err;
        }
        for ( var i in rows) {
          callback(null, rows[i]);
        }
      });
    },
    usersList : function(connection, callback) {
      console.log("userModel.usersList ", id);
      connection.query("SELECT u.*, ua.api_key, ua.secret_key " +
      		"FROM users u, users_apikey ua " +
      		"WHERE u.id = ua.user_id",  function(err, rows, fields) {
        if (err) {
          throw err;
        }
        console.log("\n\n\nusersList dkdkdk\n\n\n");
        for ( var i in rows) {
          callback(null, rows[i]);
        }
      });
    }
  }
};

module.exports = new UserModel();
