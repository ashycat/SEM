/**
 * New node file
 */
'use strict';
var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');
var async = require('async');

var RoleGroupDao = function() {
  return {
    /*
     * 롤 그룹 목록 조회
     */
    list : function(param, success, fail) {
      pool.acquire(function(err, db){
        if (err){
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        
        var queryString = "SELECT * from role_group";
        db.query(queryString, function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          console.log('rows', rows[0]);
          success (rows, {size:rows.length});
          pool.release(db);
          
        });
      });
    },
    /*
     * 롤 그룹 목록 검색
     */
    findByName : function(db, param, resolve, callback) {
      console.log("param", param);
      var queryString = "SELECT * from role_group";
      var where = [];
      var argument = [];
      if (param.name) {
        where.push(" name like ? ");
        argument.push('%' + param.name + '%');
      }
      if (where.length > 0) {
        queryString = queryString + " where " + where.join(" and ");
      }
      
      db.query(queryString, argument, function(err, result) {
        console.log('query result', result);
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /*
     * 롤 그룹 생성 
     */
    create : function(param, success, fail) {
      pool.acquire(function(err, db){
        if (err){
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        var queryString = "INSERT INTO role_group (name) VALUES (?);";
        db.query(queryString,[param.roleGroupName], function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          success ();
          pool.release(db);
        });
      });
    },
    /*
     * 롤 그룹 사용자 조회
     */
    listForRoleGroupUser : function(param, success, fail) {
      pool.acquire(function(err, db){
        if (err){
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        var queryString = "select * from users where id in (select a.user_id from role_group_member a where a.role_group_id = ?) ";
        db.query(queryString,[param.id], function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          success (rows, {size:rows.length});
          pool.release(db);
        });
      });
    },
    /*
     * 롤 그룹 사용자 삭제 
     */
    deleteForRoleGroupUser : function(param, success, fail) {
      console.log('param', param.id, param.userid);
      pool.acquire(function(err, db) {
        if (err){
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        var queryString = "delete from role_group_member where role_group_id = ? and user_id = ?;";
        db.query(queryString, [param.id, param.userid], function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          success ();
          pool.release(db);
        });
      });
    },
    /*
     * 롤 그룹 사용자 수정
     */
    updateForRoleGroupUsers : function(param, success, fail) {
      async.waterfall([
        function(callback) {
          pool.acquire(function(err, db){
            if (err){
              return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
            }
            var queryString = "DELETE FROM role_group_member WHERE role_group_id = ?";
            
            db.query(queryString, [param.roleGroupId], function(err, rows, fields) {
              if (err) {
                fail(errorCode.DB_QUERY, "Query " + err);
                return;
              }
             
              var result = rows;
              pool.release(db);
              console.log('result1', param);
              callback(null, param);
            });
          });
        }
      ],
       //
       // 자 모두 끝나면 이곳으로 !!
       //
      function(err, param) {
        console.log('final', err,' : ', param);
        pool.acquire(function(err, db){
          if (err){
            return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          }
          var queryString = "insert into role_group_member (role_group_id , user_id) " + 
          "(select a.id, b.id from role_group a, users b where a.id = ? and b.id = ?);";
          var count = 0;
         
          async.whilst(
            function () { 
              return count < param.userId.length; 
            },
            function (callback) {
              db.query(queryString,[param.roleGroupId, param.userId[count]], function(err, rows, fields) {
                if (err) {
                  return fail(errorCode.DB_QUERY, "Query " + err);
                }
                  
                var result = rows;
                console.log('rows', result);
                pool.release(db);
                //console.log('result', rolegroup);
                callback(null, result);
              });
              count++;
            },
            function (err) {
              if (err){
                return fail(errorCode.DB_UNKNOWN, "FOR LOOP ERROR : " + err);
              }
              success ();
              console.log('end');
            }
          );
        });
      });
    },
    /*
     * 롤 그룹 롤 정보 수정
     */
    updateForRoleGroup :  function(param, success, fail) {
      async.waterfall([
        function(callback) {
          pool.acquire(function(err, db){
          if (err){
            return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          }
          var queryString = "DELETE FROM group_role WHERE group_id=?;";
          db.query(queryString, [param.roleGroupId], function(err, rows, fields) {
            if (err) {
              return fail(errorCode.DB_QUERY, "Query " + err);
            }
           
            var result = rows;
            pool.release(db);
            //console.log('result', rolegroup);
            callback(null, param);
          });
        });
        }
      ],
       //
       // 자 모두 끝나면 이곳으로 !!
       //
      function(err, results) {
        console.log('final', err,' : ', results)
        pool.acquire(function(err, db){
          if (err){
            return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          }
          var queryString = "insert into group_role (group_id, role_id) " +
              "select a.id, b.id from `role_group` a, `roles` b where a.id = ? and b.name = ?; ";
            var count = 0;
            async.whilst(
              function () { return count < param.groupRole.length; },
              function (callback) {
                console.log('count is : ',count);                           
                db.query(queryString,[param.roleGroupId, param.groupRole[count]], function(err, rows, fields) {
                  if (err) {
                    return fail(errorCode.DB_QUERY, "Query " + err);
                  }
                    
                  var result = rows;
                  pool.release(db);
                  callback(null, result);
                });
                count++;
              },
              function (err) {
                if (err){
                  return fail(errorCode.DB_UNKNOWN, "FOR LOOP ERROR : " + err);
                }
                success();
                console.log('end');
              }
            );
          });
      });
    },
  }
}
module.exports = RoleGroupDao();