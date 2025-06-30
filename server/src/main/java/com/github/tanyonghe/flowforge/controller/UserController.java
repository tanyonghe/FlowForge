package com.github.tanyonghe.flowforge.controller;

import com.github.tanyonghe.flowforge.dto.UserProfileRequest;
import com.github.tanyonghe.flowforge.dto.UserProfileResponse;
import com.github.tanyonghe.flowforge.model.User;
import com.github.tanyonghe.flowforge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        String username = authentication.getName();
        User user = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateCurrentUserProfile(
            Authentication authentication,
            @RequestBody UserProfileRequest request) {
        
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        String username = authentication.getName();
        User currentUser = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create a user object with updated fields
        User updatedUser = new User();
        updatedUser.setFirstName(request.getFirstName());
        updatedUser.setLastName(request.getLastName());
        updatedUser.setEmail(request.getEmail());
        
        User savedUser = userService.updateUserProfile(currentUser.getId(), updatedUser);
        
        UserProfileResponse response = new UserProfileResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setRole(savedUser.getRole());
        response.setEnabled(savedUser.isEnabled());
        response.setCreatedAt(savedUser.getCreatedAt());
        response.setLastLoginAt(savedUser.getLastLoginAt());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        
        return ResponseEntity.ok(response);
    }
    
    // For testing purposes - get first available user
    @GetMapping("/test/first")
    public ResponseEntity<UserProfileResponse> getFirstUser() {
        // This is just for testing - in production you'd want proper authentication
        User user = userService.getUserById("test-user-id")
            .orElseGet(() -> {
                // Create a test user if none exists
                User testUser = new User("testuser", "test@example.com", "password", "USER");
                testUser.setFirstName("Test");
                testUser.setLastName("User");
                return userService.createUser(testUser);
            });
        
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        
        return ResponseEntity.ok(response);
    }
} 