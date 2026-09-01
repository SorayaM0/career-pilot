package com.careerpilot.backend.controller;

import com.careerpilot.backend.dto.ApplicationStatusHistoryDTO;
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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobApplicationControllerTest {

    @Mock
    private JobApplicationService jobApplicationService;

    @Mock
    private Authentication authentication;

    private JobApplicationController controller;

    @BeforeEach
    void setUp() {
        controller =
                new JobApplicationController(
                        jobApplicationService
                );

        when(authentication.getName())
                .thenReturn("soraya@example.com");
    }

    @Test
    void getApplicationsShouldReturnApplicationsForAuthenticatedUser() {

        JobApplication application =
                new JobApplication();

        when(
                jobApplicationService.getApplications(
                        "soraya@example.com"
                )
        ).thenReturn(List.of(application));

        List<JobApplication> result =
                controller.getApplications(
                        authentication
                );

        assertEquals(1, result.size());

        verify(jobApplicationService)
                .getApplications(
                        "soraya@example.com"
                );
    }

    @Test
    void getApplicationByIdShouldReturnOkWhenApplicationExists() {

        JobApplication application =
                new JobApplication();

        when(
                jobApplicationService.getApplicationById(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(
                Optional.of(application)
        );

        ResponseEntity<JobApplication> response =
                controller.getApplicationById(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                application,
                response.getBody()
        );
    }

    @Test
    void getApplicationByIdShouldReturnNotFoundWhenApplicationDoesNotExist() {

        when(
                jobApplicationService.getApplicationById(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(
                Optional.empty()
        );

        ResponseEntity<JobApplication> response =
                controller.getApplicationById(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );

        assertNull(response.getBody());
    }

    @Test
    void createApplicationShouldUseAuthenticatedUsersEmail() {

        JobApplication application =
                new JobApplication();

        application.setCompany("OpenAI");
        application.setPosition(
                "Software Engineer"
        );

        when(
                jobApplicationService.createApplication(
                        application,
                        "soraya@example.com"
                )
        ).thenReturn(application);

        JobApplication result =
                controller.createApplication(
                        application,
                        authentication
                );

        assertSame(
                application,
                result
        );

        verify(jobApplicationService)
                .createApplication(
                        application,
                        "soraya@example.com"
                );
    }

    @Test
    void updateApplicationShouldReturnOkWhenApplicationExists() {

        JobApplication updatedApplication =
                new JobApplication();

        updatedApplication.setStatus(
                "Interview"
        );

        when(
                jobApplicationService.updateApplication(
                        1L,
                        updatedApplication,
                        "soraya@example.com"
                )
        ).thenReturn(
                Optional.of(updatedApplication)
        );

        ResponseEntity<JobApplication> response =
                controller.updateApplication(
                        1L,
                        updatedApplication,
                        authentication
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                updatedApplication,
                response.getBody()
        );
    }

    @Test
    void updateApplicationShouldReturnNotFoundWhenApplicationDoesNotExist() {

        JobApplication updatedApplication =
                new JobApplication();

        when(
                jobApplicationService.updateApplication(
                        1L,
                        updatedApplication,
                        "soraya@example.com"
                )
        ).thenReturn(
                Optional.empty()
        );

        ResponseEntity<JobApplication> response =
                controller.updateApplication(
                        1L,
                        updatedApplication,
                        authentication
                );

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );
    }

    @Test
    void deleteApplicationShouldReturnNoContentWhenDeleteSucceeds() {

        when(
                jobApplicationService.deleteApplication(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(true);

        ResponseEntity<Void> response =
                controller.deleteApplication(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.NO_CONTENT,
                response.getStatusCode()
        );

        verify(jobApplicationService)
                .deleteApplication(
                        1L,
                        "soraya@example.com"
                );
    }

    @Test
    void deleteApplicationShouldReturnNotFoundWhenApplicationDoesNotExist() {

        when(
                jobApplicationService.deleteApplication(
                        1L,
                        "soraya@example.com"
                )
        ).thenReturn(false);

        ResponseEntity<Void> response =
                controller.deleteApplication(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );
    }
    @Test
void getStatusHistoryShouldReturnOkWhenApplicationExists() {

    Long applicationId = 1L;

    when(
            jobApplicationService.getStatusHistory(
                    applicationId,
                    "soraya@example.com"
            )
    ).thenReturn(
            Optional.of(List.of())
    );

    ResponseEntity<List<ApplicationStatusHistoryDTO>> response =
            controller.getStatusHistory(
                    applicationId,
                    authentication
            );

    assertEquals(
            HttpStatus.OK,
            response.getStatusCode()
    );

    assertNotNull(response.getBody());

    verify(jobApplicationService)
            .getStatusHistory(
                    applicationId,
                    "soraya@example.com"
            );
}


@Test
void getStatusHistoryShouldReturnNotFoundWhenApplicationDoesNotExist() {

    Long applicationId = 1L;

    when(
            jobApplicationService.getStatusHistory(
                    applicationId,
                    "soraya@example.com"
            )
    ).thenReturn(
            Optional.empty()
    );

    ResponseEntity<List<ApplicationStatusHistoryDTO>> response =
            controller.getStatusHistory(
                    applicationId,
                    authentication
            );

    assertEquals(
            HttpStatus.NOT_FOUND,
            response.getStatusCode()
    );

    verify(jobApplicationService)
            .getStatusHistory(
                    applicationId,
                    "soraya@example.com"
            );
}
}