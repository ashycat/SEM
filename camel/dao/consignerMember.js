'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');
var logger = require('../lib/logger')

var ConsignerMemberDao = function() {
  return {
    /**
     * 전체 목록
     */
    list : function(db, param, resolve, callback) {
      var query = "";
      var argus = [param.page*param.limit, param.limit]; 
      console.log('list consignerMember : ', query, argus);
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
      var argus = [];
      console.log('list count consignerMember : ', query, argus);
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
      logger.debug('dao param : ', param);
      logger.debug('dao resolve : ', resolve);
        
      var query = "INSERT INTO consigner_member " +
      "(consigner_id, name, telephone, handphone, email, description, " +
      " creator, modifier, created, modified) " +
      "values (?,?,?,?,?,?,?,?,sysdate(),sysdate())";
      
      // 직접 호출될 경우 param 으로 전달될 수 도 있다.
      var consigner_id = resolve.consigner_id;
      if( consigner_id === undefined){
        consigner_id = param.consigner_id;
      }
      
      var argus = [
                   consigner_id,
                   param.member_name,
                   param.member_telephone,
                   param.member_handphone,
                   param.member_email,
                   param.member_description,
                   param.creator,
                   param.creator
      ]; 
      logger.debug('dao create : ', query, argus);
      db.query(query, argus, function(err, result){
        if(err){
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        
        result.consigner_id = consigner_id;
        result.member_id = result.insertId;
        callback(null, result);
      });
    },
    
    /**
     * 수정
     */
    update : function(db, param, resolve, callback) {
      var query = " update consigner_member set " +
        " name = ?, telephone = ?, handphone = ?, email = ?, description = ?, modifier = ?, modified = sysdate() " +
        " where id = ?";
      var argus = [
                   param.member_name,
                   param.member_telephone,
                   param.member_handphone,
                   param.member_email,
                   param.member_description,
                   param.modifier,
                   param.id,
                   ];
      console.log('update consignerMember : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * id로 삭제
     */
    delete : function(db, param, resolve, callback) {
      var query = "delete from consigner_member where id = ?";
      var argus = [param.consigner_id];
      console.log('dao delete : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * consiger_id 로 삭제
     */
    deleteByConsigner : function(db, param, resolve, callback) {
      var query = "delete from consigner_member where consigner_id = ?";
      var argus = [param.consigner_id];
      console.log('dao deleteByConsigner : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },

    /**
     * 검색 
     */
    find : function(param, success, fail) {
    },
    
  }
};
  
module.exports = ConsignerMemberDao();