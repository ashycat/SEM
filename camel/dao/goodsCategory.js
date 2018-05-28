'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var GoodsCategoryDao = function() {
  return {
    /**
     * 상품 카테고리 목록
     */ 
    list : function(param, success, fail) {
      console.log('goodsCategories list');
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM goods_category ";
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
     * 상품 카테고리 등록 
     */ 
    create : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "INSERT INTO goods_category (category, name) " +
        " VALUES (?, ?)"; 
        db.query(queryString,
          [param.category, param.name],
          function(err, result) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            success();
            pool.release(db);
        })
      });
    },
    /**
     * 상품 카테고리 수정 
     */
    update : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE goods_category SET category=?, name=? " +
        " WHERE id=?";
        db.query(queryString,
            [param.category, param.name, param.id], 
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
     * 검색 
     */
    find : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        
        var queryString = "SELECT * FROM goods_category ";
        var where = [];
        var argument = [];
        if (param.category) {
          where.push(" category like ? ");
          argument.push('%' + param.category + '%');
        }
        if (param.name) {
          where.push(" name like ? ");
          argument.push('%' + param.name + '%');
        }
        if (where.length > 0) {
          queryString = queryString + " where " + where.join(" and ");
        }
        console.log('find ', queryString);
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
  
module.exports = GoodsCategoryDao();