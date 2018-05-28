'use strict';

var pool = require('../lib/generic-pool').get();
var errorCode = require('../lib/errorCode');
var async = require('async');
var check = require('check-types');
//https://github.com/caolan/async#apply 참고

var Transaction = function() {
  var injectParameter = function(controls, db, isResolve) {
    var ctrls = [];
    for (var i=0; i < controls.length; i++) {
      // read parallel, read series의 경우 또는 첫번째 control은 resolve 값을 넣는다.  
      if (isResolve || i == 0) {  
        ctrls.push(async.apply(controls[i].fn, db, controls[i].param, {})); 
      } else {
        ctrls.push(async.apply(controls[i].fn, db, controls[i].param)); 
      }
    }
    return ctrls; 
  }
  
  return {
    // controls의 순서대로 동작하며 맨마지막 control의 결과가 callback 함수에 결과로 전달된다. 
    Wpipe : function(controls, callback, success, fail) {
      pool.acquire(function(err, db){
        if (err) {
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        db.beginTransaction(function(err) {
          async.waterfall(
              injectParameter(controls, db), 
              async.apply(callback, db, success, fail)
          );
        });
      });      
    },
    // controls의 순서대로 동작하며 각 control의 결과가 callback의 results에 배열형태로 들어간다.   
    Wseries : function(controls, callback, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        db.beginTransaction(function(err) {
          async.series(
              injectParameter(controls, db), 
              async.apply(callback, db, success, fail)
          );
        });
      });
    },
    // 각 controls의 결과가 callback의 results에 배열형태로 들어간다.   
    Wparallel : function(controls, callback, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        db.beginTransaction(function(err) {
          async.parallel(
              injectParameter(controls, db), 
              async.apply(callback, db, success, fail)
          );
        });
      });
    },
    // watferfall, series, parallel의 결과를 받아서 처리하는 callback 
    // 이 callback은 일반적인 형태이고 각 api별로 다른 처리가 필요하면 개별 구현하여 이것을 대체한다.  
    Wcallback : function(db, success, fail, errCode, result) {
      if (errCode) {
        db.rollback(function() { 
          pool.release(db);
        });
        return fail(errCode, result);
      }
      console.log('transaction result ', result);
      db.commit(function(err) {
        if (err) {
          db.rollback(function() {
            pool.release(db);
          });
          return fail(errorCode.DB_COMMIT, err);
        }
        if (check.array(result)) {
          success.apply(this, result);
        } else {
          success.apply(this, [result]);
        }
        pool.release(db);
      });
    },
    Rpipe : function(controls, callback, success, fail) {
      pool.acquire(function(err, db){
        if (err) {
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        async.waterfall(
            injectParameter(controls, db), 
            async.apply(callback, db, success, fail)
        );
      });      
    },
    // controls의 순서대로 동작하며 각 control의 결과가 callback의 results에 배열형태로 들어간다.   
    Rseries : function(controls, callback, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        async.series(
            injectParameter(controls, db, true), 
            async.apply(callback, db, success, fail)
        );
      });
    },
    // 각 controls의 결과가 callback의 results에 배열형태로 들어간다.   
    Rparallel : function(controls, callback, success, fail) {
      pool.acquire(function(err, db) {
        if (err) {
          return fail(errorCode.DB_CONNECTION, "CONNECTION error: " + err);
        }
        async.parallel(
            injectParameter(controls, db, true), 
            async.apply(callback, db, success, fail)
        );
      });
    },
    // waterfall, series, parallel의 결과를 받아서 처리하는 callback
    // 결과를 가공해야 하는 경우에는 별도의 callback을 각 service에서 만들어서 주입한다. 
    Rcallback : function(db, success, fail, errCode, result) {
      if (errCode) {
        pool.release(db);
        return fail(errCode, result);
      }
      if (check.array(result)) {
        success.apply(this, result);
      } else {
        success.apply(this, [result]);
      }
      pool.release(db);
    },
    // 결과가 Not null : null이면 fail
    RcallbackNN : function(db, success, fail, errCode, result) {
      if (errCode) {
        pool.release(db);
        return fail(errCode, result);
      }
      if (check.undefined(result)) {
        return fail(errorCode.NOT_FOUND_RESOURCE, "not found resource");
      }
      if (check.array(result)) {
        success.apply(this, result);
      } else {
        success.apply(this, [result]);
      }
      pool.release(db);
    },
  }
}
  
module.exports = Transaction();