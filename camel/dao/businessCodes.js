'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var BusinessCodes = function() {
  return {
    /**
     * 사업자 업태 목록 조회
     */
    findBusinessCondition : function(param, success, fail) {
      pool.acquire(function(err, db) {
        var query = "SELECT * FROM business_type";
        var where = [];
        var argument = [];
        if (param.name) {
          where.push(" name_kr like ? ");
          argument.push('%' + param.name + '%');
        };
        if (where.length > 0) {
          query = query + " where length(id) = 2 and " + where.join(" and ");
        }
        db.query(query, argument, function(err, row, fields) {
          if (err) {
            return callback(errorCode.DB_QUERY, 'Query : ' + err);
          }
          success(row);
          pool.release(db);
        });
      });
    },
    /**
     * 사업자 업종 목록 조회
     */
    findBusinessType : function(param, success, fail) {
      pool.acquire(function(err, db) {
        var query = "SELECT * FROM business_type";
        var where = [];
        var argument = [];
        if (param.name) {
          where.push(" name_kr like ? ");
          argument.push('%' + param.name + '%');
        };
        if (where.length > 0) {
          query = query + " where length(id) = 5 and " + where.join(" and ");
        }
        db.query(query, argument, function(err, row, fields) {
          if (err) {
            return callback(errorCode.DB_QUERY, 'Query : ' + err);
          }
          success(row);
          pool.release(db);
        });
      });
    },

    
  }
}
  
module.exports = BusinessCodes();