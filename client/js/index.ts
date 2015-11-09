
import 'zone.js';
import 'reflect-metadata';
/*

import {Component, bootstrap} from 'angular2/angular2';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

@Component({
    selector: 'phragm-app',
    template: '<h1>Phragm</h1>'
})
class AppComponent { }
bootstrap(AppComponent);
*/
import { bootstrap, FORM_PROVIDERS } from 'angular2/angular2';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';

import { App } from './app/app';

bootstrap(
  App,
  [
    FORM_PROVIDERS,
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS
  ]
);