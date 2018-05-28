var genericPool = require('generic-pool');
var mysql = require('mysql');

var pool = {
  set : function(config) {
    this.config = config;
  },
  get : function() {
    var _self = this;
    return genericPool.Pool({
      name: 'mysql',
      create: function(callback) {
        var client = mysql.createConnection(_self.config);
        client.connect(function (error){
          if(error){
            console.log(error);
          }
          callback(error, client);
        });
      },
      destroy: function(client) {
        client.end();
      },
      min: 1, //7,
      max: 2, //10,
      idleTimeoutMillis : 300000,
      log : false
    });
  }
};
 
process.on("exit", function() {
  pool.get().drain(function () {
    pool.get().destroyAllNow();
  });
});

module.exports = pool;
