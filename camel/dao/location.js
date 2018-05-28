'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var AllocationDao = function() {
  return {
    /**
     * 광역시도 목록 조회
     */ 
    metroList : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM locations_metro";
        db.query(queryString, 
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
     * 시군구 목록 조회
     */ 
    cityList : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM locations_city WHERE metro_id = ? ";
        db.query(queryString, 
            [param.id],
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
     * 시군구 목록 조회
     */ 
    unitList : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var query = "SELECT * FROM locations WHERE city_id = ? ";
        var argus = [param.id];
        db.query(query, argus, function(err, rows, fields) {
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
     * 읍면동(지역명) 검색
     */
    find : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var query = "SELECT lm.name metro_name, lc.city_name1, " +
        		"lc.city_name2, l.id, l.name " +
        		"FROM locations l, locations_metro lm, locations_city lc " +
        		"WHERE (lc.city_name2 like ? or l.name like ?) and l.city_id = lc.id and lc.metro_id = lm.id";
        var argus = ['%'+param.name+'%', '%'+param.name+'%']; 
        console.log("find query : ", query, argus);
        db.query(query, argus, function(err, rows, fields) {
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
  
module.exports = AllocationDao();