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

          var element;
          if (typeof(selector) == "function") {
            element = that.elements[name].selector.call(that, baseElement);
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
      self.elements.setup(this);
    },
    hash: function (route, query) {

    },
    element: function (name, newElement) {
      if (newElement) {
        self.elements.items[name] = newElement;
      } else {
        return self.elements.items[name];
      }
    },
    elements: {

    }
  };

  return constructor;
})();