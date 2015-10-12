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
      npm.load({
        "prefix": workingDirPath
      }, function (error) {
        if (error) {
          cb(error);
        } else {
          npm.registry.log.on("log", function (message) {  
          });
          npm.commands.install([workingDirPath], function (error, data) {
            cb(error);
          });
        }
      });
    });
  };
};