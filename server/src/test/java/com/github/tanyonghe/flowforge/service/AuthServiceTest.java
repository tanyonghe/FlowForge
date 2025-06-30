package com.github.tanyonghe.flowforge.service;

import com.github.tanyonghe.flowforge.dto.AuthRequest;
import com.github.tanyonghe.flowforge.dto.AuthResponse;
import com.github.tanyonghe.flowforge.model.User;
import com.github.tanyonghe.flowforge.repository.UserRepository;
import com.github.tanyonghe.flowforge.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private AuthRequest authRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("1");
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");
        testUser.setRole("USER");
        testUser.setEnabled(true);
        testUser.setCreatedAt(LocalDateTime.now());

        authRequest = new AuthRequest();
        authRequest.setUsername("testuser");
        authRequest.setPassword("password123");
    }

    @Test
    void login_SuccessfulLogin_ReturnsAuthResponse() {
        // Arrange
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashedPassword"))
                .thenReturn(true);
        when(jwtUtil.generateToken("testuser", "USER"))
                .thenReturn("jwt-token");
        when(jwtUtil.generateRefreshToken("testuser"))
                .thenReturn("refresh-token");
        when(userRepository.save(any(User.class)))
                .thenReturn(testUser);

        // Act
        AuthResponse response = authService.login(authRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("USER", response.getRole());
        assertEquals(86400000L, response.getExpiresIn());

        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken("testuser", "USER");
        verify(jwtUtil).generateRefreshToken("testuser");
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.login(authRequest));
        assertEquals("Invalid credentials", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_UserDisabled_ThrowsException() {
        // Arrange
        testUser.setEnabled(false);
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.login(authRequest));
        assertEquals("Account is disabled", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        // Arrange
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashedPassword"))
                .thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.login(authRequest));
        assertEquals("Invalid credentials", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void register_SuccessfulRegistration_ReturnsAuthResponse() {
        // Arrange
        AuthRequest registerRequest = new AuthRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setPassword("password123");
        
        when(userRepository.existsByUsername("newuser"))
                .thenReturn(false);
        when(userRepository.existsByEmail("new@example.com"))
                .thenReturn(false);
        when(passwordEncoder.encode("password123"))
                .thenReturn("hashedPassword");
        when(jwtUtil.generateToken("newuser", "USER"))
                .thenReturn("jwt-token");
        when(jwtUtil.generateRefreshToken("newuser"))
                .thenReturn("refresh-token");
        when(userRepository.save(any(User.class)))
                .thenReturn(testUser);

        // Act
        AuthResponse response = authService.register(registerRequest, "new@example.com", "John", "Doe");

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("newuser", response.getUsername());
        assertEquals("new@example.com", response.getEmail());
        assertEquals("USER", response.getRole());

        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void register_UsernameExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByUsername("testuser"))
                .thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(authRequest, "test@example.com", "John", "Doe"));
        assertEquals("Username already exists", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_EmailExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByUsername("testuser"))
                .thenReturn(false);
        when(userRepository.existsByEmail("test@example.com"))
                .thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(authRequest, "test@example.com", "John", "Doe"));
        assertEquals("Email already exists", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void refreshToken_SuccessfulRefresh_ReturnsNewTokens() {
        // Arrange
        when(jwtUtil.extractUsername("refresh-token"))
                .thenReturn("testuser");
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken("testuser", "USER"))
                .thenReturn("new-jwt-token");
        when(jwtUtil.generateRefreshToken("testuser"))
                .thenReturn("new-refresh-token");

        // Act
        AuthResponse response = authService.refreshToken("refresh-token");

        // Assert
        assertNotNull(response);
        assertEquals("new-jwt-token", response.getToken());
        assertEquals("new-refresh-token", response.getRefreshToken());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("USER", response.getRole());
    }

    @Test
    void refreshToken_InvalidToken_ThrowsException() {
        // Arrange
        when(jwtUtil.extractUsername("invalid-token"))
                .thenThrow(new RuntimeException("Invalid token"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.refreshToken("invalid-token"));
        assertEquals("Invalid refresh token", exception.getMessage());
    }

    @Test
    void refreshToken_UserNotFound_ThrowsException() {
        // Arrange
        when(jwtUtil.extractUsername("refresh-token"))
                .thenReturn("testuser");
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.refreshToken("refresh-token"));
        assertEquals("Invalid refresh token", exception.getMessage());
    }

    @Test
    void getCurrentUser_Successful_ReturnsUser() {
        // Arrange
        when(jwtUtil.extractUsername("jwt-token"))
                .thenReturn("testuser");
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(testUser));

        // Act
        User user = authService.getCurrentUser("jwt-token");

        // Assert
        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("USER", user.getRole());
    }

    @Test
    void getCurrentUser_UserNotFound_ThrowsException() {
        // Arrange
        when(jwtUtil.extractUsername("jwt-token"))
                .thenReturn("testuser");
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.getCurrentUser("jwt-token"));
        assertEquals("User not found", exception.getMessage());
    }
} 