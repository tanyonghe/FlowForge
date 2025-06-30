package com.github.tanyonghe.flowforge.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "testSecretKeyThatIsLongEnoughForHS256Algorithm");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L); // 24 hours
        ReflectionTestUtils.setField(jwtUtil, "refreshExpiration", 604800000L); // 7 days
    }

    @Test
    void generateToken_ValidInput_ReturnsValidToken() {
        // Act
        String token = jwtUtil.generateToken("testuser", "USER");

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void generateRefreshToken_ValidInput_ReturnsValidToken() {
        // Act
        String token = jwtUtil.generateRefreshToken("testuser");

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void extractUsername_ValidToken_ReturnsUsername() {
        // Arrange
        String token = jwtUtil.generateToken("testuser", "USER");

        // Act
        String username = jwtUtil.extractUsername(token);

        // Assert
        assertEquals("testuser", username);
    }

    @Test
    void extractUsername_InvalidToken_ThrowsException() {
        // Act & Assert
        assertThrows(Exception.class, () -> jwtUtil.extractUsername("invalid.token.here"));
    }

    @Test
    void extractRole_ValidToken_ReturnsRole() {
        // Arrange
        String token = jwtUtil.generateToken("testuser", "ADMIN");

        // Act
        String role = jwtUtil.extractRole(token);

        // Assert
        assertEquals("ADMIN", role);
    }

    @Test
    void extractExpiration_ValidToken_ReturnsExpirationDate() {
        // Arrange
        String token = jwtUtil.generateToken("testuser", "USER");

        // Act
        Date expiration = jwtUtil.extractExpiration(token);

        // Assert
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date())); // Should be in the future
    }

    @Test
    void validateToken_ValidToken_ReturnsTrue() {
        // Arrange
        String token = jwtUtil.generateToken("testuser", "USER");

        // Act
        Boolean isValid = jwtUtil.validateToken(token, "testuser");

        // Assert
        assertTrue(isValid);
    }

    @Test
    void validateToken_InvalidUsername_ReturnsFalse() {
        // Arrange
        String token = jwtUtil.generateToken("testuser", "USER");

        // Act
        Boolean isValid = jwtUtil.validateToken(token, "wronguser");

        // Assert
        assertFalse(isValid);
    }

    @Test
    void validateToken_InvalidToken_ReturnsFalse() {
        // Act & Assert
        assertThrows(Exception.class, () -> jwtUtil.validateToken("invalid.token.here", "testuser"));
    }

    @Test
    void generateToken_DifferentRoles_GenerateDifferentTokens() {
        // Act
        String userToken = jwtUtil.generateToken("testuser", "USER");
        String adminToken = jwtUtil.generateToken("testuser", "ADMIN");

        // Assert
        assertNotEquals(userToken, adminToken);
    }

    @Test
    void generateToken_DifferentUsernames_GenerateDifferentTokens() {
        // Act
        String user1Token = jwtUtil.generateToken("user1", "USER");
        String user2Token = jwtUtil.generateToken("user2", "USER");

        // Assert
        assertNotEquals(user1Token, user2Token);
    }
} 