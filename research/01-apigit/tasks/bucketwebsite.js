
var AWS = require('aws-sdk');
var config = require('./phragm-admin.aws.json');
AWS.config.loadFromPath('./phragm-admin.aws.json');


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
    add('bucketwebsite', ['createbucket'] function (cb) {
      s3bucket.putBucketWebsite(websiteParams, cb);
    });
  }
};

/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

// Set your region for future requests.
//AWS.config.region = 'us-west-2';

var name = uuid.v4();

var routeParams = {
  ChangeBatch: { /* required */
    Changes: [ /* required */
      {
        Action: 'CREATE', /* required */
        ResourceRecordSet: { /* required */
          Name: name + '.phragm.com.', /* required */
          Type: 'A', /* required */
          AliasTarget: {
            DNSName: "s3-website-us-east-1.amazonaws.com", /* required */
            EvaluateTargetHealth: false, /* required */
            //HostedZoneId: 'Z3BJ6K6RIION7M' /* required */
            HostedZoneId: 'Z3AQBSTGFYJSTF' /* required */
          },
          //Failover: 'PRIMARY | SECONDARY',
          /*
          GeoLocation: {
            ContinentCode: 'STRING_VALUE',
            CountryCode: 'STRING_VALUE',
            SubdivisionCode: 'STRING_VALUE'
          },
          HealthCheckId: 'STRING_VALUE',
          Region: 'us-east-1 | us-west-1 | us-west-2 | eu-west-1 | eu-central-1 | ap-southeast-1 | ap-southeast-2 | ap-northeast-1 | sa-east-1 | cn-north-1',
          ResourceRecords: [
            {
              Value: 'STRING_VALUE' 
            },
          ],
          SetIdentifier: 'STRING_VALUE',
          TTL: 0,
          Weight: 0
          */
        }
      },
      /* more items */
    ],
    //Comment: 'STRING_VALUE'
  },
  HostedZoneId: config.hostedZoneId /* required */
  //HostedZoneId: 'Z3BJ6K6RIION7M' /* required */
};

var websiteParams = {
  Bucket: name + ".phragm.com", /* required */
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
}

var policyParams = {
  Bucket: name + '.phragm.com', /* required */
  Policy: JSON.stringify(policy)
};

// Create a bucket using bound parameters and put something in it.
// Make sure to change the bucket name from "myBucket" to something unique.
var s3bucket = new AWS.S3({ params: {Bucket: name + ".phragm.com"}});
var route53 = new AWS.Route53();
s3bucket.createBucket(function(err, data) {
    if (err) {
      console.log("Error uploading data: ", err);
    } else {
      console.log("Successfully uploaded data to myBucket/myKey");
    }
    s3bucket.putBucketWebsite(websiteParams, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      s3bucket.putBucketPolicy(policyParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        route53.changeResourceRecordSets(routeParams, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
          console.log(name);
        });
      });
    });
  });

var route53 = new AWS.Route53();