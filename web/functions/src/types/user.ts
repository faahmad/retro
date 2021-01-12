export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  phoneNumber?: string;
  createdAt: string;
}

export type CreateUserParams = User;
