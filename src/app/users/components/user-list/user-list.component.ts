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

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
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
        const newUsers = usersInformation.data;
        newUsers.forEach((element) => {
          element.state = userState.ORIGINAL;
        });
        this.users.push(...newUsers);
        let { data, ...pgnInfo } = usersInformation; //copy the pagination information into paginationInfo variable without taking the userList - data

        this.setPagination(
          {
            per_page: pgnInfo.per_page,
            length: pgnInfo.total,
            page_index: pgnInfo.page,
          },
          true
        );
      },
      (error) => {
        this.errorService.currentErrorSubject.next({
          title: error.status,
          description: error.message,
        });
        this.bottomSheet.open(BottomSheetComponent);
        this.isProcessing$.next(false);
      },
      () => {
        this.isProcessing$.next(false);
        this.dataSource.data = this.users;
      }
    );
  }

  ngAfterViewInit() {
    //init paginator after view loading
    this.dataSource.paginator = this.paginator;
  }

  onDeleteUser(user: UserWithState) {
    this.setState(user, userState.DELETING);
    this.isProcessing$.next(true);
    this.userService.deleteUser(user.id).subscribe(
      () => {
        this.isProcessing$.next(false);

        const index = this.findUserIndex(user.id);
        const newUser = [...this.users];
        newUser.splice(index, 1);
        this.users.push(...newUser);
        this.users = newUser;
        this.dataSource.data = this.users;
      },
      (error) => {
        this.setState(user, user.previousState);
        this.errorService.currentErrorSubject.next({
          title: error.status,
          description: error.message,
        });
        this.bottomSheet.open(BottomSheetComponent);
        this.isProcessing$.next(false);
      },
      () => {
        this.setPagination(this.pagination);
      }
    );
  }

  onModify(user: UserWithState) {
    const originalState = user.state;
    this.setState(user, userState.VIEWING);
    const userToModify = { ...user };
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
            userUpdated.lastUpdated = res.updatedAt;
            const newUser = { ...userUpdated };
            this.users[userIndex] = newUser;
            this.dataSource.data = this.users;
          },
          (error) => {
            this.errorService.currentErrorSubject.next({
              title: error.status,
              description: error.message,
            });

            this.bottomSheet.open(BottomSheetComponent);
            this.isProcessing$.next(false);
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
    this.isProcessing$.next(true);
    this.userService.getUserList($event.pageIndex + 1).subscribe(
      (usersInformation) => {
        this.users = [];
        const newUsers = usersInformation.data;
        newUsers.forEach((element) => {
          element.state = userState.ORIGINAL;
        });
        this.users.push(...newUsers);
        this.users = [...this.users];

        let { data, ...pgnInfo } = usersInformation; //copy the pagination information into paginationInfo variable without taking the userList - data
        this.setPagination(
          {
            per_page: pgnInfo.per_page,
            length: pgnInfo.total,
            page_index: pgnInfo.page,
          },
          true
        );

        this.dataSource.data = this.users;
      },
      (error) => {
        this.errorService.currentErrorSubject.next({
          title: error.status,
          description: error.message,
        });
        this.bottomSheet.open(BottomSheetComponent);
        this.isProcessing$.next(false);
        this.setPagination(
          {
            per_page: this.pagination.per_page,
            length: this.pagination.length,
            page_index: this.pagination.page_index,
          },
          true
        );
      },
      () => {
        this.isProcessing$.next(false);
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
      if (this.users.length === 0) {
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
