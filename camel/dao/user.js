'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');
var logger = require('../lib/logger');
var randomstring = require("randomstring");

var UserDao = function() {
  return {
    /**
     * 사용자 목록
     */ 
    list : function(db, param, resolve, callback) {
      var queryString = "SELECT * FROM users where status='ACTIVE' limit ?, ?";
      db.query(queryString, 
          [param.page*param.limit, param.limit], function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    listCount : function(db, param, resolve, callback) {
      var queryString = "SELECT count(*) size FROM users WHERE status='ACTIVE'";
      db.query(queryString, function(err, row, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    }, 
   
    
    /**
     * 주선소 등록 가능한 멤버 목록(어디에도 등록되지 않은 멤버)
     *  - 타주선소 등록 멤버 제외(brokers_members.user_id)
     *  - 차주는 제외(trucks.owner_id)
     */
    listByUnassignBroker : function(db, param, resolve, callback) {
      var query = " select * from users " +
        " where user_id not in ( select distinct user_id from brokers_members ) " +
        " and user_id not in ( select distinct owner_id from trucks ) limit ?, ? ";
      var argus = [param.page*param.limit, param.limit]; 
      console.log('dao listByUnassignMember : ', query, argus);
      db.query(query, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 사용자 role 목록
     */ 
    roles : function(param, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        var queryString = "SELECT r.id, r.name " +
            "FROM role_group_member rgm, role_group rg, group_role gr, roles r " +
            "WHERE rgm.user_id = ? and rgm.role_group_id = rg.id " +
            "and rg.id = gr.group_id and gr.role_id = r.id";
        db.query(queryString, 
            [param.id], 
            function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "QUERY ERROR: " + err);
            return;
          }
          success(rows);
          pool.release(db);
        });
      });
    },
    /**
     * 사용자 등록
     */ 
    create : function(db, param, resolve, callback) {

      var queryString = 
          "INSERT INTO users ( " +
          "user_id, user_name, password, status, phone, email, action_key ) " +
          "VALUES (?, ?, ?, 'READY',? ,?, ?)";
      var argus = [
                   param.user_id, param.user_name, param.password,  
                   param.phone, param.email, param.action_key
                   ];
      console.log('dao create : ', queryString, argus);
      db.query(queryString, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);      
      });
    },
    /**
     * 차주 등록
     */ 
    createTruckUser : function(db, param, resolve, callback) {
      logger.debug('dao param : ', param);
      logger.debug('dao resolve : ', resolve);
      
      // user_id : broker_id + sequence( 0 left padding, length 5)
      // password : same user_id
      if( param.sizeTruckUsers == '0' ) {
        param.user_id = param.broker_id + '00000';
      }else{
        var sz = param.sizeTruckUsers + '';
        param.user_id = param.broker_id + (sz.length >= 5 ? sz : new Array(5 - sz.length + 1).join('0') + sz);
      }
      param.password = param.user_id;
      
      var queryString = 
          "INSERT INTO users ( " +
          "user_id, user_name, password, status, phone, email, action_key ) " +
          "VALUES (?, ?, ?, 'READY',? ,?, ?)";
      var argus = [
                   param.user_id, param.user_name, param.password,  
                   param.phone, param.email, param.action_key
                   ];
      logger.debug('dao create : ', queryString, argus);
      db.query(queryString, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);      
      });
    },
    
    /**
     * 사용자 api key 등록
     * 사용자 등록 후에 호출 되어야 한다.
     * param.id에 유저의 id가 있어야 한다.
     * 
     */ 
    createApikey : function(db, param, resolve, callback) {
      var apiKey = randomstring.generate(16);
      var secretKey = randomstring.generate(32);
      var queryString = "INSERT INTO users_apikey (user_id, api_key, secret_key) VALUES (?, ?, ?)"; 
      var argus = [
                   resolve.insertId, 
                   apiKey, secretKey
                   ];
      db.query(queryString, argus, function(err, result, fields) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'QUERY ERROR: ' + err);
        }
        result.id=resolve.insertId;
        callback(null, result);
      });
    },
    /**
     * 개별 사용자 조회 
     */ 
    one : function(db, param, resolve, callback) {
      var argus = [param.id];  
      var queryString = "SELECT * FROM users WHERE id = ?";
      db.query(queryString, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'QUERY ERROR: ' + err);
        }
        // users.id is import
        result.insertId = resolve.insertId;
        callback(null, result);
      });
    },
    /**
     * 사용자 STATUS 수정 
     */ 
    updateStatus : function(db, param, resolve, callback) {
      var query = "UPDATE users SET status = ? where id = ?";
      var argus = [param.status, param.id];
      console.log('dao updateStatus : ', query, argus);
      db.query(query, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'QUERY ERROR: ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * ACTION_KEY
     * 삭제 
     */ 
    deleteActionKey : function(db, param, resolve, callback) {
      var argus = [param.status];
      console.log('param', param);
      var queryString = "UPDATE users SET action_key = NULL where id = ?";
      db.query(queryString, [param.id], function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'QUERY ERROR: ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 사용자 id 체크
     */
    checkUserId : function(db, param, resolve, callback) {
      var argus = [param.userId];  
      var queryString = "select user_id from users where user_id=?";
      db.query(queryString, argus, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'QUERY ERROR: ' + err);
        }
        callback(null, result);
      });
    },
    
    /**
     * 사용자 수정
     */ 
    update : function(db, param, resolve, callback) {
      logger.debug("dao param:", param);
      
      var query = "UPDATE users SET ";
      var setCol = [];
      var argus = [];
      if (param.user_name) {
        setCol.push(" user_name = ? ");
        argus.push(param.user_name);
      }
      if (param.phone) {
        setCol.push(" phone = ? ");
        argus.push(param.phone);
      }
      if (param.model) {
        setCol.push(" email = ? ");
        argus.push(param.email);
      }
      if (param.status) {
        setCol.push(" status = ? ");
        argus.push(param.status);
      }
      if (setCol.length > 0) {
        query = query + setCol.join(" , ") + " WHERE id = ?";
        argus.push(param.user_id);
      }
      logger.debug("dao update:", query, argus);
      db.query(query, argus, function(err, result, fiels){
        if (err) {
          return callback(errorCode.DB_QUERY, 'Query : ' + err);
        }
        callback(null, result);  
      });
    },
    /**
     * 사용자 삭제 (delete 상태로 변경)
     */
    delete : function(db, param, resolve, callback) {
      logger.debug("dao param:", param);
      
      var query = "UPDATE users SET status='DELETE' WHERE id = ?";
      var argus = [param.id]
      logger.debug("dao update:", query, argus);
      db.query(query, argus, function(err, result, fields) {
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
      pool.acquire(function(err, db) {
        if (err) {
          fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
          return;
        }
        
        var queryString = "SELECT * FROM users ";
        var where = [];
        var argument = [];
        if (param.username) {
          where.push(" user_name like ? ");
          argument.push('%' + param.username + '%');
        }
        if (param.userId) {
          where.push(" user_id like ? ");
          argument.push('%' + param.userId + '%');
        }
        if (where.length > 0) {
          queryString = queryString + " where " + where.join(" and ");
        }
        db.query(queryString, 
            argument, 
            function(err, rows, fields) {
          if (err) {
            fail(errorCode.DB_QUERY, "QUERY ERROR: " + err);
            return;
          }
          success(rows);
          pool.release(db);
        });
      });
    },
    /**
     * 핸드폰 번호로 유저 검색  
     */
    findByPhone : function(db, param, resolve, callback) {
      var queryString = "SELECT * FROM users where phone = ?";
      var argu = [param.phone];
      console.log('param', param.phone);
      db.query(queryString, argu, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'QUERY ERROR: ' + err);
        }
        callback(null, result);
      });
    },
    /**
     * 비밀번호 수정  
     */
    updatePassword : function(db, param, resolve, callback) {
      var queryString = "UPDATE users SET password = ? where id = ?";
      var argu = [param.password, param.id];
      console.log('param', param);
      db.query(queryString, argu, function(err, result) {
        if (err) {
          return callback(errorCode.DB_QUERY, 'QUERY ERROR: ' + err);
        }
        callback(null, result);
      });
    },
  }
}
  
module.exports = UserDao();