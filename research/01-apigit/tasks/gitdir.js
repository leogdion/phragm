var ensureExists = require('../ensureExists');
var path = require("path");
var fs = require("fs");

module.exports = function (settings) {
  return function (add) {
    add('gitdir', function (cb) {
      var dirname = settings.name + ".git";
      var fulldirpath = path.join(settings.repoRoot, dirname);
      ensureExists(settings.repoRoot, function () {
        fs.mkdir(fulldirpath, cb);
      });
    });
  }
};