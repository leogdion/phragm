var NodeGit = require("nodegit");
var path = require("path");

module.exports = function (settings) {
  var dirname = settings.name + ".git";
  var fulldirpath = path.join(settings.repoRoot, dirname);
  return function (add, args) {
    add('clone', ['gitdir'], function (cb) {
      NodeGit.Clone("https://github.com/brightdigit/beginkit.git", fulldirpath, {
        bare: 1
      }).then(cb.bind(null, null)).catch(cb);
    });
  }
};