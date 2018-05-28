'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var BrokerDao = function() {
  return {
    /**
     * 주선소 목록
     */ 
    list : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM brokers where status='ACTIVE' limit ?, ?";
        db.query(queryString, 
            [param.page*param.limit, param.limit], 
            function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          queryString = "SELECT count(*) size FROM brokers WHERE status='ACTIVE'";
          db.query(queryString, function(err, row, fields) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            success(rows, row[0]);
            pool.release(db);
          });
        });
      });
    }, 
    /**
     * 개별 주선소 정보 조회 
     */
    one : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM brokers WHERE id = ?";
        db.query(queryString, 
            [param.id], 
            function(err, row, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          success(row[0]);
          pool.release(db);
        });
      });
    },
    /**
     * 주선소 (broker) 등록 
     */ 
    create : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "INSERT INTO brokers (name, telephone, handphone, creator, created, modifier, modified) " +
        " VALUES (?, ?, ?, ?, sysdate(), ?, sysdate())"; 
        var argus = [param.name, param.telephone, param.handphone, param.creator, param.creator];
        console.log('dao list : ', queryString, argus);
        db.query(queryString, argus, 
          function(err, result) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            success(result);
            pool.release(db);
        });
      });
    },
    /**
     * 주선소 수정 
     */
    update : function(param, success, fail) {
      pool.acquire(function(err, db) {
        pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE brokers SET name=?, telephone=?, handphone=?, modifier=? " +
        "WHERE id=?";
        db.query(queryString,
            [param.name, param.telephone, param.handphone, param.userId, param.id],  
          function(err, result){
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            success();
            pool.release(db);
          });
        });
      });
    },
    /**
     * 주선소 삭제 (delete 상태로 변경)
     */
    delete : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE brokers SET status='DELETE' WHERE id = ?";
        var argus = [param.id];
        console.log('dao delete : ', queryString, argus);
        db.query(queryString, argus, 
            function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          success(rows);
          pool.release(db);
        });
      });
    },
    
    /**
     * 주선소 멤버 목록 조회
     */
    showMembers : function(param, success, fail) {
      pool.acquire(function(err, db){
        if(err){
          fail(errorCode.DB_CONNECTION, "CONNECITON error:" + err);
          return;
        }
        var queryString = "select a.broker_id, a.user_id, a.role, b.user_id as user_id2, b.user_name from brokers_members a, users b where broker_id = ? and a.user_id = b.id limit ?, ?";
        db.query(queryString, [param.broker_id, param.page*param.limit, param.limit], function(err, rows, fields) {
          if(err){
            fail(errorCode.DB_QUERY, "QUERY ERROR:" + err);
            return;
          }
          queryString = "SELECT count(*) size from brokers_members a, users b where broker_id = ? and a.user_id = b.id";
          db.query(queryString, [param.broker_id], function(err, row, fields) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            success(rows, row[0]);
            pool.release(db);
          });
        });
      });
    },
    /**
     * 주선소 멤버 등록
     */
    addMember : function(param, success, fail) {
      pool.acquire(function(err, db){
        if(err){
          fail(errorCode.DB_CONNECTION, "CONNECITON error:" + err);
          return;
        }
        var queryString = "insert into brokers_members(broker_id, user_id, role, creator, created) VALUES ?";
        var values = [];
        var today = new Date();
        values.push([param.broker_id, param.user_id, param.broker_role, param.creator, today]);
          
        db.query(queryString, [values], function(err, result) {
          if(err){
            fail(errorCode.DB_QUERY, "QUERY ERROR:" + err);
            return;
          }
          success();
          pool.release(db);
        });
      });
    },
   
    /**
     * 주선소 멤버 삭제
     */
    deleteMember : function(param, success, fail){
      pool.acquire(function(err, db){
        if(err){
          fail(errorCode.DB_CONNECTION, "CONNECITON error:" + err);
          return;
        }
        var queryString = "delete from brokers_members where broker_id = ? and user_id = ?";
        db.query(queryString, [param.broker_id, param.user_id], function(err, rows, fields){
          if(err){
            fail(errorCode.DB_QUERY, "QUERY ERROR:" + err);
            return ;
          }
          success();
          pool.release(db);
        })
      });
    },
    /**
     * 주선소 멤버 수정
     */
    updateMember : function(param, success, fail){
      pool.acquire(function(err, db){
        if(err){
          fail(errorCode.DB_CONNECTION, "CONNECITON error:" + err);
          return;
        }
        var queryString = "update brokers_members set role = ?, creator = ? where broker_id = ? and user_id = ?";
        db.query(queryString, 
            [param.broker_role, param.creator, param.broker_id, param.user_id], function(err, rows, fields){
          if(err){
            fail(errorCode.DB_QUERY, "QUERY ERROR:" + err);
            return ;
          }
          success();
          pool.release(db);
        })
      });
    },
    
    /**
     * 주선소 등록 가능한 멤버 조회
     */
    findMembers : function(param, success, fail) {
      pool.acquire(function(err, db){
        if(err){
          fail(errorCode.DB_CONNECTION, "CONNECTION error:" + err);
          return ;
        }
        var queryString = "select * from users where id not in (" +
          "  select distinct user_id from brokers_members" +
          ")";
        var where = [];
        var argument = [];
        if (param.user_name) {
          where.push(" user_name like ? ");
          argument.push('%' + param.user_name + '%');
        }
        if (param.user_id) {
          where.push(" user_id like ? ");
          argument.push('%' + param.userId + '%');
        }
        if (where.length > 0) {
          queryString = queryString + " and (" + where.join(" or ") + ")";
        }
        queryString = queryString + " limit ?, ?";
        argument.push(param.page*param.limit);
        argument.push(param.limit);
        db.query(queryString, argument, function(err, rows, field){
          if(err){
            fail(errorCode.DB_QUERY, "QUERY ERROR:" + err);
            return ;
          }
          // 전체 카운터 조회하기
          queryString = "select count(*) size from users where id not in (" +
          "  select distinct user_id from brokers_members" +
          ")";
          where = [];
          argument = [];
          if (param.user_name) {
            where.push(" user_name like ? ");
            argument.push('%' + param.user_name + '%');
          }
          if (param.user_id) {
            where.push(" user_id like ? ");
            argument.push('%' + param.userId + '%');
          }
          if (where.length > 0) {
            queryString = queryString + " and (" + where.join(" or ") + ")";
          }
          db.query(queryString, argument, function(err, row, field){
            if(err){
              fail(errorCode.DB_QUERY, "QUERY ERROR:" + err);
              return;
            }
            success(rows, row[0]);
            pool.release(db);
          });
        });
      });
    },
    /**
     * 주선소 맴버인지 조회 
     */
    getBrokerMember : function(param, success, fail) {
      pool.acquire(function(err, db){
        if(err){
          fail(errorCode.DB_CONNECTION, "CONNECITON error:" + err);
          return;
        }
        var query = "SELECT * FROM brokers_members bm WHERE bm.user_id = ?";
        var argus = [param.userId];
        console.log('get broker member ', query, argus);
        db.query(query, argus, function(err, rows, fields) {
          if(err){
            fail(errorCode.DB_QUERY, "QUERY ERROR:" + err);
            return;
          }
          success(rows[0]);
          pool.release(db);
        });
      });
    },
    
  }
};
  
module.exports = BrokerDao();
