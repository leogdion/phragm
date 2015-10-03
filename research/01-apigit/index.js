var NodeGit = require("nodegit");
var uuid = require('node-uuid');
var path = require("path");
var fs = require("fs");
var os = require("os");

var reponame = uuid.v4();
var dirname = reponame + ".git";
var fulldirpath = path.join(__dirname, "repos", dirname);
function walk(currentDirPath, callback) {
    var fs = require('fs'), path = require('path');
    fs.readdirSync(currentDirPath).forEach(function(name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walk(filePath, callback);
        }
    });
}

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

ensureExists(path.join(__dirname, "repos"), function () {
  fs.mkdir(fulldirpath, function (error) {
    NodeGit.Clone("https://github.com/brightdigit/beginkit.git", fulldirpath, {bare: 1}).then(function (repo) {
      var workingDirPath = path.join(os.tmpdir(), reponame);
      NodeGit.Clone(fulldirpath, workingDirPath).then(function (repo) {
        /*
        Ini = require('ini');
var config = Ini.parse(fs.readFileSync(path.normalize( localPath + '/.gitmodules'), 'utf-8'));
//if startswith submodule, push into modules
modules = [];
for (var i in config) {
    if (i.indexOf('submodule') === 0){
        modules.push(config[i]);
    }
}
for (var i in modules) {
    var modulePath = modules[i].path;
    Git.Submodule.lookup(repository, modulePath).then(function(submodule) {
        // Use submodule
        log.success("got submodule '" + submodule.path() + "'");
        try{
            submodule.init(1);
            log.success("submodule init worked");
        }catch(e){
            log.error("submodule init failed "+ e);
        }
        try{
            submodule.update(1,new Git.CheckoutOptions);
            log.success("submodule update worked");
        }catch(e){
            log.error("submodule update failed "+ e);
        }
    },function(err){
        log.error('cant get submodule : '+err)
    });
}
*/
        /*
        npm.load({"prefix" : "./beginkit"}, function (error) {
  if (error) {
    console.log(error);
    return;
  } 
  npm.commands.install(['./beginkit'], function(error, data) {
    console.log(error);
    console.log(data);

  });
});
*/
      });
      // In this function we have a repo object that we can perform git operations
      // on.

      // Note that with a new repository many functions will fail until there is
      // an initial commit.

    }).catch(function (reasonForFailure) {
      console.log(reasonForFailure);
    });
  });
});