import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { userState } from 'src/app/users/model/user-state';
import { UserWithState } from '../../model/user-with-state';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Pagination } from '../../model/pagination';
import { UsersStoreService } from '../../service/users-store.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  users: UserWithState[];
  isProcessing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  pagination: Pagination;
  displayedColumns: string[] = ['id', 'email', 'option', 'state'];
  dataSource: MatTableDataSource<UserWithState> = new MatTableDataSource<UserWithState>();
  errorSubscription: Subscription;
  private usersStoreServiceSubscription: Subscription;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator; // read true because the pagination comes from the server side

  constructor(
    private usersStoreService: UsersStoreService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.pagination = { per_page: 0, length: 0, page_index: 0 };
  }

  ngOnInit(): void {
    this.usersStoreServiceSubscription = this.usersStoreService.users
      .pipe(
        filter((x: UserWithState[]) => {
          if (x && x.length > 0) {
            return true;
          } else {
            this.usersStoreService.loadPage(1);
            return false;
          }
        })
      )
      .subscribe((updatedUsers) => {
        if (this.usersStoreService.usersPagination) {
          this.dataSource.data = this.users = updatedUsers;
          this.pagination = this.usersStoreService.usersPagination;
          this.isProcessing$.next(false);
        } else {
          this.usersStoreService.loadPage(1);
        }
      });
  }

  ngOnDestroy() {
    this.usersStoreServiceSubscription.unsubscribe();
  }

  onDeleteUser(user: UserWithState) {
    this.setState(user, userState.DELETING);
    this.isProcessing$.next(true);
    this.usersStoreService.deleteUser(user);
  }

  onModify(user: UserWithState) {
    const originalUser = { ...user };
    const userToModify = this.setState(user, userState.VIEWING);

    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { userToModify },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.setState(user, userState.MODIFIED);
        this.usersStoreService.updateUser(result).subscribe((x) => {
          if (x === false) {
            this.usersStoreService.rollbackChangeOnUser(originalUser);
            return;
          }
          const updatedUser = { ...this.setState(user, userState.UPDATED) };
          this.usersStoreService.changeStateUser(updatedUser);
        });
      } else {
        this.usersStoreService.rollbackChangeOnUser(originalUser);
      }
    });
  }

  onDisplayUser(user: UserWithState): void {
    this.router.navigate(['users', user.id]);
  }

  pageEvent($event): void {
    this.isProcessing$.next(true);
    this.usersStoreService.loadPage($event.pageIndex + 1);
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
