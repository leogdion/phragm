var NodeGit = require("nodegit");
var path = require("path");
var os = require('os');

module.exports = function (settings) {
  var dirname = settings.name + ".git";
  var fulldirpath = path.join(settings.repoRoot, dirname);
  var workingDirPath = path.join(os.tmpdir(), settings.name);
        
  return function (add, args) {
    add('gitwork', ['clone'], function (cb) {
      NodeGit.Clone(fulldirpath, workingDirPath).then(function (repo) {
        settings.repo = repo;
        cb();
      }).catch(cb);
    });
  }
};