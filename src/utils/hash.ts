import { compare, hash } from 'bcrypt';

const salt = 10;

export const hashPassword = async (pass: string) => {
  const result = await hash(pass, salt);
  return result;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  const result = await compare(password, hashedPassword);
  return result;
};
