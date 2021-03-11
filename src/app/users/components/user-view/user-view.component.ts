import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
  private sub: any;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      console.log('id', params.id);
      this.getUserById(params.id);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getUserById(id: number) {
    this.userService.getUser(id).subscribe(
      (userInformation) => {
        console.log('user', userInformation);
        //success
        this.user = userInformation.data;
      },
      (error) => console.log('error', error),
      () => {
        console.log('user', this.user);
      }
    );
  }

  onNavigationBack() {
    this.router.navigate(['users']);
  }
}
