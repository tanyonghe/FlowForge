package com.github.tanyonghe.flowforge.controller;

import com.github.tanyonghe.flowforge.dto.AuthRequest;
import com.github.tanyonghe.flowforge.dto.AuthResponse;
import com.github.tanyonghe.flowforge.model.User;
import com.github.tanyonghe.flowforge.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody AuthRequest request,
            @RequestParam String email,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName) {
        try {
            AuthResponse response = authService.register(request, email, firstName, lastName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        try {
            AuthResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || authHeader.isEmpty()) {
                return ResponseEntity.status(401).build();
            }
            String token = authHeader.replace("Bearer ", "");
            User user = authService.getCurrentUser(token);
            // Don't return password
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
} 