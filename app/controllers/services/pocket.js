var passport = require('passport');

module.exports = function (include) {
  return {
    services : {
      pocket : {
        params: {

        },
        actions: {
          index: function (req, res) {
            res.send('list ' + include("datetime"));
          },
          show: function (req, res) {
            res.send('show');
          },
          create: [passport.authenticate('local'), function (req, res) {
            res.send("create")
          }],
          update: function (req, res) {
            res.send('update');
          },
          destroy: function (req, res) {
            res.send('destroy');
          }
        }
      }
    }
  };
};