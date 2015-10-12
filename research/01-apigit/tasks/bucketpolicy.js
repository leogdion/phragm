var AWS = require('aws-sdk');
var config = require(__dirname + '/../phragm-admin.aws.json');
AWS.config.loadFromPath(__dirname + '/../phragm-admin.aws.json');


module.exports = function (settings) {
  var s3bucket = new AWS.S3({ params: {Bucket: settings.name + ".phragm.com"}});
  var name = settings.name;
  var policy = {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "AddPerm",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::" + name + '.phragm.com' + "/*"
      },
      {
        "Sid": "Stmt1418941948622",
        "Effect": "Allow",
        "Principal": {
          "AWS": config.iamPrincipal
        },
        "Action": "s3:*",
        "Resource": [
          "arn:aws:s3:::" + name + '.phragm.com' + "/*",
          "arn:aws:s3:::" + name + '.phragm.com'
        ]
      }
    ]
  };
  var policyParams = {
    Bucket: name + '.phragm.com', /* required */
    Policy: JSON.stringify(policy)
  };
  return function (add, args) {
    add('bucketpolicy', ['createbucket'], function (cb) {
      s3bucket.putBucketPolicy(policyParams, cb);
    });
    args.push('bucketpolicy');
  }
};