/**
 * userauth
 */
'use strict';

var pool = require('../lib/generic-pool').get();
var userDao = require('./user');
var errorCode = require('../lib/errorCode');
var check = require('check-types');

var userAuth = function() {
  var checkRole = function(allowRoles, userRoles) {
    if (check.undefined(allowRoles)) {
      return true;
    }
    for (var i=0; i < allowRoles.length; i++) {
      for (var j=0; j < userRoles.length; j++) {
        if (allowRoles[i] == userRoles[j].name) {
          return true;
        }
      }
    }
    return false;
  };

  var checkKey = function(permission, success, fail) {
    console.log('checkKey', permission);
    pool.acquire(function(err, db) {
      if (err) {
        fail(err, 'connection error');
        return ;
      }

      db.query("SELECT * FROM users_apikey WHERE api_key=? and secret_key=?", 
          [permission.apiKey, permission.secretKey], function(err, rows, fields){
        if (err) {
          fail(err, 'Query ');
          return ;
        }
        console.log('compare : ', rows[0].user_id, permission.userId);
        if (rows[0].user_id != permission.userId) {
          console.log("invalid user");
          fail(errorCode.AUTHENTICATION_ERROR, 'invalid user');
          return ;
        }
        db.query("SELECT * FROM users WHERE id=? ", 
            [ rows[0].user_id ], function(err,rows, fields) {
          if (err) {
            console.log("Query : " + err);
            fail(err, 'Query ');
            return ;
          }
          success();
          pool.release(db);
        });
      });
    });
  } 
  
  return {
    isAuthenticate : function(permission, success, fail) {
      console.log('isAuthenticate istest : ', permission.isTest);
      if (permission.isTest) {
        success();
        return;
      }
      var param = {id : permission.userId};
      userDao.roles(param, function(data){
        if (!checkRole(permission.allow, data)) {
          console.log('권한이 없습니다. ', permission, data);
          fail(errorCode.ACCESS_DENIED, '권한 없슴');
        } else {
          console.log('success check role');
          checkKey(permission, success, fail);
        }
      }, function(code, message) {
        fail(code, message);
      });
      
    }
  }
}

module.exports = userAuth();