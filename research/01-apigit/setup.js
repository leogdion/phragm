var NodeGit = require("nodegit");
var uuid = require('node-uuid');
var path = require("path");
var fs = require("fs");
var os = require("os");
var async = require("async");

var reponame = uuid.v4();
var dirname = reponame + ".git";
var fulldirpath = path.join(__dirname, "repos", dirname);

var npm = require("npm");
var execFile = require('child_process').execFile;

function walk(currentDirPath, callback) {
  var fs = require('fs'),
      path = require('path');
  fs.readdirSync(currentDirPath).forEach(function (name) {
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
  fs.mkdir(path, mask, function (err) {
    if (err) {
      if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
      else cb(err); // something else went wrong
    } else cb(null); // successfully created folder
  });
}

function updateSubmodules(localPath, repository, cb) {
  console.log("updating submodules...");
  Ini = require('ini');
  var config = Ini.parse(fs.readFileSync(path.normalize(localPath + '/.gitmodules'), 'utf-8'));
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

}

function npmInstall(localPath, repository, cb) {
  console.log("loading npm...");
  npm.load({
    "prefix": localPath
  }, function (error) {
    console.log("installing node dependencies...");
    if (error) {
      cb(error);
    } else {
      npm.commands.install([localPath], function (error, data) {
        cb(error);
      });
    }
  });
  console.log("test");
}

ensureExists(path.join(__dirname, "repos"), function () {
  fs.mkdir(fulldirpath, function (error) {
    console.log("created directory for new repo...");
    NodeGit.Clone("https://github.com/brightdigit/beginkit.git", fulldirpath, {
      bare: 1
    }).then(function (repo) {
      console.log("created new repo...");
      var workingDirPath = path.join(os.tmpdir(), reponame);
      NodeGit.Clone(fulldirpath, workingDirPath).then(function (repo) {
        console.log("cloned repo...");

        async.applyEach([updateSubmodules, npmInstall], workingDirPath, repo, function (error) {
          if (error) {
            console.log(error);
          } else {
            execFile(
              path.join(workingDirPath, "node_modules/gulp/bin/gulp.js"), [], {
                "cwd" : workingDirPath
              }, function (error, stdout, stderr) {
                console.log(stdout);
                console.log(error);
              });

            //var gulp = require('./beginkit/gulpfile.js');
            //process.chdir('./beginkit/');
            //gulp.start(["default"]);
          }
        });

      });
      // In this function we have a repo object that we can perform git operations
      // on.
      // Note that with a new repository many functions will fail until there is
      // an initial commit.
    }).
    catch (function (reasonForFailure) {
      console.log(reasonForFailure);
    });
  });
});