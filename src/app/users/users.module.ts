import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserService } from './service/user.service';
import { MatTableModule } from '@angular/material/table';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserStateDirective } from './customDirective/userState.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { UserViewComponent } from './components/user-view/user-view.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../components/shared/module/shared.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserDialogComponent,
    UserStateDirective,
    UserHomeComponent,
    UserViewComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule,
    MatPaginatorModule,

    SharedModule,
  ],
  providers: [UserService],
})
export class UsersModule {}
