'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var BrokerGroupMembersDao = function() {
  return {
    /**
     * 전체 목록
     */
    list : function(db, param, resolve, callback) {
      var query = "select * from " +
        " broker_group_members a, brokers b " +
        " where a.broker_group_id = ? and a.broker_id = b.id limit ?, ?";
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
      var query = "select count(*) size from " +
        " broker_group_members a, brokers b " +
        " where a.broker_group_id = ? and a.broker_id = b.id";
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
      var query = "insert into broker_group_members " +
      "(broker_group_id, broker_id, role, rate, creator, created) " +
      "values (?,?,?,?,?,sysdate());";
      
      var argus = [
                   param.broker_group_id,
                   param.broker_id,
                   param.role,
                   param.rate,
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
      var query = "update broker_group_members set " +
      " role = ?, rate = ? where broker_group_id = ? and broker_id = ? ";
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
      var query = "delete from broker_group_members where broker_group_id = ? and broker_id = ?";
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