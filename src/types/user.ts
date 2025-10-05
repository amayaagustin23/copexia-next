
export enum Role {
  ADMIN = "ADMIN",
}

export type UserProfile = {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
};