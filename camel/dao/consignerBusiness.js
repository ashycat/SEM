'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var ConsignerBusinessDao = function() {
  return {
    /**
     * 전체 목록
     */
    list : function(db, param, resolve, callback) {
      var query = "";
      var argus = [param.page*param.limit, param.limit]; 
      console.log('list consignerBusiness : ', query, argus);
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
      console.log('list count consignerBusiness : ', query, argus);
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
      var query = "INSERT INTO consigner_business " +
      "(consigner_id, taxtype, ceo_name, name, conditions, type, " +
      "address_id, address_detail, creator, modifier, created, modified) " +
      "values (?,?,?,?,?,?,?,?,?,?,sysdate(),sysdate());";
      
      // 직접 호출될 경우 param 으로 전달될 수 도 있다.
      var consigner_id = resolve.consigner_id;
      if( consigner_id === undefined){
        consigner_id = param.consigner_id;
      }
      
      var argus = [
                   consigner_id,
                   param.business_taxtype,
                   param.business_ceo_name,
                   param.business_name,
                   param.business_condition,
                   param.business_type,
                   param.business_address_id,
                   param.business_address_detail,
                   param.creator,
                   param.creator
      ]; 
      console.log('dao create : ', query, argus);
      db.query(query, argus, function(err, result){
        if(err){
          return callback(errorCode.DB_QUERY, 'Query:' + err);
        }
        
        result.consigner_id = consigner_id;
        result.business_id = result.insertId;
        callback(null, result);
      });
    },
    /**
     * 수정
     */
    update : function(db, param, resolve, callback) {
      var query = " update consigner_business set " +
        " license = ?, ceo_name = ?, taxtype = ?, name = ?, "+
        " conditions = ?, type = ?, address_id = ?, address_detail = ?, " +
        " modifier = ?, modified = sysdate()" + 
        " where id = ? ";
      
      var argus = [
                    param.business_license,
                    param.business_ceo_name,
                    param.business_taxtype,
                    param.business_name,
                    param.business_condition,
                    param.business_type,
                    param.business_address_id,
                    param.business_address_detail,
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
     */
    deleteByConsigner : function(db, param, resolve, callback) {
      var query = "delete from consigner_business where consigner_id = ?";
      var argus = [param.consigner_id];
      
      console.log('dao deleteByConsinger: ', query, argus);
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
      var query = "";
      var argus = [param.id];
      console.log('find consignerBusiness: ', query, argus);
    },
    
    /**
     * 개별 조회
     */  
    findOne : function(db, param, resolve, callback) {
      var query = "";
      var argus = [param.id];
      console.log('find one consignerBusiness: ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    }, 
    
  }
};
  
module.exports = ConsignerBusinessDao();