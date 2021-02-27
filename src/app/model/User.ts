
export class User implements myUser {
  id!: number;
  email!: string;
  password!: string;
  token?: string;
}

interface myUser {
  id: number;
  email: string;
  password: string;
}
