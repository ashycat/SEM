'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var BrokerGroupsDao = function() {
  return {
    /**
     * 전체 목록
     */
    list : function(db, param, resolve, callback) {
      var query = "select * from broker_groups";
      var argus = [param.page*param.limit, param.limit]; 
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
      var query = "select count(*) size from broker_groups";
      var argus = [];
      console.log('dao listCount : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },   
    /**
     * 등록
     */
    create : function(db, param, resolve, callback){
      var query = "insert into broker_groups " +
      "(id, name, creator, created, modifier, modified) " +
      "values (?,?,?,sysdate(),?,sysdate());";
      
      var argus = [
                   param.id,
                   param.name,
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
      var query = "update broker_groups set name = ?, modifier = ?, modified = sysdate() where id = ? ";
      
      var argus = [
                   param.name,
                   param.modifier,
                   param.id
                   ];
      console.log('dao update : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 삭제
     * - 전제조건 : 주선소 그룹에 속한 주선소가 없는 경우 삭제 가능
     */
    delete : function(db, param, resolve, callback) {
      var query = "delete from broker_groups where id = ?";
      var argus = [param.broker_group_id];
      console.log('dao delete: ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },

  }
};
  
module.exports = BrokerGroupsDao();