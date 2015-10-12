
var AWS = require('aws-sdk');
var config = require(__dirname + '/../phragm-admin.aws.json');
AWS.config.loadFromPath(__dirname + '/../phragm-admin.aws.json');


module.exports = function (settings) {
  var s3bucket = new AWS.S3({ params: {Bucket: settings.name + ".phragm.com"}});
  var websiteParams = {
  Bucket: settings.name + ".phragm.com", /* required */
    WebsiteConfiguration: { /* required */
      ErrorDocument: {
        Key: 'error.html' /* required */
      },
      IndexDocument: {
        Suffix: 'index.html' /* required */
      }/*,
      
      RedirectAllRequestsTo: {
        HostName: 'STRING_VALUE', 
        Protocol: 'http | https'
      },
      RoutingRules: [
        {
          Redirect: { 
            HostName: 'STRING_VALUE',
            HttpRedirectCode: 'STRING_VALUE',
            Protocol: 'http | https',
            ReplaceKeyPrefixWith: 'STRING_VALUE',
            ReplaceKeyWith: 'STRING_VALUE'
          },
          Condition: {
            HttpErrorCodeReturnedEquals: 'STRING_VALUE',
            KeyPrefixEquals: 'STRING_VALUE'
          }
        },
      ]
      */
    },
    //ContentMD5: 'STRING_VALUE'
  };
  return function (add, args) {
    add('bucketwebsite', ['createbucket'], function (cb) {
      s3bucket.putBucketWebsite(websiteParams, cb);
    });
  }
};