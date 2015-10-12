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
        NodeGit.Submodule.lookup(repository, modulePath).
        catch (function (error) {
        }).then(function (submodule) {
          // Use submodule
          try {
            submodule.init(1);
          } catch (e) {
            cb(e)
          }
          try {
            submodule.update(1, new NodeGit.CheckoutOptions);
          } catch (e) {
            cb(e);
          }
          cb();
        });
      }, function (error) {
        cb(error);
      });
    });
  }
};