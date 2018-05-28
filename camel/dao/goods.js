'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var GoodsDao = function() {
  return {
    /**
     * 상품 목록
     */ 
    list : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT * FROM goods where status='ACTIVE' limit ?, ?";
        db.query(queryString, 
            [param.page*param.limit, param.limit], 
            function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "Query " + err);
            return;
          }
          queryString = "SELECT count(*) size FROM goods WHERE status='ACTIVE'";
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
     * 개별 화물 조회
     */  
    one : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "";
        if (param.type == 'short') {
          queryString = "SELECT id, weight, length, is_mix, " +
          		"(select concat(category, concat(' ', name)) from goods_category where id = goods_category_id) name, " +
          		"(select name from consigner where id = consigner_id) consigner, " +
              "sender_name, sender_handphone, sender_telephone, " + 
              "sendee_name, sendee_handphone, sendee_telephone, " + 
          		"description " +
          		"FROM goods WHERE id = ? "; 
        } else {
          queryString = "SELECT *, " +
          		"(select concat(category, concat(' ', name)) from goods_category where id = goods_category_id) name " +
          		"FROM goods WHERE id = ? "; 
        }
        console.log('goods one : ', queryString, param);
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
     * 상품 등록 
     */ 
    create : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "INSERT INTO goods " +
        "(consigner_id, weight, length, is_mix, goods_category_id, description, " +
        "sender_name, sender_telephone, sender_handphone, " +
        "sendee_name, sendee_telephone, sendee_handphone, " +
        "creator, created, modifier) " +
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?)";
        var argument = [param.consigner_id, param.weight, param.length, param.is_mix, param.goods_category_id, param.description,  
                        param.sender_name, param.sender_telephone, param.sender_handphone,
                        param.sendee_name, param.sendee_telephone, param.sendee_handphone,
                        param.userId, param.userId];
        console.log('goods create : ', queryString, argument);
        db.query(queryString,
            argument,
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
     * 상품 수정 
     */
    update : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "UPDATE goods SET " +
        "weight=?, length=?, is_mix=?, goods_category_id=?, description=?, " +
        "sender_name=?, sender_telephone=?, sender_handphone=?, " +
        "sendee_name=?, sendee_telephone=?, sendee_handphone=?, " +
        "modifier=? " +
        " WHERE id=?";
        
        db.query(queryString,
            [param.weight, param.length, param.isMix, param.goodsCategoryId, param.description,  
             param.senderName, param.senderTelephone, param.senderHandphone,
             param.sendeeName, param.sendeeTelephone, param.sendeeHandphone,
             param.userId, param.id],
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
    delete : function(param, success, fail) {
      // TODO 오퍼가 연결되어 있고 제결되어 있으면 삭제하지 못한다. ? 아님 삭제하고 알린다 ? 삭제는 누가 할 수 있나 ?
      success();
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
        
        var queryString = "SELECT * FROM goods ";
        var where = [];
        var argument = [];
        if (param.weight) {
          where.push(" weight = ? ");
          argument.push(param.weight);
        }
        if (param.length) {
          where.push(" length = ? ");
          argument.push(param.length);
        }
        if (param.isMix) {
          where.push(" is_mix = ? ");
          argument.push(param.isMix);
        }
        if (param.goodsCategoryId) {
          where.push(" goods_category_id = ? ");
          argument.push(param.goodsCategoryId);
        }
        if (param.senderName) {
          where.push(" sender_name = ? ");
          argument.push(param.senderName);
        }
        if (param.senderTelephone) {
          where.push(" sender_telephone = ? ");
          argument.push(param.senderTelephone);
        }
        if (param.senderHandphone) {
          where.push(" sender_handphone = ? ");
          argument.push(param.senderHandphone);
        }
        if (param.sendeeName) {
          where.push(" sendee_name = ? ");
          argument.push(param.sendeeName);
        }
        if (param.sendeeTelephone) {
          where.push(" sendee_telephone = ? ");
          argument.push(param.sendeeTelephone);
        }
        if (param.sendeeHandphone) {
          where.push(" sendee_handphone = ? ");
          argument.push(param.sendeeHandphone);
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
    },
    /**
     * 상품 등록 
     */ 
    createGoods : function(db, param, resolve, callback) {
      var query = "INSERT INTO goods " +
          "(consigner_id, weight, length, is_mix, " +
          "goods_category_id, description, " +
          "sender_name, sender_telephone, sender_handphone, " +
          "sendee_name, sendee_telephone, sendee_handphone, " +
          "creator, created, modifier) " +
          " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?)";
      var argus = [param.consigner_id, param.goods_weight, param.length, param.is_mix, 
                   param.goods_category_id, param.description,  
                   param.sender_name, param.sender_telephone, param.sender_handphone,
                   param.sendee_name, param.sendee_telephone, param.sendee_handphone,
                   param.userId, param.userId];
      console.log('dao createGoods : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        param.goods_id = result.insertId;
        callback(null, {goods_id:result.insertId} );
      });
    },
    /**
     * 상품 수정 
     */
    updateGoods : function(db, param, resolve, callback) {
      var query = "UPDATE goods SET " +
          "weight=?, length=?, is_mix=?, " +
          "goods_category_id=?, description=?, " +
          "sender_name=?, sender_telephone=?, sender_handphone=?, " +
          "sendee_name=?, sendee_telephone=?, sendee_handphone=?, " +
          "modifier=? " +
          "WHERE id=?";
      var argus = [param.goods_weight, param.length, param.is_mix, 
                   param.goods_category_id, param.description,  
                   param.sender_name, param.sender_telephone, param.sender_handphone,
                   param.sendee_name, param.sendee_telephone, param.sendee_handphone,
                   param.userId, param.goods_id];
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 상품 삭제  
     */
    deleteGoods : function(db, param, resolve, callback) {
      var query = "DELETE FROM goods WHERE id=?";
      var argus = [param.id];
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },

  }
}
  
module.exports = GoodsDao();
