var NodeGit = require("nodegit");
var path = require("path");
var async = require("async");
var os = require('os');
var npm = require("npm");

module.exports = function (settings) {
  var dirname = settings.name + ".git";
  var fulldirpath = path.join(settings.repoRoot, dirname);
  var workingDirPath = path.join(os.tmpdir(), settings.name);
        
  return function (add, args) {
    add('npm', ['gitwork'], function (cb) {
      console.log("loading npm...");
      npm.load({
        "prefix": workingDirPath
      }, function (error) {
        console.log("installing node dependencies...");
        if (error) {
          cb(error);
        } else {
          npm.commands.install([workingDirPath], function (error, data) {
            cb(error);
          });
        }
      });
    });
  };
};