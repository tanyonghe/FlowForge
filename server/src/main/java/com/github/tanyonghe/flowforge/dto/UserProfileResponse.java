package com.github.tanyonghe.flowforge.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserProfileResponse {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
} 