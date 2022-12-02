import { Role } from '@prisma/client';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RtPayload {
  id: string;
  roles: Role[];
}

export interface RtUserPayload extends RtPayload {
  refreshToken: string;
}

export interface JwtUserPayload {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
}
