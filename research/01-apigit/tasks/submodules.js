var NodeGit = require("nodegit");
var path = require("path");
var async = require("async");
var os = require('os');
var fs =require('fs');

module.exports = function (settings) {
  var dirname = settings.name + ".git";
  var fulldirpath = path.join(settings.repoRoot, dirname);
  var workingDirPath = path.join(os.tmpdir(), settings.name);
  
  return function (add, args) {
    add('submodules', ['gitwork'], function (cb) {
      console.log("updating submodules...");console.log(settings);
  var repository =settings.repo;
      Ini = require('ini');
      var config = Ini.parse(fs.readFileSync(path.normalize(workingDirPath + '/.gitmodules'), 'utf-8'));
      //if startswith submodule, push into modules
      var modules = [];
      for (var i in config) {
        if (i.indexOf('submodule') === 0) {
          modules.push(config[i]);
        }
      }
      async.each(modules, function (module, cb) {
        var modulePath = module.path;
        console.log("setting up submodule \"" + modulePath + "\"...");
        console.log(repository);
        NodeGit.Submodule.lookup(repository, modulePath).
        catch (function (error) {
          console.log(error);
        }).then(function (submodule) {
          // Use submodule
          try {
            console.log("init submodule \"" + modulePath + "\"...");
            submodule.init(1);
          } catch (e) {
            cb(e)
          }
          try {
            console.log("update submodule \"" + modulePath + "\"...");
            submodule.update(1, new NodeGit.CheckoutOptions);
          } catch (e) {
            cb(e);
          }
          console.log("completed setup for submodule \"" + modulePath + "\"...");
          cb();
        });
      }, function (error) {
        console.log("completed setup for submodules");
        cb(error);
      });
    });
  }
};