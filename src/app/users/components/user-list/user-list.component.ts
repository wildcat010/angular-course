import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/service/user/user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[];
  paginationInfo: any;
  displayedColumns: string[] = ['id', 'email', 'option'];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserList().subscribe(
      (usersInformation) => {
        //success
        this.users = usersInformation.data;
        let { data, ...paginationInfo } = usersInformation; //copy the pagination information into paginationInfo variable without taking the userList - data
        this.paginationInfo = paginationInfo;
      },
      (error) => {
        console.log('error: ' + error);
      }
    );
  }

  delete(user: User) {}

  modify(user: User) {}
}
