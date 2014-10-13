define(['store'], function (store) {
  return {
    //_data: {},
    set: function (name, value) {
      //this._data[name] = value;
      store.session(name, value);
    },
    get: function (name, defaultValue) {
      return store.session(name) || defaultValue;
    }
  };
});