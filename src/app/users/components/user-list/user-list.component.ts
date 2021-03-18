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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Pagination } from '../../model/pagination';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ErrorService } from 'src/app/service/error/error.service';
import { BottomSheetComponent } from 'src/app/shared/bottom-sheet/bottom-sheet.component';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private _users = new BehaviorSubject<UserWithState[]>([]);
  private dataStore: { theUsers: UserWithState[] } = { theUsers: [] };
  readonly theUsers = this._users.asObservable();

  users: UserWithState[] = [];
  isProcessing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  pagination: Pagination;

  displayedColumns: string[] = ['id', 'email', 'option', 'state'];
  dataSource: MatTableDataSource<UserWithState> = new MatTableDataSource<UserWithState>();
  errorSubscription: Subscription;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator; // read true because the pagination comes from the server side

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private errorService: ErrorService
  ) {
    this.pagination = { per_page: 0, length: 0, page_index: 0 };
  }

  ngOnInit(): void {
    this.userService.getUserList(1).subscribe(
      (usersInformation) => {
        const newUsers = this.castUserToUserWithState(usersInformation.data);
        this.updateUsersData({}, newUsers);
        this.updatePagination(usersInformation, true);
        this.dataSource.data = this.dataStore.theUsers;
      },
      (error) => {
        this.createHTTPError(error);
      },
      () => {
        this.isProcessing$.next(false);
        console.log('reload data1');
      }
    );
  }

  onDeleteUser(user: UserWithState) {
    this.setState(user, userState.DELETING);
    this.isProcessing$.next(true);
    this.userService.deleteUser(user.id).subscribe(
      () => {
        this.isProcessing$.next(false);

        const index = this.findUserIndex(user.id);
        this.dataStore.theUsers.splice(index, 1);

        this.updateUsersData({}, this.dataStore.theUsers);

        this.dataSource.data = this.dataStore.theUsers;
        this.setPagination(this.pagination, false);
      },
      (error) => {
        this.createHTTPError(error);
      },
      () => {
        this.isProcessing$.next(false);
      }
    );
  }

  onModify(user: UserWithState) {
    const originalState = user.state;
    const userToModify = this.setState(user, userState.VIEWING);

    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { userToModify },
    });

    dialogRef.afterClosed().subscribe((result) => {
      let userIndex;
      let userUpdated;

      if (result) {
        userIndex = this.findUserIndex(user.id);
        userUpdated = this.users[userIndex];
        this.setState(userUpdated, userState.MODIFIED);
        this.isProcessing$.next(true);
        this.userService.updateUser(result).subscribe(
          (res) => {
            userUpdated = { ...result };
            this.setState(userUpdated, userState.UPDATED);

            this.dataStore.theUsers[userIndex] = userUpdated;
            this._users.next(Object.assign({}, this.dataStore).theUsers);

            this.dataSource.data = this.dataStore.theUsers;
          },
          (error) => {
            this.createHTTPError(error);

            //TODO
            const rollbackUser = { ...user };
            this.setState(rollbackUser, originalState);
            this.users[userIndex] = rollbackUser;
            this.dataSource.data = this.users;
          },
          () => {
            this.isProcessing$.next(false);
          }
        );
      } else {
        userIndex = this.findUserIndex(user.id);
        userUpdated = this.dataStore.theUsers[userIndex];
        this.dataStore.theUsers[userIndex] = {
          ...this.setState(userUpdated, userUpdated.previousState),
        };
        this.updateUsersData({}, this.dataStore.theUsers);
        this.dataSource.data = this.dataStore.theUsers;
      }
      // const newUser = { ...userUpdated };
      // this.dataStore.theUsers[userIndex] = newUser;
      // this.dataSource.data = this.dataStore.theUsers;
    });
  }

  onDisplayUser(user: UserWithState): void {
    this.router.navigate(['users', user.id]);
  }

  pageEvent($event): void {
    this.isProcessing$.next(true);
    this.userService.getUserList($event.pageIndex + 1).subscribe(
      (usersInformation) => {
        const newUsers = this.castUserToUserWithState(usersInformation.data);
        this.updateUsersData({}, newUsers);
        this.updatePagination(usersInformation, true);
        this.dataSource.data = this.dataStore.theUsers;
      },
      (error) => {
        this.createHTTPError(error);

        this.updatePagination(this.pagination);
      },
      () => {
        this.isProcessing$.next(false);
        console.log('reload data2');
      }
    );
  }

  private setPagination(pager: Pagination, pageEvent: boolean = false): void {
    let page_index = pager.page_index;
    let length = pager.length;
    let per_page = pager.per_page;
    if (!pageEvent) {
      length = length - 1;
      if (page_index === 0) {
        per_page = per_page - 1;
      }
      if (this.dataStore.theUsers.length === 0) {
        return this.pageEvent(1);
      }
    } else {
      page_index = page_index - 1;
    }

    this.pagination = {
      per_page: per_page,
      length: length,
      page_index: page_index,
    };
  }

  private findUserIndex(userId: number): number {
    return this.dataStore.theUsers.findIndex((x) => x.id === userId);
  }

  private updatePagination(data: any, pageEvent: boolean = false): void {
    this.setPagination(
      {
        per_page: data.per_page,
        length: data.total,
        page_index: data.page,
      },
      pageEvent
    );
  }
  private createHTTPError(error: any): void {
    this.errorService.currentErrorSubject.next({
      title: error.status,
      description: error.message,
    });
    this.bottomSheet.open(BottomSheetComponent);
    this.isProcessing$.next(false);
  }

  private castUserToUserWithState(data: User[]): UserWithState[] {
    const myUsers = data as UserWithState[];
    myUsers.forEach((element) => {
      element.state = userState.ORIGINAL;
    });
    return myUsers;
  }

  private updateUsersData(update: any, data: any): void {
    this.dataStore.theUsers = data;
    this._users.next(Object.assign(update, this.dataStore).theUsers);
  }

  private setState(user: UserWithState, state: userState): UserWithState {
    const previousState = user.state;
    if (previousState !== state) {
      user.previousState = previousState;
      user.state = state;
    }
    return user;
  }
}
