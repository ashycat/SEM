'use strict';

var Model = require('../models/operator');

module.exports = function(router) {
  var model = new Model();
  router.get('/', function(req, res) {
    var role = req.cookies.role;
    if (!role) {
      res.redirect('/');
      return;
    }
    model.role = role;
    var roles = role.split(',');
    for (var i=0; i < roles.length; i++) {
      if (roles[i] == 'operator') {
        res.render('index', model);
        return;
      }
    }
    res.redirect('/');
    return;
  });
};

