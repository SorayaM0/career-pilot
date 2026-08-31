package com.careerpilot.backend.service;

import com.careerpilot.backend.dto.LoginRequest;
import com.careerpilot.backend.dto.RegisterRequest;
import com.careerpilot.backend.model.User;
import com.careerpilot.backend.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                passwordEncoder
        );
    }

    @Test
    void registerShouldCreateUserWhenEmailDoesNotExist() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Soraya");
        request.setEmail("soraya@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("soraya@example.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("password123"))
                .thenReturn("hashed-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = authService.register(request);

        assertNotNull(result);
        assertEquals("Soraya", result.getName());
        assertEquals("soraya@example.com", result.getEmail());
        assertEquals("hashed-password", result.getPassword());

        verify(userRepository)
                .existsByEmail("soraya@example.com");

        verify(passwordEncoder)
                .encode("password123");

        verify(userRepository)
                .save(any(User.class));
    }

    @Test
    void registerShouldRejectDuplicateEmail() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Soraya");
        request.setEmail("soraya@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("soraya@example.com"))
                .thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> authService.register(request)
                );

        assertEquals(
                "An account with this email already exists.",
                exception.getMessage()
        );

        verify(userRepository, never())
                .save(any(User.class));

        verify(passwordEncoder, never())
                .encode(anyString());
    }

    @Test
    void loginShouldReturnUserWhenCredentialsAreCorrect() {

        LoginRequest request = new LoginRequest();
        request.setEmail("soraya@example.com");
        request.setPassword("password123");

        User existingUser = new User(
                "Soraya",
                "soraya@example.com",
                "hashed-password"
        );

        when(userRepository.findByEmail("soraya@example.com"))
                .thenReturn(Optional.of(existingUser));

        when(
                passwordEncoder.matches(
                        "password123",
                        "hashed-password"
                )
        ).thenReturn(true);

        User result = authService.login(request);

        assertNotNull(result);
        assertEquals(
                "soraya@example.com",
                result.getEmail()
        );

        verify(passwordEncoder).matches(
                "password123",
                "hashed-password"
        );
    }

    @Test
    void loginShouldRejectIncorrectPassword() {

        LoginRequest request = new LoginRequest();
        request.setEmail("soraya@example.com");
        request.setPassword("wrong-password");

        User existingUser = new User(
                "Soraya",
                "soraya@example.com",
                "hashed-password"
        );

        when(userRepository.findByEmail("soraya@example.com"))
                .thenReturn(Optional.of(existingUser));

        when(
                passwordEncoder.matches(
                        "wrong-password",
                        "hashed-password"
                )
        ).thenReturn(false);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> authService.login(request)
                );

        assertEquals(
                "Invalid email or password.",
                exception.getMessage()
        );
    }
}