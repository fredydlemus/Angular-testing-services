export interface User {
  id: string;
  emial: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface CreateUserDTO extends Omit<User, 'id'> { }
