export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginAccess {
  access: string;
  refresh: string;
}