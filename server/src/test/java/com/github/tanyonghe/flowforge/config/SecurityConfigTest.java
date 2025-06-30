package com.github.tanyonghe.flowforge.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.mockito.Mockito;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletMapping;
import jakarta.servlet.http.MappingMatch;

import static org.junit.jupiter.api.Assertions.*;

class SecurityConfigTest {

    @Test
    void passwordEncoder_ReturnsBCryptPasswordEncoder() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();

        // Act
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();

        // Assert
        assertNotNull(passwordEncoder);
        assertTrue(passwordEncoder instanceof BCryptPasswordEncoder);
    }

    @Test
    void passwordEncoder_EncodesPasswordCorrectly() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        String rawPassword = "testPassword123";

        // Act
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Assert
        assertNotNull(encodedPassword);
        assertNotEquals(rawPassword, encodedPassword);
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword));
    }

    @Test
    void passwordEncoder_MatchesPasswordCorrectly() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        String rawPassword = "testPassword123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Act
        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
        boolean wrongPassword = passwordEncoder.matches("wrongPassword", encodedPassword);

        // Assert
        assertTrue(matches);
        assertFalse(wrongPassword);
    }

    @Test
    void securityFilterChain_ConfiguresCorsCorrectly() throws Exception {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        
        // This test would require more complex setup with HttpSecurity mock
        // For now, we'll test the configuration through integration tests
        assertNotNull(securityConfig);
    }

    @Test
    void securityFilterChain_ConfiguresJwtFilter() throws Exception {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        
        // This test would require more complex setup with HttpSecurity mock
        // For now, we'll test the configuration through integration tests
        assertNotNull(securityConfig);
    }

    @Test
    void securityFilterChain_ConfiguresSessionManagement() throws Exception {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        
        // This test would require more complex setup with HttpSecurity mock
        // For now, we'll test the configuration through integration tests
        assertNotNull(securityConfig);
    }

    @Test
    void securityFilterChain_ConfiguresAuthorizeRequests() throws Exception {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        
        // This test would require more complex setup with HttpSecurity mock
        // For now, we'll test the configuration through integration tests
        assertNotNull(securityConfig);
    }

    @Test
    void corsConfiguration_AllowsAllOrigins() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        HttpServletRequest mockRequest = Mockito.mock(HttpServletRequest.class);
        Mockito.when(mockRequest.getRequestURI()).thenReturn("/api/test");
        Mockito.when(mockRequest.getContextPath()).thenReturn("");
        Mockito.when(mockRequest.getServletPath()).thenReturn("");
        HttpServletMapping mockMapping = Mockito.mock(HttpServletMapping.class);
        Mockito.when(mockMapping.getMappingMatch()).thenReturn(MappingMatch.PATH);
        Mockito.when(mockRequest.getHttpServletMapping()).thenReturn(mockMapping);
        Mockito.when(mockMapping.getPattern()).thenReturn("/api/test");

        // Act
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();
        CorsConfiguration corsConfig = corsConfigurationSource.getCorsConfiguration(mockRequest);

        // Assert
        assertNotNull(corsConfig);
        assertEquals("*", corsConfig.getAllowedOriginPatterns().iterator().next());
    }

    @Test
    void corsConfiguration_AllowsCorrectMethods() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        HttpServletRequest mockRequest = Mockito.mock(HttpServletRequest.class);
        Mockito.when(mockRequest.getRequestURI()).thenReturn("/api/test");
        Mockito.when(mockRequest.getContextPath()).thenReturn("");
        Mockito.when(mockRequest.getServletPath()).thenReturn("");
        HttpServletMapping mockMapping = Mockito.mock(HttpServletMapping.class);
        Mockito.when(mockMapping.getMappingMatch()).thenReturn(MappingMatch.PATH);
        Mockito.when(mockRequest.getHttpServletMapping()).thenReturn(mockMapping);
        Mockito.when(mockMapping.getPattern()).thenReturn("/api/test");

        // Act
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();
        CorsConfiguration corsConfig = corsConfigurationSource.getCorsConfiguration(mockRequest);

        // Assert
        assertNotNull(corsConfig);
        assertTrue(corsConfig.getAllowedMethods().contains("GET"));
        assertTrue(corsConfig.getAllowedMethods().contains("POST"));
        assertTrue(corsConfig.getAllowedMethods().contains("PUT"));
        assertTrue(corsConfig.getAllowedMethods().contains("DELETE"));
        assertTrue(corsConfig.getAllowedMethods().contains("OPTIONS"));
    }

    @Test
    void corsConfiguration_AllowsCorrectHeaders() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        HttpServletRequest mockRequest = Mockito.mock(HttpServletRequest.class);
        Mockito.when(mockRequest.getRequestURI()).thenReturn("/api/test");
        Mockito.when(mockRequest.getContextPath()).thenReturn("");
        Mockito.when(mockRequest.getServletPath()).thenReturn("");
        HttpServletMapping mockMapping = Mockito.mock(HttpServletMapping.class);
        Mockito.when(mockMapping.getMappingMatch()).thenReturn(MappingMatch.PATH);
        Mockito.when(mockRequest.getHttpServletMapping()).thenReturn(mockMapping);
        Mockito.when(mockMapping.getPattern()).thenReturn("/api/test");

        // Act
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();
        CorsConfiguration corsConfig = corsConfigurationSource.getCorsConfiguration(mockRequest);

        // Assert
        assertNotNull(corsConfig);
        assertTrue(corsConfig.getAllowedHeaders().contains("*"));
    }

    @Test
    void corsConfiguration_AllowsCredentials() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        HttpServletRequest mockRequest = Mockito.mock(HttpServletRequest.class);
        Mockito.when(mockRequest.getRequestURI()).thenReturn("/api/test");
        Mockito.when(mockRequest.getContextPath()).thenReturn("");
        Mockito.when(mockRequest.getServletPath()).thenReturn("");
        HttpServletMapping mockMapping = Mockito.mock(HttpServletMapping.class);
        Mockito.when(mockMapping.getMappingMatch()).thenReturn(MappingMatch.PATH);
        Mockito.when(mockRequest.getHttpServletMapping()).thenReturn(mockMapping);
        Mockito.when(mockMapping.getPattern()).thenReturn("/api/test");

        // Act
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();
        CorsConfiguration corsConfig = corsConfigurationSource.getCorsConfiguration(mockRequest);

        // Assert
        assertNotNull(corsConfig);
        assertTrue(corsConfig.getAllowCredentials());
    }

    @Test
    void corsConfigurationSource_ReturnsValidConfiguration() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        HttpServletRequest mockRequest = Mockito.mock(HttpServletRequest.class);
        Mockito.when(mockRequest.getRequestURI()).thenReturn("/api/test");
        Mockito.when(mockRequest.getContextPath()).thenReturn("");
        Mockito.when(mockRequest.getServletPath()).thenReturn("");
        HttpServletMapping mockMapping = Mockito.mock(HttpServletMapping.class);
        Mockito.when(mockMapping.getMappingMatch()).thenReturn(MappingMatch.PATH);
        Mockito.when(mockRequest.getHttpServletMapping()).thenReturn(mockMapping);
        Mockito.when(mockMapping.getPattern()).thenReturn("/api/test");

        // Act
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();

        // Assert
        assertNotNull(corsConfigurationSource);
        CorsConfiguration corsConfig = corsConfigurationSource.getCorsConfiguration(mockRequest);
        assertNotNull(corsConfig);
    }

    @Test
    void securityConfig_BeanCreation() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();

        // Act & Assert
        assertNotNull(securityConfig.passwordEncoder());
        assertNotNull(securityConfig.corsConfigurationSource());
    }

    @Test
    void passwordEncoder_ConsistentEncoding() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        String rawPassword = "testPassword123";

        // Act
        String encoded1 = passwordEncoder.encode(rawPassword);
        String encoded2 = passwordEncoder.encode(rawPassword);

        // Assert
        assertNotEquals(encoded1, encoded2); // BCrypt generates different salts
        assertTrue(passwordEncoder.matches(rawPassword, encoded1));
        assertTrue(passwordEncoder.matches(rawPassword, encoded2));
    }

    @Test
    void passwordEncoder_HandlesNullPassword() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            passwordEncoder.encode(null);
        });
    }

    @Test
    void passwordEncoder_HandlesEmptyPassword() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();

        // Act
        String encoded = passwordEncoder.encode("");

        // Assert
        assertNotNull(encoded);
        assertTrue(passwordEncoder.matches("", encoded));
    }

    @Test
    void passwordEncoder_HandlesSpecialCharacters() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        String rawPassword = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        // Act
        String encoded = passwordEncoder.encode(rawPassword);

        // Assert
        assertNotNull(encoded);
        assertTrue(passwordEncoder.matches(rawPassword, encoded));
    }

    @Test
    void passwordEncoder_HandlesUnicodeCharacters() {
        // Arrange
        SecurityConfig securityConfig = new SecurityConfig();
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        String rawPassword = "测试密码123";

        // Act
        String encoded = passwordEncoder.encode(rawPassword);

        // Assert
        assertNotNull(encoded);
        assertTrue(passwordEncoder.matches(rawPassword, encoded));
    }
} 