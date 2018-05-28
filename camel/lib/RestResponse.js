'use strict';

var RestResponse = function() {
  return {
    success : function(res, uuid, code, content, info) {
      var responseObject = {}
      responseObject.uuid = uuid;
      responseObject.code = code;
      if (content) {
        responseObject.contents = content;
      }
      if (info) {
        responseObject.info = info;
      }
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      return res.send(JSON.stringify(responseObject));
    },
    failure : function(res, uuid, code, content) {
      var responseObject = {}
      responseObject.uuid = uuid;
      responseObject.code = code;
      if (content) {
        responseObject.message = content;
      }
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      return res.end(JSON.stringify(responseObject));
    }
  }
};

module.exports = RestResponse();