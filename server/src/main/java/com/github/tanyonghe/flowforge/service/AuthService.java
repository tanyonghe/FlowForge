package com.github.tanyonghe.flowforge.service;

import com.github.tanyonghe.flowforge.dto.AuthRequest;
import com.github.tanyonghe.flowforge.dto.AuthResponse;
import com.github.tanyonghe.flowforge.model.User;
import com.github.tanyonghe.flowforge.repository.UserRepository;
import com.github.tanyonghe.flowforge.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public AuthResponse login(AuthRequest request) {
        // Try to find user by username or email
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }
        
        User user = userOpt.get();
        
        // Check if user is enabled
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Update last login
        userService.updateLastLogin(user.getUsername());
        
        // Generate tokens
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        
        return new AuthResponse(
            token,
            refreshToken,
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            86400000L // 24 hours
        );
    }
    
    public AuthResponse register(AuthRequest request, String email, String firstName, String lastName) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User(
            request.getUsername(),
            email,
            passwordEncoder.encode(request.getPassword()),
            "USER" // Default role
        );
        
        user.setFirstName(firstName);
        user.setLastName(lastName);
        
        userService.createUser(user);
        
        // Generate tokens
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        
        return new AuthResponse(
            token,
            refreshToken,
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            86400000L // 24 hours
        );
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        try {
            String username = jwtUtil.extractUsername(refreshToken);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                throw new RuntimeException("Invalid refresh token");
            }
            
            User user = userOpt.get();
            
            // Generate new tokens
            String newToken = jwtUtil.generateToken(user.getUsername(), user.getRole());
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getUsername());
            
            return new AuthResponse(
                newToken,
                newRefreshToken,
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                86400000L // 24 hours
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid refresh token");
        }
    }
    
    public User getCurrentUser(String token) {
        String username = jwtUtil.extractUsername(token);
        return userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
} 