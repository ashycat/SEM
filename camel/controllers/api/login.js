'use strict';

var passport = require('passport');
var userDao = require('../../dao/user');
var truckDao = require('../../dao/truck');
var brokerDao = require('../../dao/broker')
var logger = require('../../lib/logger');

module.exports = function(router) {

  /**
   * @api {post} /login 로그인 
   * @apiName login
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":"ok"}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * 
   */  
  router.post('/', function(req, res) {
    passport.authenticate('local', {
      successRedirect : req.session.goingTo || 'login/success',
      failureRedirect : '/#!/common/login',
      failureFlash : true
    })(req, res);
  });
  
  /**
   * 로그인 성공 처리 
   */
  router.get('/success', function(req, res) {
    console.log('/success', req.user);
    
    var setCookie = function(roles, trucks, brokers) {
      try {
        console.log('set roles in cookies ', roles);
        // set cookie
        res.cookie('apiKey', req.user.api_key);
        res.cookie('secretKey', req.user.secret_key);
        res.cookie('id', req.user.id);
        res.cookie('userId', req.user.user_id);
        res.cookie('userName', req.user.user_name);
        res.cookie('role', roles.join(','));
        if (trucks.length > 0) {
          res.cookie('trucks', JSON.stringify(trucks));
        }
        if (brokers.length > 0) {
          res.cookie('brokerId', brokers[0]);
        }
        // set client-session
        req.session.id = req.user.id;
        req.session.apiKey = req.user.api_key;
        req.session.secretKey = req.user.secret_key;
      } catch (e) {
        console.log('set cookies or session exception : ', e);
      }
      res.redirect('/#/dashboard');
    }
    
    var param = {
        id : req.user.id
    };
    userDao.roles(param, function(data) {
      truckDao.listByUserId({userId:req.user.id}, function(truckData) {
        console.log('truckData : ',truckData);
        var roles = ['user'];
        var trucks = [];
        var brokers = [];
        data.forEach(function(item){
          roles.push(item.name);
        });
        if (truckData && truckData.length > 0) {
          roles.push('truck_user');
          truckData.forEach(function(item) {
            trucks.push({
              id:item.id, 
              brokerId : item.broker_id,
              weight : item.weight
              });
          })
          setCookie(roles, trucks, brokers);
        } else {
          console.log('broker info check');
          brokerDao.getBrokerMember({userId:req.user.id}, function(brokerMemberData) {
            console.log('broker info ', brokerMemberData); 
            roles.push('broker_' + brokerMemberData.role.toLowerCase());
            brokers.push(brokerMemberData.broker_id);
            setCookie(roles, trucks, brokers);
          });
        }
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });

  });
};
