import { ApiClient } from './client';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: { id: string; email: string; role: string };
}

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.client.post<LoginResponse>('/auth/login', { email, password });
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout', {});
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return this.client.post<LoginResponse>('/auth/refresh', { refreshToken });
  }
}
