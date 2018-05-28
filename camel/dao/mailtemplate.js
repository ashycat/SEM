'use strict';

var errorCode = require('../lib/errorCode');

var MailtemplateDao = function() {
  return {
    /**
     * 메일 템플릿 조회
     */  
    one : function(db, param, resolve, callback) {
      var query = "select * from mailtemplates where id = ?";
      
      var argus = [param.id]; 
      console.log('read messages : ', query, argus);
      db.query(query, argus, function(err, result){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 메일 템플릿 목록 조회
     */  
    list : function(db, param, resolve, callback) {
      var query = "select m.id,m.subject, m.content, m.created, m.modified," +
      		"(select user_name from users where id = m.creator) as creator," +
      		"(select user_name from users where id = m.modifier) as modifier " +
      		" from mailtemplates m limit ?, ?";
          
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
      var query = "SELECT count(*) size FROM mailtemplates ";
      console.log('count messages : ', query);
      db.query(query, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result[0]);
      });
    },
    listForReceiver : function(db, param, resolve, callback) {
      var query = "select rg.id, rg.name from mailtemplates t, mail_receiveGroup mr, role_group rg where rg.id = mr.role_group_id and t.id = mr.mailtemplate_id and t.id = ?";
      var argus = [param.template_id];
      console.log('count messages : ', query);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 메일템플릿 등록
     */
     create : function(db, param, resolve, callback) {
      var query = "INSERT INTO mailtemplates (subject, content, creator, created, modifier, modified)   VALUES (?, ?, ?, NOW(), ?, NOW())";
      var argus = [param.subject, param.content, param.id, param.id];
      console.log('count messages : ', query);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 메일템플릿 컨텐츠 수정
     */
    updateMailtemplate : function(db, param, resolve, callback) {
      var query = "UPDATE mailtemplates SET subject = ?, content = ?, modifier = ?, modified = now() where id = ?";
      var argus = [param.subject, param.content, param.userId, param.id];
      console.log('count messages : ', query);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 메일 수신자그룹 삭제
     */
    deleteReceiverGroup : function(db, param, resolve, callback) {
      var query = "DELETE FROM mail_receiveGroup where mailtemplate_id = ?";
      var argus = [param.template_id];
      console.log('count messages : ', query);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 메일 수신자그룹 등록
     */
    createReceiverGroup : function(db, param, resolve, callback) {
      var query = "INSERT INTO mail_receiveGroup(mailtemplate_id, role_group_id) VALUES (?,?)";
      for (var i =0 ; i < param.receiverGroup.length; i++) {
        (function(index){
          var argus = [param.template_id, param.receiverGroup[index]];
          db.query(query, argus, function(err, result) {
            if (err) {
              return callback(errorCode.DB_QUERY, 'Query : ' + err);
            }
              callback(null, result);
          });
        })(i)
      }
    },
  }
}
  
module.exports = MailtemplateDao();