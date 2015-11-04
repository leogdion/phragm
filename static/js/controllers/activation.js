var templates = require('../templates');

var Activation = (function () {
  var constructor = function () {

  };
  var self = {
    elements: {
      items: {

      },
      setup: function (that) {
        for (var name in that.elements) {
          var selector = that.elements[name].selector;
          var baseElement = that.elements[name].baseElement;

          if (typeof(baseElement) == "string") {
            baseElement = self.elements.items[baseElement];
          }

          if (!baseElement) {
            baseElement = document;
          }

          var args = Array.prototype.slice.call(arguments);
          args[0] = baseElement;
          var element;
          if (typeof(selector) == "function") {
            element = that.elements[name].selector.apply(that, args);
          }

          if (element) {
            self.elements.items[name] = element;
            var events = that.elements[name].events;
            for (var eventName in events) {
              element.addEventListener(eventName, events[eventName].bind(that));
            }
          }
        }
      }
    }
  };

  constructor.prototype = {
    initialize: function (app) {
      this.app = app;
      this.app.hash("activation{?query}", this);
    },
    hash: function (route, oldRoute, query) {

      self.elements.setup(this, query);

    },
    element: function (name, newElement) {
      if (newElement) {
        self.elements.items[name] = newElement;
      } else {
        return self.elements.items[name];
      }
    },
    elements: {
      "form": {
        "selector": function (document, data) {
          var main = document.getElementsByTagName("main")[0];
          var d = document.createElement('div');
          main.innerHTML = templates.activation(data);

          return main.firstChild;
        }
      }
    }
  };

  return constructor;
})();