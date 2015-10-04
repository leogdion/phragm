var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite'
});


var uuid = require('node-uuid');

var Site = sequelize.define('Site', {
  siteId: {type : Sequelize.STRING, unique: true}
});

var Status = sequelize.define('SiteStatus', {
  name: {type: Sequelize.STRING, unique: true}
});

Site.belongsTo(Status);

app.get('/', function (req, res) {
  Status.findOne({
    'name' : 'queued'
  }).then( function (status) {
    Site.create({
      siteId : uuid.v4(),
      status : status
    }).then(function (site) {

    console.log(site);
    site.setStatus(status).then(function (site) {
      res.send(site);
    });
    });
  });
});

sequelize.sync({force: true}).then(function () {
  Status.bulkCreate([
    { name : "queued"},
    { name : "building"},
    { name : "ready"}
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
      },
      start: false
    });
    job.start();
  });
});

