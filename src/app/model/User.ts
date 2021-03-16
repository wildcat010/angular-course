export class User implements IUser {
  id?: number;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  token?: string;
}

interface IUser {
  id?: number;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}
