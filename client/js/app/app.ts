import {View, Component} from 'angular2/angular2';

let template = "<h1>Phragm</h1>";

@Component({
  selector: 'phragm-app'
})
@View({
  template: template
})
/*
@RouteConfig([
  { path: '/',       redirectTo: '/home' },
  { path: '/home',   as: 'Home',   component: Home },
  { path: '/login',  as: 'Login',  component: Login },
  { path: '/signup', as: 'Signup', component: Signup }
])
*/
export class App {
}