'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var RestResponse = require('../lib/RestResponse');
var errorCode = require('../lib/errorCode');

var nodeMailer = function() {

  var transporter = nodemailer.createTransport(smtpTransport({
    host : 'smtp.gmail.com',
    port : 465,
    service: 'Gmail',
    auth: {
      user: 'suchang.jeong@gmail.com',
      pass: 'camel1q2w3e'
    }
  }));

  return {
    sendMail : function(mailOptions ,res, req){
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          return RestResponse.failure(res, req.query.uuid);
        }
        console.log('Message sent: ' + info.response);
      });
    }
  }
}

module.exports = nodeMailer();