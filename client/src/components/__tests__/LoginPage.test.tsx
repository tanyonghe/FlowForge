import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../App'; // We'll need to export this from App.tsx

// Mock the authService
jest.mock('../../services/authService', () => ({
  authService: {
    login: jest.fn()
  }
}));

import { authService } from '../../services/authService';

const mockAuthService = authService as jest.Mocked<typeof authService>;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('LoginPage', () => {
  const mockSetIsLoggedIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <LoginPage setIsLoggedIn={mockSetIsLoggedIn} />
      </BrowserRouter>
    );
  };

  it('should render login form', () => {
    renderLoginPage();

    expect(screen.getByText('Sign in to FlowForge')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue without login' })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    mockAuthService.login.mockResolvedValue({
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      username: 'testuser',
      email: 'test@example.com',
      role: 'USER',
      expiresIn: 86400000
    });

    renderLoginPage();

    // Fill in form
    fireEvent.change(screen.getByPlaceholderText('Username or Email'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('should handle login failure', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

    renderLoginPage();

    // Fill in form
    fireEvent.change(screen.getByPlaceholderText('Username or Email'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please check your credentials.')).toBeInTheDocument();
    });

    expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith('/profile');
  });

  it('should show loading state during login', async () => {
    // Create a promise that we can control
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    mockAuthService.login.mockReturnValue(loginPromise);

    renderLoginPage();

    // Fill in form
    fireEvent.change(screen.getByPlaceholderText('Username or Email'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    // Check loading state
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();

    // Resolve the promise
    resolveLogin!({
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      username: 'testuser',
      email: 'test@example.com',
      role: 'USER',
      expiresIn: 86400000
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });
  });

  it('should navigate to workflows when continue without login is clicked', () => {
    renderLoginPage();

    fireEvent.click(screen.getByRole('button', { name: 'Continue without login' }));

    expect(mockNavigate).toHaveBeenCalledWith('/workflows');
  });

  it('should require both username and password', async () => {
    renderLoginPage();

    // Try to submit without filling form
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    // Form should not submit due to HTML5 validation
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should clear error message when form is resubmitted', async () => {
    mockAuthService.login
      .mockRejectedValueOnce(new Error('Invalid credentials'))
      .mockResolvedValueOnce({
        token: 'jwt-token',
        refreshToken: 'refresh-token',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
        expiresIn: 86400000
      });

    renderLoginPage();

    // Fill in form and submit (first attempt - fails)
    fireEvent.change(screen.getByPlaceholderText('Username or Email'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please check your credentials.')).toBeInTheDocument();
    });

    // Change password and submit again (second attempt - succeeds)
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'correctpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.queryByText('Login failed. Please check your credentials.')).not.toBeInTheDocument();
    });
  });
}); 