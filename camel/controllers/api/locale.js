'use strict';

module.exports = function(router) {
  router.put('/:locale', function (req, res) {
    res.cookie('locale', req.params.locale);
    res.redirect('/');
  });
};
