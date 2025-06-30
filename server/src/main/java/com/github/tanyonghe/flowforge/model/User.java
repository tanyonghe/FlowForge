package com.github.tanyonghe.flowforge.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    @Indexed(unique = true)
    private String email;
    
    private String password; // Will be hashed with BCrypt
    private String role;
    private boolean enabled = true;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private String firstName;
    private String lastName;
    
    // Constructor for new users
    public User(String username, String email, String password, String role) {
        this.username = username;
        this.email = email;
        this.password = password; // Will be hashed before saving
        this.role = role;
        this.enabled = true;
        this.createdAt = LocalDateTime.now();
    }
    
    // Default constructor
    public User() {
        this.createdAt = LocalDateTime.now();
    }
} 