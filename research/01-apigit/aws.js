// Load the AWS SDK for Node.js
var uuid = require('node-uuid');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws.json');
/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

// Set your region for future requests.
//AWS.config.region = 'us-west-2';
console.log(AWS.config)
var name = uuid.v4();
// Create a bucket using bound parameters and put something in it.
// Make sure to change the bucket name from "myBucket" to something unique.
var s3bucket = new AWS.S3({ params: {Bucket: 'ph-'+name}});
s3bucket.createBucket(function(err, data) {
    if (err) {
      console.log("Error uploading data: ", err);
    } else {
      console.log("Successfully uploaded data to myBucket/myKey");
    }
  });