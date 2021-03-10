import { User } from 'src/app/model/User';
import { userState } from 'src/app/users/model/user-state';

export class UserWithState extends User {
  state: userState = userState.ORIGINAL;
}
