/**
 * A custom library to establish a database connection
 */
'use strict';

var mysql = require('mysql');

var db = function() {
  return {
    config : function(conf) {
      var connection = mysql.createConnection({
        host : conf.host,
        user : conf.user,
        password : conf.password,
        database : conf.database
      });
      connection.connect();
      return connection;
    }
  };
}

module.exports = db();
