'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var OrderDao = function() {
  return {
    /**
     * 오퍼 목록 조회
     */ 
    list : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM offers " +
            "WHERE status='ACTIVE' order by id desc limit ?, ?";
        db.query(queryString, [param.page*param.limit, param.limit], function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          db.query("SELECT count(*) size from offers", function(err, row, fields) {
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
     * 오퍼 검색
     */
    find : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        
        var queryString = "SELECT * FROM offers ";
        var where = [];
        var argument = [];
        if (param.type) {
          where.push(" type = ? ");
          argument.push(param.type);
        }
        if (where.length > 0) {
          queryString = queryString + " where " + where.join(" and ");
        }
        console.log('order search : ', queryString, argument);
        db.query(queryString, 
            argument, 
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
     * 개별 오퍼 조회
     */  
    one : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM offers WHERE id = ? ";
        db.query(queryString, [param.id], function(err, row, fields) {
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
     * 오퍼 등록
     */ 
    create : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "INSERT INTO offers (type, truck_id, status, " +
        		"creator, created, modifier) " +
        		"VALUES (?, ?, 'ACTIVE', ?, now(), ?)"; 
        db.query(queryString, 
            [param.type, param.truckId, 'ACTIVE', param.userId, param.userId],
            function(err, result) {
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
     * 오퍼 수정
     */ 
    update : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE offers SET type=?, truck_id=?, modifier=? " +
        		"WHERE id = ?";
        db.query(queryString,
            [param.type, param.truckId, param.userId, param.id],
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
     * 오퍼 삭제
     * TODO : 오퍼를 삭제하는 것은 status를 DELETE로 바꾸는 것으로 한다. 
     * 단, 연결되어 있는 배차정보는 어떻게 끊어야 하나 ? 
     * 지워버리나 ? 같이 status 처리하나 ? (status 처리해도 큰 의미가 없어 보인다. )
     */ 
    delete : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE offers set status='DELETE' WHERE id = ?";
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
    },
    createOffer : function(db, param, resolve, callback) {
      console.log('createOffer : ', param, resolve, callback);
      var query = "INSERT INTO offers (type, truck_id, status, " +
      		"creator, created, modifier) " +
      		"VALUES (?, ?, 'ACTIVE', ?, now(), ?)";
      var argus = [param.type, param.truckId, 'ACTIVE', param.userId, param.userId];
      console.log('create offer : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        param.offer_id = result.insertId;
        callback(null, {offer_id:result.insertId});
      });
    }
  }
}
  
module.exports = OrderDao();