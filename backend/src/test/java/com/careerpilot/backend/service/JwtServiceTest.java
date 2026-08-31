package com.careerpilot.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {

        String testSecret =
                "career-pilot-test-secret-key-123456789";

        String base64Secret =
                Base64.getEncoder().encodeToString(
                        testSecret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );

        jwtService = new JwtService(base64Secret);
    }

    @Test
    void generateTokenShouldCreateToken() {

        String email = "soraya@example.com";

        String token =
                jwtService.generateToken(email);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void extractEmailShouldReturnEmailFromToken() {

        String email = "soraya@example.com";

        String token =
                jwtService.generateToken(email);

        String extractedEmail =
                jwtService.extractEmail(token);

        assertEquals(
                email,
                extractedEmail
        );
    }

    @Test
    void generatedTokenShouldBeValid() {

        String token =
                jwtService.generateToken(
                        "soraya@example.com"
                );

        assertTrue(
                jwtService.isTokenValid(token)
        );
    }

    @Test
    void invalidTokenShouldBeRejected() {

        String invalidToken =
                "this-is-not-a-valid-jwt";

        assertFalse(
                jwtService.isTokenValid(invalidToken)
        );
    }

    @Test
    void tokenSignedWithDifferentSecretShouldBeRejected() {

        String otherSecret =
                "different-test-secret-key-123456789012";

        String otherBase64Secret =
                Base64.getEncoder().encodeToString(
                        otherSecret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );

        JwtService otherJwtService =
                new JwtService(otherBase64Secret);

        String token =
                otherJwtService.generateToken(
                        "attacker@example.com"
                );

        assertFalse(
                jwtService.isTokenValid(token)
        );
    }
}