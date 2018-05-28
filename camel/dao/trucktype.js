'use strict';

//var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var TrucktypeDao = function() {
  return {
    /**
     * 차종 목록
     */ 
    list : function(db, param, resolve, callback) {
      var query = "SELECT * FROM truck_types where status='ACTIVE' " +
      "order by name_kr, weight limit ?, ?";
      var argus = [param.page*param.limit, param.limit];
      console.log('read messages : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, "QUERY ERROR: " + err);
        }
        callback(null, result);
      });
    },
    listCount : function(db, param, resolve, callback) {
      var query = "SELECT count(*) size FROM truck_types WHERE status='ACTIVE'";
      console.log('count messages : ', query);
      db.query(query, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    },
    
    /**
     * 차종별 중량 조회
     */
    listForTruckType : function(db, param, resolve, callback) {
      var query = " select * from truck_types " +
      " where status='ACTIVE' and lower(name_en) like ? or name_kr like ?";
      var argus = [param.name, param.name];
      console.log('read message for receiver : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 차종 등록
     */ 
    createTruckType : function(db, param, resolve, callback) {
      var queryString = 
          "INSERT INTO truck_types (name_kr, name_en, weight ) VALUES (? ,?, ?)";
      var argus = [param.name_kr, param.name_en, param.weight];
      db.query(queryString, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);      
      });
    },
    
    /**
     * 차종 삭제 (INACTIVE 상태로 변경)
     */
    deleteTruckType : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE truck_types SET status='INACTIVE' WHERE id = ?";
        db.query(queryString,
            [param.id], function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "QUERY ERROR: " + err);
            return;
          }
          success();
          pool.release(db);
        });
      });
    }
  }
}
  
module.exports = TrucktypeDao();