'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var ConsignerDao = function() {
  return {
    /**
     * 전체 화주 목록
     */
    list : function(db, param, resolve, callback) {
      var query = "SELECT * FROM consigner WHERE status='ACTIVE' LIMIT ?, ?";
      var argus = [param.page*param.limit, param.limit]; 
      console.log('list consigner : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 전체 화주수  
     */
    listCount : function(db, param, resolve, callback) {
      var query = "SELECT count(*) size FROM consigner WHERE status='ACTIVE'";
      var argus = [];
      console.log('list count consigner : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },   
    /**
     * CAM-32
     * 주선소의 화주 목록
     */
    listByBroker : function(db, param, resolve, callback) {
      var query = "SELECT * FROM consigner " +
      		"WHERE broker_id = ? and status='ACTIVE' " +
      		"LIMIT ?, ?";
      var argus = [param.broker_id, param.page*param.limit, param.limit]; 
      console.log('list consigner by broker : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * CAM-32
     * 주선소의 화주 개수  
     */
    listCountByBroker : function(db, param, resolve, callback) {
      var query = "SELECT count(*) size FROM consigner " +
      		"WHERE broker_id = ? and status='ACTIVE'";
      var argus = [param.broker_id];
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    },   
    
    /*
     * 화주 등록(기본정보)
     */
    create : function(db, param, resolve, callback) {
      var query = "INSERT INTO consigner " +
      		"(name, phone, fax, broker_id, " +
      		"status, creator, created, modifier, modified) " +
          "values (?,?,?,?,'ACTIVE',?,sysdate(),?, sysdate());";
      var argus = [param.name,
                   param.phone,
                   param.fax,
                   param.broker_id,
                   param.creator,
                   param.creator
                   ] 
      console.log('dao create : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }

        //callback(null, {consigner_id:result.insertId});
        callback(null, result);
      });
    },
    
    
    /*
     * 화주 정보 수정
     */
    update: function(db, param, resolve, callback) {
      var query = "UPDATE consigner SET name=?, phone=?, fax=?, modifier=?, modified=sysdate() where id =?";
      var argus = [param.name, param.phone, param.fax, param.user_id, param.consigner_id];
      console.log('dao update : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 화주 정보 삭제 (status 정보 DELETE로 변경)
     */
    deleteConsigner : function(db, param, resolve, callback) {
      var query = "UPDATE consigner SET status='DELETE' WHERE id = ?";
      var argus = [param.id];
      console.log('dao deleteConsiger : ', query, argus);
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
    find : function(db, param, resolve, callback) {
      var query = "SELECT * FROM consigner ";
      var where = [];
      var argument = [];

      if (param.name) {
        where.push(" (name like ? )");
        argument.push('%' + param.name + '%');
      }
      if (param.brokerId) {
        where.push(" broker_id = ? ");
        argument.push(param.brokerId);
      }
      if (param.phone) {
        where.push(" phone = ? ");
        argument.push(param.telephone);
      }
      if (param.fax) {
        where.push(" fax = ? ");
        argument.push(param.fax);
      }
      if (where.length > 0) {
        query = query + " where " + where.join(" and ");
      }
      query = query + ' LIMIT ?, ?';
      argument.push(param.page*param.limit);
      argument.push(param.limit);
      
      console.log('find consigner ', query, argument);
      db.query(query, argument, function(err, rows, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, rows);
      });
    },
    
    /**
     * 개별 화주 조회
     */  
    findOne : function(db, param, resolve, callback) {
      var query = "SELECT * FROM consigner WHERE id = ?";
      var argus = [param.id];
      console.log('consinger one : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    }, 
    
  }
}
  
module.exports = ConsignerDao();