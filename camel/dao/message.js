'use strict';

var errorCode = require('../lib/errorCode');

var MessageDao = function() {
  return {
    /**
     * 메시지 조회
     * 2015.09.08 by 전규용 : users 테이블의 role 컬럼 삭제
     */  
    list : function(db, param, resolve, callback) {
      var query = "SELECT m.id, m.subject, m.content, m.created, " +
          "u.user_id, u.user_name " +
          "FROM messages m, users u " +
          "WHERE m.status='ACTIVE' and m.creator = u.id " +
          "order by m.id desc limit ?, ?";
      var argus = [param.page*param.limit, param.limit]; 
      console.log('read messages : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    listCount : function(db, param, resolve, callback) {
      var query = "SELECT count(*) size FROM messages WHERE status='ACTIVE'";
      console.log('count messages : ', query);
      db.query(query, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    },
    /**
     * 개별 사용자별 메시지 조회
     */  
    listForReceiver : function(db, param, resolve, callback) {
      var query = "SELECT distinct m.* " +
          "FROM messages m, messages_receiver mr " +
          "WHERE mr.receiver_id = ? or mr.receiver_id = 0 and " +
          "m.id = mr.message_id and m.status = 'ACTIVE' " +
          "order by m.id desc limit ?, ?";
      var argus = [param.userId, param.page*param.limit, param.limit];
      console.log('read message for receiver : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 개별 사용자별 메시지 조회
     */  
    listCountForReceiver : function(db, param, resolve, callback) {
      var query = "SELECT distinct count(m.id) " +
          "FROM messages m, messages_receiver mr " +
          "WHERE mr.receiver_id = ? or mr.receiver_id = 0 and " +
          "m.id = mr.message_id and m.status = 'ACTIVE'";
      var argus = [param.id, param.page*param.limit, param.limit];
      console.log('read message for receiver : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 개별 메시지 조회
     * 2015.09.08 by 전규용 : users 테이블의 role 컬럼 삭제
     */ 
    findOne : function(db, param, resolve, callback) {
      var query = "SELECT n.*, u.user_id, u.user_name " +
          "FROM messages n, users u " +
          "WHERE n.id = ? and n.creator = u.id";
      var argus = [param.id];
      console.log('read one message : ', query, argus);
      
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    }, 
    /**
     * 수신자의 읽음 표시 
     */
    checkReading : function(db, param, resolve, callback) {
      var query = "UPDATE messages_receiver set is_read=1 " +
      		"WHERE message_id = ? and receiver_id = ?";
      var argus = [param.id, param.userId];
      console.log('check reading message : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, 'ok');
      });
    },
    /**
     * 메시지 생성 
     */
    createMessage : function(db, param, resolve, callback) {
      var query = "INSERT into messages " +
          "(subject, content, status, created, creator) " +
          "VALUES (?, ?, 'ACTIVE', now(), ?)";
      var argus = [param.subject, param.content, param.userId];
      console.log('create message ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        param.message_id = result.insertId;
        callback(null, result.insertId);
      });
    }, 
    /**
     * 메시지 수정
     */ 
    updateMessage : function(db, param, resolve, callback) {
      var query = "UPDATE messages " +
      		"SET subject=?, content=? " +
      		"WHERE id = ?";
      var argus = [param.subject, param.content, param.id]; 
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, 'ok');
      });
    },
    /**
     * 메시지 삭제 
     */ 
    deleteMessage : function(db, param, resolve, callback) {
      var query = "UPDATE messages set status = 'DELETE' WHERE id = ?";
      var argus = [param.id]; 
      db.query(query, argus, function(err, rows, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, 'ok');
      });
    },
  }
}
  
module.exports = MessageDao();