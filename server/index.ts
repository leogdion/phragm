/// <reference path="../typings/tsd.d.ts" />

import express = require("express")
import bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

app.get('api/v1/ideas', function (req, res) {
  res.send({
    "hello" : "world"
  });
});

export var App = app;