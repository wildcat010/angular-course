import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/users/service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { userState } from 'src/app/users/model/user-state';
import { UserWithState } from '../../model/user-with-state';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: UserWithState[];
  paginationInfo: any;
  displayedColumns: string[] = ['id', 'email', 'option', 'state'];
  private dialogSub: Subscription;
  dataSource: MatTableDataSource<UserWithState>;
  isDisplayingUser = false;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dialogSub = this.userService.getUserList().subscribe(
      (usersInformation) => {
        //success
        this.users = usersInformation.data;

        this.users.map((x) => {
          x.state = userState.ORIGINAL;
          x.hasBeenModified = false;
        });

        console.log('users', this.users);
        let { data, ...paginationInfo } = usersInformation; //copy the pagination information into paginationInfo variable without taking the userList - data
        this.paginationInfo = paginationInfo;
      },
      (error) => console.log('error', error),
      () => {
        this.dataSource = new MatTableDataSource<UserWithState>(this.users);
      }
    );
  }

  onDeleteUser(user: UserWithState) {
    const data = this.dataSource.data;
    const b = this.users.findIndex((x) => x.id === user.id);
    const index = this.findUserIndex(user.id);
    data.splice(index, 1);

    this.dataSource.data = data;
  }

  onModify(user: UserWithState) {
    this.users[this.findUserIndex(user.id)].state = userState.VIEWING;

    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user },
    });

    this.dialogSub = dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.users[this.findUserIndex(user.id)].hasBeenModified = true;
        this.users[this.findUserIndex(user.id)].state = userState.MODIFIED;
      } else {
        if (this.users[this.findUserIndex(user.id)].hasBeenModified) {
          this.users[this.findUserIndex(user.id)].state = userState.MODIFIED;
        } else {
          this.users[this.findUserIndex(user.id)].state = userState.ORIGINAL;
        }
      }
      //TODO the put query to update the user - /api/users/2
    });
  }

  onDisplayUser(user: UserWithState) {
    this.router.navigate(['users', user.id]);
  }

  ngOnDestroy() {
    this.dialogSub.unsubscribe();
  }

  private findUserIndex(userId: number) {
    return this.users.findIndex((x) => x.id === userId);
  }
}
