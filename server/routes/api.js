'use strict';

var express = require('express'),
    router = express.Router();

let getPopular = require('./getPopular');

/* POST the n most popular names. */
router.post('/popular', function(req, res, next) {

  // if there are errors, send a BAD_REQUEST response
  var messages = getPopular.validate(req);
  if (messages.length > 0) {
    res.status(400);
    res.send({ "errors": messages });
  }
  // otherwise perform the query
  else {
    res.setHeader('Content-Type', 'application/json');
    res.send(getPopular.get(req));
  }
});

module.exports = router;
