import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserService } from '../service/user/user.service';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, UsersRoutingModule, MatTableModule],
  providers: [UserService],
})
export class UsersModule {}
