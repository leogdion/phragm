var lodash = require('lodash');
var db = require('./sequelize');
var async = require('async');
var crypto =require('crypto');
module.exports = function (app) {
  var listen = app.listen;

  var server = lodash.extend(app, {
    listen: function () {
      var args = Array.prototype.slice.call(arguments, 0);
      db.sequelize.sync({
        force: true
      }).complete(

      function (err) {
        if (err) {
          console.log(err);
          throw err[0];
        } else {
          var User = db.user,
    App = db.app,
    Device = db.device,
    Session = db.session,
    UserAgent = db.userAgent,
    Sequelize = db.Sequelize;/*
        passport.use(new LocalStrategy({
    usernameField: 'name', passReqToCallback: true}, function (req, user, password, done) {
          
        }));
        passport.serializeUser(function (user, done) {
          console.log(user);
          done(null, user.sessionKey);
        });
        passport.deserializeUser(function (id, done) {
          console.log('session Id');
          console.log(id);
          Session.find({where : {sessionKey : id}}).then(function (session) {
            done(null, session);
          });
        }); 
*/
          var pw = crypto.randomBytes(8).toString('base64');
          console.log(pw);
            db.app.createByName('default', 'yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/').then(

            function (hostApp) {
              var regPermission = db.permission.build({name : 'registration'});
              db.user.newLogin({name: "leogdion-test", password: "testtest", email: "leo.dion+test@gmail.com"});
              regPermission.save().then ( function (regPermission) {
                regPermission.addApp(hostApp).then( function () {
                listen.apply(app, args);

                });
              });
            });
          }
          //);

        //}
      });
    }
  });

  return server;
};