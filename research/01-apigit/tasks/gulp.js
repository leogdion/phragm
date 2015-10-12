var NodeGit = require("nodegit");
var path = require("path");
var execFile = require('child_process').execFile;
var os = require('os');
var config = require(__dirname + '/../phragm-admin.aws.json');

module.exports = function (settings) {
  var dirname = settings.name + ".git";
  var fulldirpath = path.join(settings.repoRoot, dirname);
  var workingDirPath = path.join(os.tmpdir(), settings.name);
        
  return function (add, args) {
    add('gulp', ['npm', 'submodules', 'bucketpolicy'], function (cb) {
      var env = process.env;
      env.AWS_CREDENTIALS_KEY = config.accessKeyId;
      env.AWS_CREDENTIALS_SECRET = config.secretAccessKey;
      env.AWS_CREDENTIALS_BUCKET = settings.name + ".phragm.com";
      execFile(
        path.join(workingDirPath, "node_modules/gulp/bin/gulp.js"), ["publish"], {
        "cwd" : workingDirPath,
        "env" : env
      }, function (error, stdout, stderr) {
        console.log(stdout);
        console.log(error);
        cb(error);
      });
    });
    args.push('gulp');
  }
};

