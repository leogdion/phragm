
var AWS = require('aws-sdk');
var config = require(__dirname + '/../phragm-admin.aws.json');
AWS.config.loadFromPath(__dirname + '/../phragm-admin.aws.json');


module.exports = function (settings) {
  var route53 = new AWS.Route53();
  var name = settings.name;
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
  return function (add, args) {
    add('bucketroute', ['bucketwebsite'], function (cb) {
      route53.changeResourceRecordSets(routeParams, function(err, data) {
          cb(err);
        });
    });
    args.push('bucketroute');
  }
};