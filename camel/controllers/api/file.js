'use strict';

var fs = require('fs');
var RestResponse = require('../../lib/RestResponse');
var errorCode = require('../../lib/errorCode');
var randomstring = require('randomstring');

module.exports = function (router) { 
  /**
   * @api {post} /file/upload 파일 업로드
   * @apiGroup file
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   * ]}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~~~"
   *  ]}
   * 
   */
  router.post('/upload', function(req, res) {
    var fileinfo = req.files;
    var uploadName = randomstring.generate(32);
    
    RestResponse.success(res, req.query.uuid, errorCode.OK, uploadName);
    
    fs.readFile(fileinfo.file.path, function(error,data){
      console.log('data',data);
      var destination = '/Users/junchunnim/camel_jun/public/files/'+ uploadName;
      fs.writeFile(destination, data, function(error){
        if(error) {
          console.log(error);
          throw error;
        }else {
          console.log('success');
        }
      });
    });
  });
}
  

