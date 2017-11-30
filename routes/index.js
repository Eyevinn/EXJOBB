var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html', { title: 'Express' });
});

module.exports = router;