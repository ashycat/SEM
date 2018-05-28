'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var AllocationDao = function() {
  return {
    /**
     * 배차 목록 조회
     */ 
    list : function(db, param, resolve, callback) {
      var query = "SELECT a.id, a.order_id, a.offer_id, a.allocator, a.allocated, " +
          "ord.type, ord.load_datetime, ord.load_method, ord.is_shuttle, " +
          "ord.unload_datetime, ord.unload_method, " +
          "(select name from view_locations_name where id = ord.source_id) source, " +
          "(select name from view_locations_name where id = ord.destination_id) destination, " +
          "ord.goods_id, " +
          "ord.weight, ord.freight, ord.fee, " +
          "ord.broker_id, ord.status, ord.creator orderer, ord.created order_day, " +
          "off.type, off.truck_id, off.creator offerrer, off.created offer_day " +
          "FROM allocations a, orders ord, offers off " +
          "WHERE a.order_id = ord.id and a.offer_id = off.id order by a.id desc limit ?, ?";
      var argus = [param.page*param.limit, param.limit]; 
      console.log('read allocation : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 배차 목록 개수 조회 
     */ 
    listCount : function(db, param, resolve, callback) {
      var query = "SELECT count(*) size " +
          "FROM allocations a, orders ord, offers off " +
          "WHERE a.order_id = ord.id and a.offer_id = off.id";
      console.log('count allocations : ', query);
      db.query(query, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    },
    find : function(db, param, resolve, callback) {
      var query = "SELECT a.id, a.order_id, a.offer_id, a.allocator, a.allocated, " +
        "ord.type, ord.load_datetime, ord.load_method, ord.is_shuttle, " +
        "ord.unload_datetime, ord.unload_method, " +
        "(select name from view_locations_name where id = ord.source_id) source, " +
        "(select name from view_locations_name where id = ord.destination_id) destination, " +
        "ord.goods_id, " +
        "ord.weight, ord.freight, ord.fee, " +
        "ord.broker_id, ord.status, ord.creator orderer, ord.created order_day, " +
        "off.type, off.truck_id, off.creator offerrer, off.created offer_day " +
        "FROM allocations a, orders ord, offers off ";
      var where = [];
      var argus = [];
      if (param.allocator) {
        where.push(" allocator = ? ");
        argus.push(param.allocator);
      }
      if (param.loadStart) {
        where.push(" ord.load_datetime >= ? ");
        argus.push(param.loadStart);
      }
      if (param.loadEnd) {
        where.push(" ord.load_datetime <= ? ");
        argus.push(param.loadEnd);
      }
      where.push(" a.order_id = ord.id ");
      where.push(" a.offer_id = off.id ")
      
      if (where.length > 0) {
        query = query + " WHERE " + where.join(" and ");
      }
      query = query + " ORDER BY ord.load_datetime desc limit ?, ?";
      argus.push(param.page*param.limit);
      argus.push(param.limit);
      console.log('allocated : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    findCount : function(db, param, resolve, callback) {
      var query = "SELECT count(*) size " +
      		"FROM allocations a, orders ord, offers off ";
      var where = [];
      var argus = [];
      if (param.allocator) {
        where.push(" allocator = ? ");
        argus.push(param.allocator);
      }
      if (param.loadStart) {
        where.push(" ord.load_datetime >= ? ");
        argus.push(param.loadStart);
      }
      if (param.loadEnd) {
        where.push(" ord.load_datetime <= ? ");
        argus.push(param.loadEnd);
      }
      where.push(" a.order_id = ord.id ");
      where.push(" a.offer_id = off.id ")
      
      if (where.length > 0) {
        query = query + " WHERE " + where.join(" and ");
      }
      console.log('allocated count : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        console.log('result : ', result);
        callback(null, result[0]);
      });
    },
    /**
     * 개별 배차 조회
     */  
    findOne : function(db, param, resolve, callback) {
      var query = "SELECT a.id, a.order_id, a.offer_id, a.allocator, a.allocated, " +
      "ord.type, ord.load_datetime, ord.load_method, ord.is_shuttle, " +
      "ord.unload_datetime, ord.unload_method, " +
      "(select name from view_locations_name where id = ord.source_id) source, " +
      "(select name from view_locations_name where id = ord.destination_id) destination, " +
      "ord.goods_id, " +
      "ord.weight, ord.freight, ord.fee, " +
      "ord.broker_id, ord.status, ord.creator orderer, ord.created order_day, " +
      "off.type, off.truck_id, off.creator offerrer, off.created offer_day " +
      "FROM allocations a, orders ord, offers off " +
      "WHERE a.id = ?"
      var argus = [param.id];
      db.query(query, argus, function(err, row, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    }, 
    
    /**
     * 배차 삭제
     */ 
    delete : function(param, success, fail) {
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
          var selectQuery = "SELECT order_id FROM allocations WHERE id = ?";
          db.query(selectQuery, [param.id], function(err, rows, fields) {
            if (err) {
              fail(errorCode.DB_QUERY, "Query " + err);
              return;
            }
            var orderId = rows[0].order_id;
            
            var queryString = "DELETE FROM allocations WHERE id = ?";
            db.query(queryString, [param.id], function(err, rows, fields) {
              if (err) {
                fail(errorCode.DB_QUERY, "Query " + err);
                return;
              }
              var updateAllocQuery = "UPDATE orders SET is_alloc = 0 WHERE id = ?";
              db.query(updateAllocQuery, [orderId], function(err, upAllocResult) {
                if (err) {
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
            });
          });
        });
      });
    },
    allocatedOffer : function(db, param, resolve, callback) {
      var query = "SELECT t.*, u.user_name, u.handphone, u.telephone " +
          "FROM allocations a, offers o, trucks t, users u " +
          "WHERE a.order_id = ? AND a.offer_id = o.id " +
          "AND o.truck_id = t.id AND t.owner_id = u.id ";
      var argus = [param.id] ;
      console.log('allocated offer : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        console.log('result : ', result);
        callback(null, result[0]);
      });
    },
    
    allocatedOffer1 : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT t.*, u.user_name, u.handphone, u.telephone " +
        		"FROM allocations a, offers o, trucks t, users u " +
        		"WHERE a.order_id = ? AND a.offer_id = o.id " +
        		"AND o.truck_id = t.id AND t.owner_id = u.id ";
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
     * 배차 신청 등록 
     * prevResult는 offer가 등록된 후에 offer_id를 받는 방법
     */
    createAllocation : function(db, param, resolve, callback) {
      console.log('createAllocation : ', param, resolve, callback);
      var query = "INSERT INTO allocations " +
      		"(order_id, offer_id, allocator, allocated) " +
      		"VALUES (?, ?, ?, now())"; 
      var argus = [param.orderId, resolve.offer_id, param.userId]; 
      console.log('create allocation : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        param.order_status = 1;
        callback(null, {allocation_id : result.insertId});
      });
    },
    
    /**
     * 배차 삭제
     */ 
    deleteAllocation : function(db, param, resolve, callback) {
      var query = "DELETE FROM allocations WHERE id = ?";
      var argus = [param.id];
      console.log('delete allocation : ', query, argus);
      db.query(query, argus, function(err, rows, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null);
      });
    },
  }
}
  
module.exports = AllocationDao();