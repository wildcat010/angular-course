import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from 'src/app/users/service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { userState } from 'src/app/users/model/user-state';
import { UserWithState } from '../../model/user-with-state';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  users: UserWithState[] = [];
  isProcessing = true;
  cart: Observable<UserWithState[]>;

  paginationInfo: any;
  displayedColumns: string[] = ['id', 'email', 'option', 'state'];
  dataSource: MatTableDataSource<UserWithState> = new MatTableDataSource<UserWithState>(
    this.users
  );

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router //private store: Store<{ usersStore: UserWithState[] }>
  ) {
    //this.store.select('usersStore').subscribe((state: any => this.cart = state));
  }

  ngOnInit(): void {
    this.userService.getUserList(1).subscribe(
      (usersInformation) => {
        const newUsers = usersInformation.data;
        newUsers.forEach((element) => {
          element.state = userState.ORIGINAL;
        });
        this.users.push(...newUsers);
        let { data, ...paginationInfo } = usersInformation; //copy the pagination information into paginationInfo variable without taking the userList - data
        this.paginationInfo = paginationInfo;
      },
      (error) => console.log('error', error),
      () => {
        //init the paginator
        this.dataSource.paginator = this.paginator;
        this.isProcessing = false;
      }
    );
  }

  onDeleteUser(user: UserWithState) {
    this.setState(user, userState.DELETING);
    this.isProcessing = true;
    this.userService.deleteUser(user.id).subscribe(
      () => {
        const data = this.dataSource.data;
        const index = this.findUserIndex(user.id);
        data.splice(index, 1);
        this.dataSource.data = data;
      },
      (err) => {},
      () => {
        this.isProcessing = false;
        this.setState(user, user.previousState);
      }
    );
  }

  onModify(user: UserWithState) {
    this.setState(user, userState.VIEWING);
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      let userIndex;
      let userUpdated;

      if (result) {
        userIndex = this.findUserIndex(result.id);
        userUpdated = this.users[userIndex];
        this.setState(userUpdated, userState.MODIFIED);
        this.isProcessing = true;
        this.userService.updateUser(result).subscribe(
          (res) => {
            this.setState(userUpdated, userState.UPDATED);
            userUpdated.lastUpdated = res.updatedAt;
            const newUser = { ...userUpdated };
            this.users[userIndex] = newUser;
            this.dataSource.data = this.users;
            console.log('user', newUser);
          },
          (err) => {},
          () => (this.isProcessing = false)
        );
      } else {
        userIndex = this.findUserIndex(user.id);
        userUpdated = this.users[userIndex];
        this.setState(userUpdated, userUpdated.previousState);
      }
      const newUser = { ...userUpdated };
      this.users[userIndex] = newUser;
      this.dataSource.data = this.users;
    });
  }

  onDisplayUser(user: UserWithState): void {
    this.router.navigate(['users', user.id]);
  }

  pageEvent($event): void {
    this.isProcessing = true;
    this.userService.getUserList($event.pageIndex + 1).subscribe(
      (usersInformation) => {
        this.users = [];
        const newUsers = usersInformation.data;
        newUsers.forEach((element) => {
          element.state = userState.ORIGINAL;
        });
        this.users.push(...newUsers);
        this.users = [...this.users];
        this.dataSource.data = this.users;
      },
      (err) => {},
      () => (this.isProcessing = false)
    );
  }

  private findUserIndex(userId: number): number {
    return this.users.findIndex((x) => x.id === userId);
  }

  private setState(user: UserWithState, state: userState): void {
    const previousState = user.state;
    if (previousState !== state) {
      user.previousState = previousState;
      user.state = state;
    }
  }
}
