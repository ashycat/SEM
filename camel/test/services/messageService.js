
var should = require('should');
var proxyquire = require('proxyquire');

describe('messageService', function(){
  it ('should message list', function(){
    var messageStubList = [{
      id: 41,
      subject: "aaa",
      content: "aaaa",
      created: "2015-07-12T14:06:29.000Z",
      user_id: "user",
      user_name: "tester",
      role: "user"
    }, {
      id: 39,
      subject: "하하하",
      content: "하하하",
      created: "2015-07-05T05:28:28.000Z",
      user_id: "user",
      user_name: "tester",
      role: "user"
    }];
    var messageStubCount = {size:25};
    
    var messageStub = {};
    var messageService = proxyquire('../../services/messageService', {
      '../dao/message': messageStub
    });
    messageStub.list = function(db, param, resolve, callback) {
      callback(null, messageStubList);
    };
    messageStub.listCount = function(db, param, resolve, callback) {
      callback(null, messageStubCount);
    };
    
    messageService.list({limit:10, page:1}, function(data, info){
      should.equal(data, messageStubList);
      should.equal(info, messageStubCount);
    });
  });
});