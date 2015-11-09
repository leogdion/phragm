import {View, Component} from 'angular2/angular2';

@Component({
  selector: 'phragm-app'
})
@View({
  templateUrl: 'app/app.html'
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