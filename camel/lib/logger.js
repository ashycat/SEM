/**
 * logger
 */

'use strict';
var winston = require('winston');

module.exports = new (winston.Logger)({
  transports: [
               new (winston.transports.Console)({
                 level:'debug',
//                 levels : {
//                   silly: 0,
//                   debug: 1,
//                   verbose: 2,
//                   info: 3,
//                   warn: 4,
//                   error: 5
//                 },
                 colorize:true,
//                 json:true,
                 timestamp : function() {
                   return new Date();//.toLocaleString();
                 },
//                 prettyPrint : true,
                 formatter: function(options) {
                   return options.timestamp() + ' ' + 
                   options.level.toUpperCase() + ' ' + 
                   (undefined !== options.message ? options.message : '') +
                   (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                 }
               }),
               new (winston.transports.File)({
                 name : 'info-file',
                 filename: 'logs/log-info.log',
                 level: 'info'
               }),
               new (winston.transports.File)({
                 name : 'error-file',
                 filename: 'logs/log-error.log',
                 level: 'error'
               })
             ],
  exceptionHandlers: [
                      new winston.transports.File({ 
                        filename: 'logs/exceptions.log' 
                      })
                      ]
});