import { userState } from 'src/app/model/user-state';

export class User implements myUser {
  id?: number;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  token?: string;
}

export class UserWithState extends User {
  state: userState.ORIGINAL;
}

interface myUser {
  id?: number;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}
