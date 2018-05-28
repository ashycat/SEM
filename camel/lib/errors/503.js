'use strict';


module.exports = function (template) {

  return function serverError(err, req, res, next) {
    var model = { url: req.url, err: err, statusCode: 503 };

    if (req.xhr) {
      res.status(503).send(model);
    } else {
      res.status(503);
      res.render(template, model);
    }
  };
    
};