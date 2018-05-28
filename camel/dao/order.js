'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var OrderDao = function() {
  return {
    /**
     * 전체 오더 목록 조회
     */ 
    list : function(db, param, resolve, callback) {
      var query = "SELECT o.*, " +
        "(select name from view_locations_name where id = o.source_id) source, " +
        "(select name from view_locations_name where id = o.destination_id) destination, " +
        "a.allocator, a.allocated, a.offer_id " +
        "FROM " +
        "(select o.*, " +
        "(select concat(category, concat(' ', name)) from goods_category where id = g.goods_category_id) goods_names, " +
        "g.weight goods_weight, g.length goods_length, g.is_mix, g.description " +
        "from orders o, goods g where o.goods_id = g.id) o " +
        "left outer join allocations a on (a.order_id = o.id) " +
        "order by o.id desc limit ?, ?";  
      var argus = [param.page*param.limit, param.limit];
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 전체 오더 목록 개수 
     */ 
    listCount : function(db, param, resolve, callback) {
      var query = "SELECT count(*) size " +
        "FROM " +
        "(select o.*, " +
        "(select concat(category, concat(' ', name)) goods_names from goods_category where id = g.goods_category_id), " +
        "g.weight goods_weight, g.length goods_length, g.is_mix, g.description " +
        "from orders o, goods g where o.goods_id = g.id) o " +
        "left outer join allocations a on (a.order_id = o.id) ";
      var argus = [];
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },    
    /**
     * 주선소 유저 - 오더 목록 조회
     */ 
    listForBroker : function(db, param, resolve, callback) {
      var query = "SELECT o.*, " +
          "(select name from view_locations_name where id = o.source_id) source, " +
          "(select name from view_locations_name where id = o.destination_id) destination, " +
          "a.allocator, a.allocated, a.offer_id " +
          "FROM " +
          "(select o.*, " +
          "(select concat(category, concat(' ', name)) from goods_category where id = g.goods_category_id) goods_names, " +
          "g.weight goods_weight, g.length goods_length, g.is_mix, g.description " +
          "from orders o, goods g where o.broker_id = ? and o.goods_id = g.id) o " +
          "left outer join allocations a on (a.order_id = o.id) " +
          "order by o.id desc limit ?, ?";
      var argus = [param.brokerId, param.page*param.limit, param.limit];
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 주선소 유저 - 오더 목록 개수 
     */ 
    listCountForBroker : function(db, param, resolve, callback) {
      var query = "SELECT count(*) size " +
          "FROM " +
          "(select o.*, " +
          "(select concat(category, concat(' ', name)) from goods_category where id = g.goods_category_id) goods_names, " +
          "g.weight goods_weight, g.length goods_length, g.is_mix, g.description " +
          "from orders o, goods g where o.broker_id = ? and o.goods_id = g.id) o " +
          "left outer join allocations a on (a.order_id = o.id) ";
      var argus = [param.brokerId];
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 차주 - 오더 목록 조회
     */ 
    listForTruckUser : function(db, param, resolve, callback) {
      var query = "";
      var argus = [];
      if (param.type == 'NORMAL') {
        query = "SELECT o.*, " +
            "(select name from view_locations_name where id = o.source_id) source, " +
            "(select name from view_locations_name where id = o.destination_id) destination, " +
            "(select concat(category, concat(' ', name)) from goods_category where id = g.goods_category_id) goods_names, " +
            "g.weight goods_weight, g.length goods_length, g.is_mix, g.description " +
            "FROM orders o, goods g " +
            "WHERE o.goods_id = g.id and o.status='ACTIVE' and o.is_alloc = 0 " +
            "and o.type=? and o.broker_id = ? and o.weight <= ? " +
            "order by o.id desc limit ?, ?"; 
        argus = [param.type, param.brokerId, param.weight, param.page*param.limit, param.limit];
      } else {
        query = "SELECT o.*, " +
            "(select name from view_locations_name where id = o.source_id) source, " +
            "(select name from view_locations_name where id = o.destination_id) destination, " +
            "(select concat(category, concat(' ', name)) from goods_category where id = g.goods_category_id) goods_names, " +
            "g.weight goods_weight, g.length goods_length, g.is_mix, g.description " +
            "FROM orders o, goods g " +
            "WHERE o.goods_id = g.id and o.status='ACTIVE' and o.is_alloc = 0 " +
            "and o.type=? and o.weight <= ? " +
            "order by o.id desc limit ?, ?"; 
        argus = [param.type, param.weight, param.page*param.limit, param.limit];
      }
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 차주 - 오더 목록 개수 
     */ 
    listCountForTruckUser : function(db, param, resolve, callback) {
      var query = "";
      var argus = [];
      if (param.type == 'NORMAL') {
        query = "SELECT count(*) size FROM orders o, goods g " +
            "WHERE o.goods_id = g.id and o.status='ACTIVE' and o.is_alloc = 0 " +
            "and o.type=? and o.broker_id = ? and o.weight <= ? ";
        argus = [param.type, param.brokerId, param.weight];
      } else {
        query = "SELECT count(*) size FROM orders o, goods g " +
            "WHERE o.goods_id = g.id and o.status='ACTIVE' and o.is_alloc = 0 " +
            "and o.type=? and o.weight <= ? ";
        argus = [param.type, param.weight];
      }
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 오더 검색
     */
    find : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        
        var queryString = "SELECT * FROM orders ";
        var where = [];
        var argument = [];
        if (param.type) {
          where.push(" type = ? ");
          argument.push(param.type);
        }
        if (param.isShuttle) {
          where.push(" isShuttle like ? ");
          argument.push('%' + param.isShuttle + '%');
        }
        if (param.freightStart) {
          where.push(" freight >= ? ");
          argument.push('%' + param.freightStart + '%');
        }
        if (param.freightEnd) {
          where.push(" freight <= ? ");
          argument.push('%' + param.freightEnd + '%');
        }
        if (param.brokerId) {
          where.push(" broker_id = ? ");
          argument.push(param.brokerId);
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
     * 개별 오더 조회
     */  
    findOne : function(db, param, resolve, callback) {
      var query = "SELECT *, " +
          "(select city_name from locations_address where id = source_id) source, " +
          "(select city_name from locations_address where id = destination_id) destination " +
      		"FROM orders WHERE id = ? ";
      var argus = [param.id];
      console.log('order one : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    }, 
    /**
     * 오더 등록
     */ 
    createOrder : function(db, param, resolve, callback) {
      console.log('createOrder : ', param, resolve, callback);
      var query = "INSERT INTO orders " +
      		"(type, load_datetime, load_method, unload_datetime, unload_method, " +
          "is_shuttle, is_quick, source_id, destination_id, goods_id, weight, " +
          "payment_type, freight, fee, " +
          "broker_id, status, creator, created, modifier) " +
          "VALUES ?";
      var values = [];
      var today = new Date();
      for (var i=0; i < param.truckCount; i++) {
        values.push([param.type, param.load_datetime, param.load_method, param.unload_datetime, param.unload_method, 
                     param.is_shuttle, param.is_quick, param.source_id, param.destination_id, 
                     resolve.goods_id, param.order_weight, 
                     param.payment_type, param.freight, param.fee, param.broker_id, 
                     'ACTIVE', param.userId, today, param.userId]);
      }
      console.log('dao createOrders : ', query, values);
      db.query(query, [values], function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },    
    /**
     * 오더 수정 
     */
    updateOrder : function(db, param, resolve, callback) {
      console.log('updateOrder : ', param);
      var query = "UPDATE orders SET " +
      		"type=?, load_datetime=?, load_method=?, " +
      		"unload_datetime=?, unload_method=?, " +
          "is_quick=?, is_shuttle=?, source_id=?, destination_id=?, " +
          "weight=?, freight=?, fee=?, modifier=? " +
          "WHERE id = ?";
      var argus = [param.type, param.load_datetime, param.load_method, 
                   param.unload_datetime, param.unload_method, 
                   param.is_quick, param.is_shuttle, 
                   param.source_id, param.destination_id, 
                   param.order_weight, param.freight, param.fee, param.userId, 
                   param.order_id];
      console.log('update order : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },    
    /**
     * 오더 삭제 처리 
     * TODO : 오더를 삭제하는 것은 status를 DELETE로 바꾸는 것으로 한다. 
     * 단, 연결되어 있는 배차정보는 어떻게 끊어야 하나 ? 
     * 지워버리나 ? 같이 status 처리하나 ? (status 처리해도 큰 의미가 없어 보인다. )
     */ 
    deleteOrder : function(db, param, resolve, callback) {
      var query = "UPDATE orders set status='DELETE' WHERE id = ?";
      var argus = [param.id];
      console.log('delete order : ', query, argus);
      db.query(query, arugs, function(err, rows, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, null);
      });
    },
    /**
     * 배차 상태 수정 (TODO : 나중에 이 값을 없애는게 좋을 것 같다.)
     */
    updateAllocationStatus : function(db, param, resolve, callback) {
      console.log('updateAllocationStatus : ', param, resolve, callback);
      var query = "UPDATE orders SET is_alloc = ? WHERE id = ?";
      var argus = [param.order_status, param.orderId];
      console.log('update allocation status : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, null);
      });
    },
  }
}
  
module.exports = OrderDao();
