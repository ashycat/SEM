/**
 * New node file
 */
'use strict';
var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var RoleDao = function() {
  return {
    /**
     * 롤 목록 조회
     */ 
    list : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * from roles";
        console.log('query', queryString);
        db.query(queryString, function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          
          success(rows, {size:rows.length});
          pool.release(db);
          return;
          
        });
      });
    },
  }
}
    
module.exports = RoleDao();