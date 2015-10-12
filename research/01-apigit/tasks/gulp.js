var NodeGit = require("nodegit");
var path = require("path");
var execFile = require('child_process').execFile;
var os = require('os');

module.exports = function (settings) {
  var dirname = settings.name + ".git";
  var fulldirpath = path.join(settings.repoRoot, dirname);
  var workingDirPath = path.join(os.tmpdir(), settings.name);
        
  return function (add, args) {
    add('gulp', ['npm', 'submodules'], function (cb) {
      execFile(
        path.join(workingDirPath, "node_modules/gulp/bin/gulp.js"), [], {
        "cwd" : workingDirPath
      }, function (error, stdout, stderr) {
        console.log(stdout);
        console.log(error);
        cb(error);
      });
    });
    args.push('gulp');
  }
};

