import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { UserWithState } from '../../model/user-with-state';
import { UsersStoreService } from '../../service/users-store.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
  private sub: any;
  private id: number;
  user: any;
  usersStoreServiceSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersStoreService: UsersStoreService
  ) {}

  ngOnInit(): void {
    this.usersStoreServiceSubscription = this.usersStoreService.users
      .pipe(
        filter((x: UserWithState[]) => {
          if (x && x.length >= 1 && this.id) {
            return true;
          } else {
            return false;
          }
        })
      )
      .subscribe((users) => {
        users.forEach((user) => {
          if (user.id == this.id) {
            this.user = user;
          }
        });
      });
    this.sub = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.usersStoreService.getUserById(params.id);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.usersStoreServiceSubscription.unsubscribe();
  }

  onNavigationBack() {
    this.router.navigate(['users']);
  }
}
