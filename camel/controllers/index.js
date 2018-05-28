'use strict';

var Model = require('../models/index');

module.exports = function(router) {
  var model = new Model();
  router.get('/', function(req, res) {
    var role = req.cookies.role;
    console.log('role : ', role);
    model.role = role;
    res.render('index', model);
  });

};
