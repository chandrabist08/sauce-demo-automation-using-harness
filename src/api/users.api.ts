import { ApiClient } from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  role: string;
  password: string;
}

export class UsersApi {
  constructor(private readonly client: ApiClient) {}

  async getAll(): Promise<User[]> {
    return this.client.get<User[]>('/users');
  }

  async getById(id: string): Promise<User> {
    return this.client.get<User>(`/users/${id}`);
  }

  async create(payload: CreateUserPayload): Promise<User> {
    return this.client.post<User>('/users', payload);
  }

  async delete(id: string): Promise<void> {
    return this.client.delete(`/users/${id}`);
  }
}
