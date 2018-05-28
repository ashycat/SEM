/**
 * New node file
 */
'use strict';
var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var GroupRoleDao = function() {
  return {
    list : function(param, success, fail) {
      pool.acquire(function(err, db){
        if (err){
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        var queryString = "select name from group_role a, roles b where a.group_id = ? and a.role_id = b.id; ";
        db.query(queryString, [param.groupId],function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          console.log('rows', rows[0]);
          success (rows, rows[0]);
          pool.release(db);
          
        });
      });
    },
  }
}
module.exports = GroupRoleDao();