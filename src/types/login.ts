export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginAccess {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}