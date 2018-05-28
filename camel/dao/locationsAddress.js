'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var AllocationDao = function() {
  return {
    /**
     * 지번 우편번호 조회(검색) 
     */ 
    listByLocationName : function(db, param, resolve, callback) {
      var query = "select * from locations_address " +
      " where location_name like ? limit ?, ?";
      var argus = [
                   '%' + param.location_name + '%', 
                   param.page*param.limit, 
                   param.limit
                   ]; 
      console.log('dao listByLocationName : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },

    /**
     * 도로명 우편번호 조회(검색) 
     */ 
    listByRoadName : function(db, param, resolve, callback) {
      var query = "select * from locations_address " +
      " where road_name like ? limit ?, ?";
      var argus = [
                   '%' + param.road_name + '%', 
                   param.page*param.limit, 
                   param.limit
                   ]; 
      console.log('dao list : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 주소 조회 
     */ 
    detail : function(db, param, resolve, callback) {
      var query = "select * from locations_address " +
      " where id = ?";
      var argus = [ param.id ]; 
      console.log('dao list : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
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