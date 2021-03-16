import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomSheetComponent } from 'src/app/components/shared/bottom-sheet/bottom-sheet.component';
import { ErrorService } from 'src/app/service/error/error.service';
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
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private errorService: ErrorService
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
      (error) => {
        this.errorService.currentErrorSubject.next({
          title: error.status,
          description: error.message,
        });
        this.bottomSheet.open(BottomSheetComponent);
      },
      () => {
        console.log('user', this.user);
      }
    );
  }

  onNavigationBack() {
    this.router.navigate(['users']);
  }
}
