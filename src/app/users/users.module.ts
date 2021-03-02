import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserService } from '../service/user/user.service';
import { MatTableModule } from '@angular/material/table';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserListComponent, UserDialogComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [UserService],
})
export class UsersModule {}
