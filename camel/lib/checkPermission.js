'use strict';
var checkPermission = function () {
    return {
      set : function(permission, param, req) {
        if (req.headers.host === '127.0.0.1:1337') {
          permission.isTest = true;
          permission.userId = 1;
          param.userId = 1;
        }
      }
    };
};

module.exports = checkPermission();