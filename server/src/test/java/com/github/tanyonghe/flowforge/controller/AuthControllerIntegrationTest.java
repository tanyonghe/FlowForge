package com.github.tanyonghe.flowforge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tanyonghe.flowforge.dto.AuthRequest;
import com.github.tanyonghe.flowforge.model.User;
import com.github.tanyonghe.flowforge.repository.UserRepository;
import com.github.tanyonghe.flowforge.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        userRepository.deleteAll();
    }

    @Test
    void login_ValidCredentials_ReturnsAuthResponse() throws Exception {
        // Arrange
        User user = new User("testuser", "test@example.com", passwordEncoder.encode("password123"), "USER");
        userRepository.save(user);

        AuthRequest request = new AuthRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void login_InvalidCredentials_ReturnsBadRequest() throws Exception {
        // Arrange
        AuthRequest request = new AuthRequest();
        request.setUsername("nonexistent");
        request.setPassword("wrongpassword");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_EmptyRequest_ReturnsBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_ValidData_ReturnsAuthResponse() throws Exception {
        // Arrange
        AuthRequest request = new AuthRequest();
        request.setUsername("newuser");
        request.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .param("email", "new@example.com")
                .param("firstName", "John")
                .param("lastName", "Doe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.email").value("new@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void register_DuplicateUsername_ReturnsBadRequest() throws Exception {
        // Arrange
        User existingUser = new User("existinguser", "existing@example.com", passwordEncoder.encode("password123"), "USER");
        userRepository.save(existingUser);

        AuthRequest request = new AuthRequest();
        request.setUsername("existinguser");
        request.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .param("email", "new@example.com"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_DuplicateEmail_ReturnsBadRequest() throws Exception {
        // Arrange
        User existingUser = new User("existinguser", "existing@example.com", passwordEncoder.encode("password123"), "USER");
        userRepository.save(existingUser);

        AuthRequest request = new AuthRequest();
        request.setUsername("newuser");
        request.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .param("email", "existing@example.com"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void refreshToken_ValidToken_ReturnsNewTokens() throws Exception {
        // Arrange
        User user = new User("testuser", "test@example.com", passwordEncoder.encode("password123"), "USER");
        userRepository.save(user);

        AuthRequest loginRequest = new AuthRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        String loginResponse = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String refreshToken = objectMapper.readTree(loginResponse).get("refreshToken").asText();

        // Act & Assert
        mockMvc.perform(post("/api/auth/refresh")
                .param("refreshToken", refreshToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void refreshToken_InvalidToken_ReturnsBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/refresh")
                .param("refreshToken", "invalid-token"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getCurrentUser_ValidToken_ReturnsUser() throws Exception {
        // Arrange
        User user = new User("testuser", "test@example.com", passwordEncoder.encode("password123"), "USER");
        userRepository.save(user);

        AuthRequest loginRequest = new AuthRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        String loginResponse = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(loginResponse).get("token").asText();

        // Act & Assert
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.password").doesNotExist()); // Password should not be returned
    }

    @Test
    void getCurrentUser_InvalidToken_ReturnsUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().is(401));
    }

    @Test
    void getCurrentUser_NoToken_ReturnsUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().is(401));
    }
} 