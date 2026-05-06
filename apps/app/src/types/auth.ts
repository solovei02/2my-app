export type User = {
  id: number;
  email: string;
  displayName: string;
};

export type AuthPayload = {
  email: string;
  password: string;
  displayName?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
