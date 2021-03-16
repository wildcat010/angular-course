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
import { BehaviorSubject, Subject } from 'rxjs';
import { Pagination } from '../../model/pagination';

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

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator; // read true because the pagination comes from the server side

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
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
        console.log('page info', pgnInfo);

        this.setPagination(
          {
            per_page: pgnInfo.per_page,
            length: pgnInfo.total,
            page_index: pgnInfo.page,
          },
          true
        );
      },
      (error) => console.log('error', error),
      () => {
        this.isProcessing$.next(false);
        this.dataSource.data = this.users;
      }
    );
  }

  ngAfterViewInit() {
    console.log('paginator', this.paginator);

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

        console.log('data', this.isProcessing$.value);
      },
      (err) => {
        console.log('error', err);
        this.setState(user, user.previousState);
      },
      () => {
        this.setPagination(this.pagination);
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
        this.isProcessing$.next(true);
        this.userService.updateUser(result).subscribe(
          (res) => {
            this.setState(userUpdated, userState.UPDATED);
            userUpdated.lastUpdated = res.updatedAt;
            const newUser = { ...userUpdated };
            this.users[userIndex] = newUser;
            this.dataSource.data = this.users;
          },
          (err) => {},
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
        console.log('page info', pgnInfo);
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
      (err) => {},
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
