'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');
var logger = require('../lib/logger');

var TruckDao = function() {
  return {
    /**
     * 트럭 목록
     */ 
    list : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM trucks where status='ACTIVE' limit ?, ?";
        db.query(queryString, 
            [param.page*param.limit, param.limit], function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          queryString = "SELECT count(*) size FROM trucks WHERE status='ACTIVE'";
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
     * 개별 트럭 정보 조회 
     */
    one : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM trucks WHERE id = ?";
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
     * 사용자별 트럭 조회 
     */ 
    listByUserId : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM trucks WHERE status='ACTIVE' and owner_id = ? ";
        db.query(queryString, 
            [param.userId], 
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
     * 주선소 차주 카운터
     */
    listCountByBrokerId : function(db, param, resolve, callback) {
      logger.debug('dao param : ', param);
      
      var query = "SELECT count(*) size FROM trucks WHERE status='ACTIVE' AND broker_id = ?";
      var argus = [param.broker_id];
      logger.debug('dao listCountByBrokerId : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    }, 
    /**
     * 트럭 등록 
     */ 
    create : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "INSERT INTO trucks (type, weight, model, car_number, " +
        "registered_number, owner_id, broker_id, status, creator, created, modifier, modified) " +
        " VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, now(), ?, sysdate())"; 
        var argus = [param.type, param.weight, param.model, param.carNumber, 
                      param.registeredNumber, param.ownerId, param.brokerId, 
                      param.userId, param.userId]; 
        console.log('dao create : ', queryString, argus);
        db.query(queryString, argus, 
          function(err, result) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            success(result);
            pool.release(db);
        })
      });
    },
    /**
     * 트럭 수정 
     */
    update : function(db, param, resolve, callback) {
      logger.debug('dao param : ', param);
      logger.debug('dao resolve : ', resolve);
      
      var queryString = "UPDATE trucks SET ";
      var setCol = [];
      var argus = [];
      if (param.type) {
        setCol.push(" type = ? ");
        argus.push(param.type);
      }
      if (param.weight) {
        setCol.push(" weight=? ");
        argus.push(param.weight);
      }
      if (param.model) {
        setCol.push(" model=? ");
        argus.push(param.model);
      }
      if (param.carNumber) {
        setCol.push(" car_number=? ");
        argus.push(param.carNumber);
      }
      if (param.registeredNumber) {
        setCol.push(" registered_number=? ");
        argus.push(param.registeredNumber);
      }
      if (param.status) {
        setCol.push(" status = ? ");
        argus.push(param.status);
      }
      if (param.ownerId) {
        setCol.push(" owner_id = ? ");
        argus.push(param.ownerId);
      }
      if (param.userId) {
        setCol.push(" modifier=? ");
        argus.push(param.userId);
      }
      if (setCol.length > 0) {
        queryString = queryString + setCol.join(" , ") + " WHERE id = ?";
        argus.push(param.id);
      }
      logger.debug('dao update : ', queryString, argus);
      db.query(queryString, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 트럭 삭제 (delete 상태로 변경)
     */
    delete : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE trucks SET status='DELETE' WHERE id = ?";
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
     * 검색 
     */
    find : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        
        var queryString = "SELECT * FROM trucks ";
        var where = [];
        var argument = [];
        if (param.type) {
          where.push(" type = ? ");
          argument.push(param.type);
        }
        if (param.car_number) {
          where.push(" car_number like ? ");
          argument.push('%' + param.car_number + '%');
        }
        if (param.registered_number) {
          where.push(" registered_number like ? ");
          argument.push('%' + param.registered_number + '%');
        }
        if (param.model) {
          where.push(" model like ? ");
          argument.push('%' + param.model + '%');
        }
        if (param.brokerId) {
          where.push(" broker_id = ? ");
          argument.push(param.brokerId);
        }
        if (param.status) {
          where.push(" status = ? ");
          argument.push(param.status);
        } else {
          where.push(" status = ? ");
          argument.push('ACTIVE');
        }

        if (where.length > 0) {
          queryString = queryString + " where " + where.join(" and ");
        }
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
    }
  }
}
  
module.exports = TruckDao();