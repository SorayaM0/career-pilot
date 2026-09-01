package com.careerpilot.backend.ai;

import com.careerpilot.backend.model.JobApplication;
import com.careerpilot.backend.service.JobApplicationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AIControllerTest {

    @Mock
    private AIService aiService;

    @Mock
    private JobApplicationService jobApplicationService;

    @Mock
    private Authentication authentication;

    private AIController controller;

    @BeforeEach
    void setUp() {

        controller = new AIController(
                aiService,
                jobApplicationService
        );

        when(authentication.getName())
                .thenReturn("soraya@example.com");
    }

    @Test
    void analyzeApplicationShouldReturnNotFoundWhenApplicationDoesNotExist() {

        when(
                jobApplicationService.getApplicationById(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(Optional.empty());

        ResponseEntity<?> response =
                controller.analyzeApplication(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );

        verify(jobApplicationService)
                .getApplicationById(
                        1L,
                        "soraya@example.com"
                );

        verifyNoInteractions(aiService);
    }

    @Test
    void analyzeApplicationShouldReturnBadRequestWhenJobDescriptionIsMissing() {

        JobApplication application =
                new JobApplication();

        application.setCompany("OpenAI");
        application.setPosition("Software Engineer");
        application.setJobDescription(null);

        when(
                jobApplicationService.getApplicationById(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(
                Optional.of(application)
        );

        ResponseEntity<?> response =
                controller.analyzeApplication(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        verifyNoInteractions(aiService);
    }

    @Test
    void analyzeApplicationShouldReturnBadRequestWhenJobDescriptionIsBlank() {

        JobApplication application =
                new JobApplication();

        application.setCompany("OpenAI");
        application.setPosition("Software Engineer");
        application.setJobDescription("   ");

        when(
                jobApplicationService.getApplicationById(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(
                Optional.of(application)
        );

        ResponseEntity<?> response =
                controller.analyzeApplication(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        verifyNoInteractions(aiService);
    }

    @Test
    void analyzeApplicationShouldReturnOkWhenAnalysisSucceeds() {

        JobApplication application =
                new JobApplication();

        application.setCompany("OpenAI");
        application.setPosition("Software Engineer");
        application.setJobDescription(
                "Build scalable backend systems using Java."
        );

        when(
                jobApplicationService.getApplicationById(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(
                Optional.of(application)
        );

        when(
                aiService.analyzeJobDescription(
                        "OpenAI",
                        "Software Engineer",
                        "Build scalable backend systems using Java."
                )
        ).thenReturn(
                "Strong match for backend engineering."
        );

        ResponseEntity<?> response =
                controller.analyzeApplication(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertNotNull(
                response.getBody()
        );

        verify(aiService)
                .analyzeJobDescription(
                        "OpenAI",
                        "Software Engineer",
                        "Build scalable backend systems using Java."
                );
    }

    @Test
    void analyzeApplicationShouldReturnBadGatewayWhenAIServiceFails() {

        JobApplication application =
                new JobApplication();

        application.setCompany("OpenAI");
        application.setPosition("Software Engineer");
        application.setJobDescription(
                "Build scalable backend systems using Java."
        );

        when(
                jobApplicationService.getApplicationById(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(
                Optional.of(application)
        );

        when(
                aiService.analyzeJobDescription(
                        "OpenAI",
                        "Software Engineer",
                        "Build scalable backend systems using Java."
                )
        ).thenThrow(
                new RuntimeException(
                        "OpenAI unavailable"
                )
        );

        ResponseEntity<?> response =
                controller.analyzeApplication(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.BAD_GATEWAY,
                response.getStatusCode()
        );

        assertNotNull(
                response.getBody()
        );

        verify(aiService)
                .analyzeJobDescription(
                        "OpenAI",
                        "Software Engineer",
                        "Build scalable backend systems using Java."
                );
    }
}