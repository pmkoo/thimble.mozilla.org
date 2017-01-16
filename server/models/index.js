var mongoose = require('mongoose');

var logger = require('../common/logger')

var db="mongodb://71an.com:2706/71an"
mongoose.connect(db, {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', db, err.message);
    process.exit(1);
  }
});

// models
require('./articles');


exports.Article         = mongoose.model('Article');
