var Orchestrator = require('orchestrator');
var NodeGit = require("nodegit");
var path = require("path");
var fs = require("fs");
var os = require("os");
var async = require("async");
var walk = require("./walk");

module.exports = function(reponame, cb) {
  var orchestrator = new Orchestrator();
  orchestrator.on('task_start', function (e) {
    // e.message is the log message
    // e.task is the task name if the message applies to a task else `undefined`
    // e.err is the error if event is 'err' else `undefined`
    console.log(e);
  });
  // for task_end and task_err:
  orchestrator.on('task_stop', function (e) {
    // e is the same object from task_start
    // e.message is updated to show how the task ended
    // e.duration is the task run duration (in seconds)
  });
  var add = orchestrator.add.bind(orchestrator);
  var settings = {
    name : reponame,
    repoRoot: path.join(__dirname, "repos")
  };
  var startArgs = [];
  fs.readdir("./tasks", function (error, files) {
    console.log(files);
    async.each(files, function (file, cb) {
      require(path.join(__dirname,"tasks",file))(settings)(add, startArgs);
      cb();
    }, function (error) {
      startArgs.push(function (error) {
        console.log(error);
      });
      orchestrator.start.apply(orchestrator, startArgs);
    });
  });
  /*
  var dirname = reponame + ".git";
  var fulldirpath = path.join(__dirname, "repos", dirname);

  var npm = require("npm");
  var execFile = require('child_process').execFile;

  

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
              cb(error);
            } else {
              execFile(
                path.join(workingDirPath, "node_modules/gulp/bin/gulp.js"), [], {
                  "cwd" : workingDirPath
                }, function (error, stdout, stderr) {
                  console.log(stdout);
                  console.log(error);
                  cb(error);
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
        cb(reasonForFailure);
      });
    });
  });
*/
};
