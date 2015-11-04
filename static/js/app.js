var crossroads = require('crossroads');
var hasher = require('hasher');
var User = require('./controllers/user');
var Activation = require('./controllers/activation');

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


var App = {
  controllers: [],
  attachStyleSheet: function () {
    var cb = function () {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = '/css/style.css';
      var h = document.getElementsByTagName('head')[0];
      h.parentNode.insertBefore(l, h);
    };
    var raf = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame;
    if (raf) raf(cb);
    else window.addEventListener('load', cb);

  },
  hash: function (route, controller) {
    if (controller && typeof(controller) !== 'string') {
      crossroads.addRoute(route, controller.hash.bind(controller, route));
    } else {
      hasher.setHash(route, controller);
    }
  },
  parseHash: function (newHash, oldHash) {
    newHash = newHash[newHash.length - 1] === "/" ? newHash.substring(0, newHash.length - 1) : newHash;
    crossroads.parse(newHash, [oldHash]);
  },
  configuration: {},
  start: function () {
    //var user = new User();
    var App = this;
    var parseHash = App.parseHash.bind(App);
    this.attachStyleSheet();
    window.addEventListener('load', function (evt) {
      var configurationElement = document.getElementById('main-configuration');
      if (configurationElement) {
        App.configuration = JSON.parse(configurationElement.innerText.trim()) || this.configuration;
      }
      App.controllers.forEach(function (_) {
        _.initialize(App);
      });
      hasher.initialized.add(parseHash); //parse initial hash
      hasher.changed.add(parseHash); //parse hash changes
      hasher.init();

      //for (var index = 0; index < controllers.length; index++) {
      // controllers[index].initialize(this);
      //}
    });
  },
  controller: function (Controller) {
    var controller = new Controller();

    this.controllers.push(controller);
  }
};

App.controller(Activation);
App.controller(User);