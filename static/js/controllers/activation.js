var templates = require('../templates');
var store = require("store");

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
        },
        "events": {
          "submit": function (evt) {
            var inputs = this.element("inputs");
            var data = inputs.reduce(function (memo, element) {
              var key = element.getAttribute('name') || element.getAttribute('id');
              var value = element.value || (element.selectedIndex && element.options && element.options[element.selectedIndex]);
              var ignore = element.hasAttribute('data-ignore');
              if (key && value && !ignore) {
                memo[key] = value;
              }
              return memo;
            }, {});
            var that = this;
            var request = new XMLHttpRequest();
            request.open('PUT', this.app.configuration.server + '/api/v1/users/' + data.name, true);
            delete data.name;
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            request.onload = function () {
              var i = 0;

              for (i = 0, len = inputs.length; i < len; i++) {
                inputs[i].disabled = false;
              }
              if (this.status >= 200 && this.status < 400) {
                // Success!
                var resp = this.response;
                var data = JSON.parse(resp);
                store.set('sessionId', data.sessionId);
                that.app.hash("dashboard");
              } else {

              }
            };

            request.onerror = function () {
              // There was a connection error of some sort
              for (var i = 0, len = inputs.length; i < len; i++) {
                inputs[i].disabled = false;
              }
            };
            request.send(JSON.stringify(data));

            for (var i = 0, len = inputs.length; i < len; i++) {
              inputs[i].disabled = true;
            }
            evt.preventDefault();
          }
        }
      },
      "inputs": {
        "baseElement": "form",
        "selector": function (baseElement) {
          return ["input", "select", "textarea", "button"].reduce(

          function (memo, tagName) {
            memo = memo.concat(Array.prototype.slice.call(baseElement.getElementsByTagName(tagName)));
            return memo;
          }, []);
        }
      }
    }
  };

  return constructor;
})();