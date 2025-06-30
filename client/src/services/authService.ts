export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  email: string;
  role: string;
  expiresIn: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  lastLoginAt?: string;
}

class AuthService {
  private baseUrl = '/api/auth';

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store tokens in localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('username', data.username);
    localStorage.setItem('userRole', data.role);
    
    return data;
  }

  async register(
    username: string, 
    password: string, 
    email: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append('email', email);
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);

    const response = await fetch(`${this.baseUrl}/register?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store tokens in localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('username', data.username);
    localStorage.setItem('userRole', data.role);
    
    return data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const params = new URLSearchParams();
    params.append('refreshToken', refreshToken);

    const response = await fetch(`${this.baseUrl}/refresh?${params}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data: AuthResponse = await response.json();
    
    // Update tokens in localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data;
  }

  async getCurrentUser(): Promise<User> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No auth token available');
    }

    const response = await fetch(`${this.baseUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return await response.json();
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
  }

  getUserInfo() {
    return {
      username: localStorage.getItem('username'),
      email: localStorage.getItem('userEmail'),
      role: localStorage.getItem('userRole'),
    };
  }
}

export const authService = new AuthService(); 