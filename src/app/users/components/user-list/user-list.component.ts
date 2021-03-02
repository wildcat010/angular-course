import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/service/user/user.service';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[];
  paginationInfo: any;
  displayedColumns: string[] = ['id', 'email', 'option'];
  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.getUserList().subscribe(
      (usersInformation) => {
        //success
        this.users = usersInformation.data;
        let { data, ...paginationInfo } = usersInformation; //copy the pagination information into paginationInfo variable without taking the userList - data
        this.paginationInfo = paginationInfo;
      },
      (error) => {
        console.log('error: ' + error);
      }
    );
  }

  delete(user: User) {}

  modify(user: User) {
    console.log('modify: ', user);
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      //TODO the put query to update the user - /api/users/2
    });
  }
}
