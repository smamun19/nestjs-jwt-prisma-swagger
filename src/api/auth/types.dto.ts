import { IsEmail } from 'class-validator';

export class SignupInput {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

export class SigninInput {
  email: string;
  password: string;
}

export class Tokens {
  jwt_token: string;
  refresh_token: string;
}
