
var AWS = require('aws-sdk');
var config = require(__dirname + '/../phragm-admin.aws.json');
AWS.config.loadFromPath(__dirname + '/../phragm-admin.aws.json');


module.exports = function (settings) {
  var s3bucket = new AWS.S3({ params: {Bucket: settings.name + ".phragm.com"}});
  return function (add, args) {
    add('createbucket', function (cb) {
      s3bucket.createBucket(cb);
    });
  }
};
