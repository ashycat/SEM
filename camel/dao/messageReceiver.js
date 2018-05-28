'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');

var MessageReceiverDao = function() {
  return {
    /**
     * 개별 메시지의 수신자 목록 조회
     */  
    listByMessage : function(param, success, fail) {
      console.log('list message : ', param);
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var query = "SELECT r.*, u.user_id, u.user_name, u.role " +
        		"FROM messages_receiver r, users u " +
            "WHERE message_id = ? and r.receiver_id = u.id";
        var argus = [param.id];
        console.log('list by message_id ', query, argus);
        db.query(query, argus, function(err, rows, fields) {
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
     * 메시지 등록
     */ 
    createReceiver : function(db, param, resolve, callback) {
      console.log('createMessage : ', param);
      var query = "INSERT INTO messages_receiver (message_id, receiver_id, is_read1) " +
          "VALUES (?, ?, 0)";
      var argus = [param.message_id, param.receiver_id];
      console.log('add message receiver ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result.insertId);
      });
    },
    /**
     * 메시지 수정
     */ 
    update : function(param, success, fail) {
      fail(errorCode.NOT_SUPPORT_FUNCTION, "not support function");
    },
    /**
     * 메시지 수신자 삭제  
     */ 
    delete : function(param, success, fail) {
      fail(errorCode.NOT_SUPPORT_FUNCTION, "not support function");
    }
  }
}
  
module.exports = MessageReceiverDao();