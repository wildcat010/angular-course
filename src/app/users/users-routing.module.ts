import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../service/auth-guard/auth.guard';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserViewComponent } from './components/user-view/user-view.component';

const userRoutes: Routes = [
  {
    path: '',
    component: UserHomeComponent,
    children: [
      {
        path: '',
        component: UserListComponent,
      },
      {
        path: ':id',
        component: UserViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
