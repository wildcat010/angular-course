import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ErrorService } from 'src/app/service/error/error.service';
import { BottomSheetComponent } from 'src/app/shared/bottom-sheet/bottom-sheet.component';
import { Pagination } from '../model/pagination';
import { userState } from '../model/user-state';
import { UserWithState } from '../model/user-with-state';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UsersStoreService {
  private _users = new BehaviorSubject<UserWithState[]>([]);
  private dataStore: { users: UserWithState[] } = { users: [] };

  readonly userList = this._users.asObservable();

  private pagination: Pagination;

  constructor(
    private userService: UserService,
    private bottomSheet: MatBottomSheet,
    private errorService: ErrorService
  ) {}

  get users() {
    return this._users.asObservable();
  }

  get usersPagination() {
    return this.pagination;
  }

  getUserById(id: number): void {
    const result = new Subject<UserWithState>();

    let user: UserWithState;
    if (this.dataStore.users.length > 0) {
      this.dataStore.users.forEach((x) => {
        if (x.id == id) {
          this._users.next(Object.assign({}, this.dataStore).users);
        }
      });
    } else {
      this.userService.getUser(id).subscribe((x) => {
        let newArray: UserWithState[] = [];
        newArray = this.dataStore.users;
        newArray.push(x.data);
        this.dataStore.users = newArray;
        this._users.next(Object.assign({}, this.dataStore).users);
      });
    }
  }

  loadPage(page: number): void {
    this.userService.getUserList(page).subscribe(
      (data: any) => {
        [...data.data].forEach(function (user) {
          user.state = userState.ORIGINAL;
        });
        this.dataStore.users = data.data;
        this.pagination = {
          length: data.total,
          page_index: data.page,
          per_page: data.per_page,
        };

        this.setPagination(this.pagination, true);
        this._users.next(Object.assign({}, this.dataStore).users);
      },
      (error) => {
        this.createHTTPError(error);
      }
    );
  }

  updateUser(user: UserWithState): Observable<boolean> {
    const result = new Subject<boolean>();

    this.userService.updateUser(user).subscribe(
      (data) => {
        const index = this.findUserIndex(user.id);
        user.lastUpdated = data;
        this.dataStore.users[index] = user;
        this._users.next(Object.assign({}, this.dataStore).users);
      },
      (error) => {
        result.next(false);
        this.createHTTPError(error);
      },
      () => {
        result.next(true);
      }
    );
    return result.asObservable();
  }

  changeStateUser(user: UserWithState) {
    const index = this.findUserIndex(user.id);
    this.dataStore.users[index] = user;
    this._users.next(Object.assign({}, this.dataStore).users);
  }

  rollbackChangeOnUser(user: UserWithState): void {
    const index = this.findUserIndex(user.id);
    this.dataStore.users[index] = user;
    this._users.next(Object.assign({}, this.dataStore).users);
  }

  deleteUser(user): void {
    this.userService.deleteUser(user.id).subscribe(
      (data) => {
        const index = this.findUserIndex(user.id);
        this.dataStore.users.splice(index, 1);

        this.setPagination(this.pagination, false);
        this._users.next(Object.assign({}, this.dataStore).users);
      },
      (error) => {
        this.createHTTPError(error);
      }
    );
  }

  createCustomError(error: any): void {
    this.createHTTPError(error);
  }

  private createHTTPError(error: any): void {
    let status = error.status;
    if (status === 0) {
      status = error.statusText;
    }
    this.errorService.currentErrorSubject.next({
      title: status,
      description: error.message,
    });
    this.bottomSheet.open(BottomSheetComponent);
  }

  private findUserIndex(userId: number): number {
    return this.dataStore.users.findIndex((x) => x.id === userId);
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
    } else {
      page_index = page_index - 1;
    }
    this.pagination = {
      per_page: per_page,
      length: length,
      page_index: page_index,
    };
  }
}
