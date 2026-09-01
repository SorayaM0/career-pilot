package com.careerpilot.backend.controller;

import com.careerpilot.backend.dto.LoginRequest;
import com.careerpilot.backend.dto.RegisterRequest;
import com.careerpilot.backend.model.User;
import com.careerpilot.backend.service.AuthService;
import com.careerpilot.backend.service.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private JwtService jwtService;

    private AuthController authController;

    @BeforeEach
    void setUp() {
        authController = new AuthController(
                authService,
                jwtService
        );
    }

    @Test
    void registerShouldReturnCreatedWhenRegistrationSucceeds() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Soraya");
        request.setEmail("soraya@example.com");
        request.setPassword("password123");

        User user = mock(User.class);

        when(user.getId())
                .thenReturn(1L);

        when(user.getName())
                .thenReturn("Soraya");

        when(user.getEmail())
                .thenReturn("soraya@example.com");

        when(authService.register(request))
                .thenReturn(user);

        ResponseEntity<?> response =
                authController.register(request);

        assertEquals(
                HttpStatus.CREATED,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        Map<String, Object> body =
                (Map<String, Object>) response.getBody();

        assertEquals(
                1L,
                body.get("id")
        );

        assertEquals(
                "Soraya",
                body.get("name")
        );

        assertEquals(
                "soraya@example.com",
                body.get("email")
        );

        assertFalse(
                body.containsKey("password")
        );

        verify(authService)
                .register(request);
    }

    @Test
    void registerShouldReturnBadRequestWhenEmailAlreadyExists() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Soraya");
        request.setEmail("soraya@example.com");
        request.setPassword("password123");

        when(authService.register(request))
                .thenThrow(
                        new IllegalArgumentException(
                                "An account with this email already exists."
                        )
                );

        ResponseEntity<?> response =
                authController.register(request);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> body =
                (Map<String, Object>) response.getBody();

        assertNotNull(body);

        assertEquals(
                "An account with this email already exists.",
                body.get("message")
        );

        verify(authService)
                .register(request);
    }

    @Test
    void loginShouldReturnTokenWhenCredentialsAreCorrect() {

        LoginRequest request = new LoginRequest();
        request.setEmail("soraya@example.com");
        request.setPassword("password123");

        User user = mock(User.class);

        when(user.getId())
                .thenReturn(1L);

        when(user.getName())
                .thenReturn("Soraya");

        when(user.getEmail())
                .thenReturn("soraya@example.com");

        when(authService.login(request))
                .thenReturn(user);

        when(
                jwtService.generateToken(
                        "soraya@example.com"
                )
        ).thenReturn("test-jwt-token");

        ResponseEntity<?> response =
                authController.login(request);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> body =
                (Map<String, Object>) response.getBody();

        assertNotNull(body);

        assertEquals(
                1L,
                body.get("id")
        );

        assertEquals(
                "Soraya",
                body.get("name")
        );

        assertEquals(
                "soraya@example.com",
                body.get("email")
        );

        assertEquals(
                "test-jwt-token",
                body.get("token")
        );

        assertFalse(
                body.containsKey("password")
        );

        verify(authService)
                .login(request);

        verify(jwtService)
                .generateToken(
                        "soraya@example.com"
                );
    }

    @Test
    void loginShouldReturnUnauthorizedWhenCredentialsAreIncorrect() {

        LoginRequest request = new LoginRequest();
        request.setEmail("soraya@example.com");
        request.setPassword("wrong-password");

        when(authService.login(request))
                .thenThrow(
                        new IllegalArgumentException(
                                "Invalid email or password."
                        )
                );

        ResponseEntity<?> response =
                authController.login(request);

        assertEquals(
                HttpStatus.UNAUTHORIZED,
                response.getStatusCode()
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> body =
                (Map<String, Object>) response.getBody();

        assertNotNull(body);

        assertEquals(
                "Invalid email or password.",
                body.get("message")
        );

        verify(authService)
                .login(request);

        verify(jwtService, never())
                .generateToken(anyString());
    }
}