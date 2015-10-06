var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  logging: null
});
var setup = require('./setup');
var async = require('async');
var uuid = require('node-uuid');

var Site = sequelize.define('Site', {
  siteId: {type : Sequelize.UUID, unique: true, allowNull: false, defaultValue: Sequelize.UUIDV4}
});

var Status = sequelize.define('SiteStatus', {
  name: {type: Sequelize.STRING, unique: true}
});

Site.belongsTo(Status);

app.get('/', function (req, res) {
  Status.findOne({where: {
              'name' : "queued"
    }}).then( function (status) {
    var site  = Site.create({
    }).then(function (site) {
    site.setSiteStatus(status).then(function (site) {
      res.send(site);
    });
    });
    
  });
});

sequelize.sync({force: true}).then(function () {
  Status.bulkCreate([
    { name : "queued"},
    { name : "building"},
    { name : "ready"},
    { name : "error"}
  ]).then(function () {

    var server = app.listen(3000, function () {
      var host = server.address().address;
      var port = server.address().port;

      console.log('Example app listening at http://%s:%s', host, port);
    });

    var CronJob = require('cron').CronJob;
    var job = new CronJob({
      cronTime: '*/5 * * * * *',
      onTick: function() {
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
         Site.findAll({
          include: [{
            model: Status,
            where: {
              'name' : "queued"
            }
          }]
         }).then(function (sites) {
          Status.findOne({where: {
              'name' : "building"
            }}).then( function (status) {
              async.each(sites, function (site, cb) {
            
              site.setSiteStatus(status).then( function () {
                setup(site.siteId, cb);
              });
              
            });
          }, function (error) {
            console.log(error);
            if (error) {
              process.exit(1);
            }
          });
         });
      },
      start: false
    });
    job.start();
  });
});

