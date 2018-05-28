'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');
var check = require('check-types');

var NoticeDao = function() {
  return {   
    /**
     * 공지사항 목록 조회
     */ 
    list : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT n.id, n.subject, n.created, u.user_id, u.user_name, u.role " +
            "FROM notices n, users u " +
            "WHERE n.creator = u.id order by id desc limit ?, ?";

        db.query(queryString, [param.page*param.limit, param.limit], function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          db.query("SELECT count(*) size from notices", function(err, row, fields) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            success(rows, row[0]);
            pool.release(db);
            return;
          });
        });
      });
    }, 
    /**
     * 개별 공지사항 조회
     */  
    one : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT n.*, u.user_id, u.user_name, u.role " +
            "FROM notices n, users u " +
            "WHERE n.id = ? and n.creator = u.id";
        db.query(queryString, [param.id], function(err, row, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          var queryString2 = "SELECT upload_name, origin_name, round(size/1024) size " +
              "FROM files where notice_id = ?";
          db.query(queryString2, [param.id], function(err, rows, fields) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            success(row[0], rows);
            pool.release(db);
            return;
          });
        });
      });
    }, 
    /**
     * 공지사항 등록
     */ 
    create : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        db.beginTransaction(function(err) {
          if(err) {
            fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
            return;
          }
          var queryString = "INSERT INTO notices(subject, content, created, creator) " +
          "VALUES (?, ?, now(), ?)"; 
          db.query(queryString, 
              [param.subject, param.content, param.userId],
              function(err, result) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            if (!check.undefined(param.fileName)){
              var files = [];
              for (var i=0; i < param.fileName.length; i++) {
                files.push([result.insertId, param.uploadName[i], param.fileName[i], param.size[i]]);
              }
              console.log('files : ' , files);
              
              var queryString2 = "INSERT into files (notice_id, upload_name, origin_name, size) " +
              "VALUES ?";

              db.query(queryString2,
                  [files],
                  function(err, result){
                if (err) {
                  console.log('err',err);
                  db.rollback(function() {
                    pool.release(db);
                  });
                  fail(errorCode.DB_QUERY, "Query " + err);
                  return;
                }
                db.commit(function(err) {
                  if (err) {
                    db.rollback(function() {
                      pool.release(db);
                    });
                    fail(errorCode.DB_QUERY, "Query " + err);
                    return;
                  }
                  success();
                  pool.release(db);
                });
              });  
            } else {
              db.commit(function(err) {
                if (err) {
                  db.rollback(function() {
                    pool.release(db);
                  });
                  fail(errorCode.DB_QUERY, "Query " + err);
                  return;
                }
                success();
                pool.release(db);
              });
            }
          });
        })
      });
    },
    /**
     * 공지사항 수정
     */ 
    update : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE notices SET content=?, subject=? WHERE id = ?";
        db.query(queryString,
            [param.content, param.subject, param.id],
            function(err, result){
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          success();
          pool.release(db);
        });
      });
    },
    /**
     * 공지사항 삭제
     */ 
    delete : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "DELETE FROM notices WHERE id = ?";
        db.query(queryString, [param.id],  
            function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          success();
          pool.release(db);
        });
      });
    }
  }
}

module.exports = NoticeDao();

