import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component'
import { AuthGuard } from './service/auth/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, pathMatch: 'full'},
  { path: 'users',
  loadChildren: () =>
    import('./users/users.module').then(
      (m) => m.UsersModule
    ), canActivate: [AuthGuard], pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
