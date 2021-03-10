export class User implements myUser {
  id?: number;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  token?: string;
}

interface myUser {
  id?: number;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}
