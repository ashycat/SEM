'use strict';

var kraken = require('kraken-js');
var app = require('express')();
var options = require('./lib/configure')(app);
var port = process.env.PORT || 8000;
var cluster = require('cluster');
var session = require('client-sessions');
var https = require('https');
var ssl;

var numCPUs = require('os').cpus().length;
    numCPUs = 4;

if (cluster.isMaster) {
  console.log('cpu : ', numCPUs);
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker %d died (%s). restarting...', 
        worker.process.pid, signal || code);
    cluster.fork();
  });
} else {
  app.use(kraken(options));
  app.use(session({
    cookieName: 'session',
    secret: 'dkfaldfi12kj09iualjf0ad9dkfds912',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));
  
  app.on('start', function() {
    if (app.kraken.get('tls').cert && app.kraken.get('tls').key) {
      ssl = https.createServer(app.kraken.get('tls'), app);
      ssl.listen(8443, function(){ // 정식 서비스 때 443으로 변경한다. (mac에서는 443을 사용하려면 sudo로 구동 필요)
        console.log('Listening on http://localhost:%d', 8443);
      });        
    }
  });

  app.listen(port, function(err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
  });
}

