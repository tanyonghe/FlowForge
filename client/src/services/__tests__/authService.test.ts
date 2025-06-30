import { authService, AuthRequest, AuthResponse, User } from '../authService';

// Mock fetch globally
global.fetch = jest.fn();

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear fetch mock
    (fetch as jest.Mock).mockClear();
  });

  describe('login', () => {
    it('should successfully login and store tokens', async () => {
      // Arrange
      const mockResponse: AuthResponse = {
        token: 'jwt-token',
        refreshToken: 'refresh-token',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
        expiresIn: 86400000
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      // Act
      const result = await authService.login('testuser', 'password123');

      // Assert
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe('jwt-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(localStorage.getItem('userEmail')).toBe('test@example.com');
      expect(localStorage.getItem('username')).toBe('testuser');
      expect(localStorage.getItem('userRole')).toBe('USER');

      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      });
    });

    it('should throw error on login failure', async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      // Act & Assert
      await expect(authService.login('testuser', 'wrongpassword'))
        .rejects.toThrow('Login failed');
    });

    it('should handle network errors', async () => {
      // Arrange
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(authService.login('testuser', 'password123'))
        .rejects.toThrow('Login failed');
    });
  });

  describe('register', () => {
    it('should successfully register and store tokens', async () => {
      // Arrange
      const mockResponse: AuthResponse = {
        token: 'jwt-token',
        refreshToken: 'refresh-token',
        username: 'newuser',
        email: 'new@example.com',
        role: 'USER',
        expiresIn: 86400000
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      // Act
      const result = await authService.register('newuser', 'password123', 'new@example.com', 'John', 'Doe');

      // Assert
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe('jwt-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(localStorage.getItem('userEmail')).toBe('new@example.com');
      expect(localStorage.getItem('username')).toBe('newuser');
      expect(localStorage.getItem('userRole')).toBe('USER');

      expect(fetch).toHaveBeenCalledWith('/api/auth/register?email=new%40example.com&firstName=John&lastName=Doe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'newuser', password: 'password123' }),
      });
    });

    it('should throw error on registration failure', async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      // Act & Assert
      await expect(authService.register('newuser', 'password123', 'new@example.com'))
        .rejects.toThrow('Registration failed');
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh tokens', async () => {
      // Arrange
      localStorage.setItem('refreshToken', 'old-refresh-token');
      
      const mockResponse: AuthResponse = {
        token: 'new-jwt-token',
        refreshToken: 'new-refresh-token',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
        expiresIn: 86400000
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      // Act
      const result = await authService.refreshToken();

      // Assert
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe('new-jwt-token');
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');

      expect(fetch).toHaveBeenCalledWith('/api/auth/refresh?refreshToken=old-refresh-token', {
        method: 'POST',
      });
    });

    it('should throw error when no refresh token available', async () => {
      // Act & Assert
      await expect(authService.refreshToken())
        .rejects.toThrow('No refresh token available');
    });

    it('should throw error on refresh failure', async () => {
      // Arrange
      localStorage.setItem('refreshToken', 'refresh-token');
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      // Act & Assert
      await expect(authService.refreshToken())
        .rejects.toThrow('Token refresh failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should successfully get current user', async () => {
      // Arrange
      localStorage.setItem('authToken', 'jwt-token');
      
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
        enabled: true,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2023-01-01T00:00:00Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      // Act
      const result = await authService.getCurrentUser();

      // Assert
      expect(result).toEqual(mockUser);

      expect(fetch).toHaveBeenCalledWith('/api/auth/me', {
        headers: {
          'Authorization': 'Bearer jwt-token',
        },
      });
    });

    it('should throw error when no auth token available', async () => {
      // Act & Assert
      await expect(authService.getCurrentUser())
        .rejects.toThrow('No auth token available');
    });

    it('should throw error on get current user failure', async () => {
      // Arrange
      localStorage.setItem('authToken', 'jwt-token');
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      // Act & Assert
      await expect(authService.getCurrentUser())
        .rejects.toThrow('Failed to get current user');
    });
  });

  describe('utility methods', () => {
    it('should return auth token from localStorage', () => {
      // Arrange
      localStorage.setItem('authToken', 'test-token');

      // Act
      const token = authService.getAuthToken();

      // Assert
      expect(token).toBe('test-token');
    });

    it('should return refresh token from localStorage', () => {
      // Arrange
      localStorage.setItem('refreshToken', 'test-refresh-token');

      // Act
      const token = authService.getRefreshToken();

      // Assert
      expect(token).toBe('test-refresh-token');
    });

    it('should return true when user is logged in', () => {
      // Arrange
      localStorage.setItem('authToken', 'test-token');

      // Act
      const isLoggedIn = authService.isLoggedIn();

      // Assert
      expect(isLoggedIn).toBe(true);
    });

    it('should return false when user is not logged in', () => {
      // Act
      const isLoggedIn = authService.isLoggedIn();

      // Assert
      expect(isLoggedIn).toBe(false);
    });

    it('should clear all auth data on logout', () => {
      // Arrange
      localStorage.setItem('authToken', 'token');
      localStorage.setItem('refreshToken', 'refresh-token');
      localStorage.setItem('userEmail', 'test@example.com');
      localStorage.setItem('username', 'testuser');
      localStorage.setItem('userRole', 'USER');

      // Act
      authService.logout();

      // Assert
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('userEmail')).toBeNull();
      expect(localStorage.getItem('username')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });

    it('should return user info from localStorage', () => {
      // Arrange
      localStorage.setItem('username', 'testuser');
      localStorage.setItem('userEmail', 'test@example.com');
      localStorage.setItem('userRole', 'USER');

      // Act
      const userInfo = authService.getUserInfo();

      // Assert
      expect(userInfo).toEqual({
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER'
      });
    });
  });
}); 