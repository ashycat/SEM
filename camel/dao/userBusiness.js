'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var BrokerGroupMembersDao = function() {
  return {
    /**
     * 전체 목록
     */
    list : function(db, param, resolve, callback) {
      var query = "";
      var argus = [param.broker_group_id, param.page*param.limit, param.limit]; 
      console.log('dao list : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 전체 목록수  
     */
    listCount : function(db, param, resolve, callback) {
      var query = "";
      var argus = [param.broker_group_id];
      console.log('dao listCount : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    },   
    /**
     * 등록
     */
    create : function(db, param, resolve, callback){
      var query = "insert into user_business " +
      "(user_id, business_number, business_name, owner_name, business_condition" +
      ", business_type, address_id, address_detail" +
      ", creator, created, modifier, modified) " +
      "values (?, ?, ?, ?, ?" +
      ", ?, ?, ?" +
      ", ?, sysdate(), ?, sysdate());";
      var argus = [
                   param.user_id,
                   param.business_number,
                   param.business_name,
                   param.owner_name,
                   param.business_condition,
                   param.business_type,
                   param.address_id,
                   param.address_detail,
                   param.creator,
                   param.creator
      ]; 
      console.log('dao create : ', query, argus);
      db.query(query, argus, function(err, result){
        if(err){
          return callback(errorCode.DB_QUERY, 'Query:' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 수정
     */
    update : function(db, param, resolve, callback) {
      var query = "";
      var argus = [
                   param.role,
                   param.rate,
                   param.broker_group_id,
                   param.broker_id
                  ]; 
      console.log('dao update : ', query, argus);
      db.query(query, argus, function(err, result){
        if(err){
          return callback(errorCode.DB_QUERY, 'Query:' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 삭제
     * - 전제조건 : 주선소 그룹에 속한 주선소가 없는 경우 삭제 가능
     */
    delete : function(db, param, resolve, callback) {
      var query = "";
      var argus = [param.broker_group_id, param.broker_id];
      console.log('dao delete: ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },

  };
};
  
module.exports = new BrokerGroupMembersDao();