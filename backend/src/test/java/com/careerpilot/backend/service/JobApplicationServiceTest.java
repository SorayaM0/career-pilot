package com.careerpilot.backend.service;

import com.careerpilot.backend.model.JobApplication;
import com.careerpilot.backend.repository.ApplicationStatusHistoryRepository;
import com.careerpilot.backend.repository.JobApplicationRepository;
import com.careerpilot.backend.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import com.careerpilot.backend.model.ApplicationStatusHistory;
import com.careerpilot.backend.model.User;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationStatusHistoryRepository statusHistoryRepository;

    private JobApplicationService jobApplicationService;

    @BeforeEach
    void setUp() {
        jobApplicationService = new JobApplicationService(
                jobApplicationRepository,
                statusHistoryRepository,
                userRepository
        );
    }

    @Test
    void getApplicationsShouldReturnOnlyApplicationsForAuthenticatedUser() {

        String email = "soraya@example.com";

        JobApplication application1 = new JobApplication();
        JobApplication application2 = new JobApplication();

        when(jobApplicationRepository.findByUserEmail(email))
                .thenReturn(List.of(application1, application2));

        List<JobApplication> result =
                jobApplicationService.getApplications(email);

        assertEquals(2, result.size());

        verify(jobApplicationRepository)
                .findByUserEmail(email);
    }

    @Test
    void getApplicationByIdShouldReturnApplicationWhenOwnedByUser() {

        Long applicationId = 1L;
        String email = "soraya@example.com";

        JobApplication application = new JobApplication();

        when(jobApplicationRepository.findByIdAndUserEmail(
                applicationId,
                email
        )).thenReturn(Optional.of(application));

        Optional<JobApplication> result =
                jobApplicationService.getApplicationById(
                        applicationId,
                        email
                );

        assertTrue(result.isPresent());
        assertSame(application, result.get());

        verify(jobApplicationRepository)
                .findByIdAndUserEmail(
                        applicationId,
                        email
                );
    }

    @Test
    void getApplicationByIdShouldNotReturnAnotherUsersApplication() {

        Long applicationId = 1L;
        String otherUserEmail = "other@example.com";

        when(jobApplicationRepository.findByIdAndUserEmail(
                applicationId,
                otherUserEmail
        )).thenReturn(Optional.empty());

        Optional<JobApplication> result =
                jobApplicationService.getApplicationById(
                        applicationId,
                        otherUserEmail
                );

        assertTrue(result.isEmpty());

        verify(jobApplicationRepository)
                .findByIdAndUserEmail(
                        applicationId,
                        otherUserEmail
                );
    }

    @Test
    void deleteApplicationShouldDeleteApplicationWhenOwnedByUser() {

        Long applicationId = 1L;
        String email = "soraya@example.com";

        JobApplication application = new JobApplication();

        when(jobApplicationRepository.findByIdAndUserEmail(
                applicationId,
                email
        )).thenReturn(Optional.of(application));

        boolean result =
                jobApplicationService.deleteApplication(
                        applicationId,
                        email
                );

        assertTrue(result);

        verify(jobApplicationRepository)
                .delete(application);
    }

    @Test
    void deleteApplicationShouldNotDeleteAnotherUsersApplication() {

        Long applicationId = 1L;
        String otherUserEmail = "other@example.com";

        when(jobApplicationRepository.findByIdAndUserEmail(
                applicationId,
                otherUserEmail
        )).thenReturn(Optional.empty());

        boolean result =
                jobApplicationService.deleteApplication(
                        applicationId,
                        otherUserEmail
                );

        assertFalse(result);

        verify(jobApplicationRepository, never())
                .delete(any(JobApplication.class));
    }
    @Test
void createApplicationShouldAssignUserAndCreateStatusHistory() {

    String email = "soraya@example.com";

    User user = new User(
            "Soraya",
            email,
            "hashed-password"
    );

    JobApplication application = new JobApplication();
    application.setCompany("OpenAI");
    application.setPosition("Software Engineer");
    application.setStatus("Applied");

    when(userRepository.findByEmail(email))
            .thenReturn(Optional.of(user));

    when(jobApplicationRepository.save(application))
            .thenReturn(application);

    JobApplication result =
            jobApplicationService.createApplication(
                    application,
                    email
            );

    assertNotNull(result);

    assertSame(
            user,
            result.getUser()
    );

    assertEquals(
            "Applied",
            result.getStatus()
    );

    verify(userRepository)
            .findByEmail(email);

    verify(jobApplicationRepository)
            .save(application);

    verify(statusHistoryRepository)
            .save(any(ApplicationStatusHistory.class));
}
@Test
void updateApplicationShouldCreateStatusHistoryWhenStatusChanges() {

    Long applicationId = 1L;
    String email = "soraya@example.com";

    JobApplication existingApplication = new JobApplication();
    existingApplication.setCompany("OpenAI");
    existingApplication.setPosition("Software Engineer");
    existingApplication.setStatus("Applied");

    JobApplication updatedApplication = new JobApplication();
    updatedApplication.setCompany("OpenAI");
    updatedApplication.setPosition("Software Engineer");
    updatedApplication.setStatus("Interview");

    when(jobApplicationRepository.findByIdAndUserEmail(
            applicationId,
            email
    )).thenReturn(Optional.of(existingApplication));

    when(jobApplicationRepository.save(existingApplication))
            .thenReturn(existingApplication);

    Optional<JobApplication> result =
            jobApplicationService.updateApplication(
                    applicationId,
                    updatedApplication,
                    email
            );

    assertTrue(result.isPresent());

    assertEquals(
            "Interview",
            result.get().getStatus()
    );

    verify(jobApplicationRepository)
            .save(existingApplication);

    verify(statusHistoryRepository)
            .save(any(ApplicationStatusHistory.class));
}


@Test
void updateApplicationShouldNotCreateStatusHistoryWhenStatusDoesNotChange() {

    Long applicationId = 1L;
    String email = "soraya@example.com";

    JobApplication existingApplication = new JobApplication();
    existingApplication.setCompany("Old Company");
    existingApplication.setPosition("Software Engineer");
    existingApplication.setStatus("Applied");

    JobApplication updatedApplication = new JobApplication();
    updatedApplication.setCompany("New Company");
    updatedApplication.setPosition("Software Engineer");
    updatedApplication.setStatus("Applied");

    when(jobApplicationRepository.findByIdAndUserEmail(
            applicationId,
            email
    )).thenReturn(Optional.of(existingApplication));

    when(jobApplicationRepository.save(existingApplication))
            .thenReturn(existingApplication);

    Optional<JobApplication> result =
            jobApplicationService.updateApplication(
                    applicationId,
                    updatedApplication,
                    email
            );

    assertTrue(result.isPresent());

    assertEquals(
            "New Company",
            result.get().getCompany()
    );

    assertEquals(
            "Applied",
            result.get().getStatus()
    );

    verify(jobApplicationRepository)
            .save(existingApplication);

    verify(statusHistoryRepository, never())
            .save(any(ApplicationStatusHistory.class));
}


@Test
void updateApplicationShouldNotUpdateAnotherUsersApplication() {

    Long applicationId = 1L;
    String otherUserEmail = "other@example.com";

    JobApplication updatedApplication = new JobApplication();
    updatedApplication.setCompany("Changed Company");
    updatedApplication.setStatus("Interview");

    when(jobApplicationRepository.findByIdAndUserEmail(
            applicationId,
            otherUserEmail
    )).thenReturn(Optional.empty());

    Optional<JobApplication> result =
            jobApplicationService.updateApplication(
                    applicationId,
                    updatedApplication,
                    otherUserEmail
            );

    assertTrue(result.isEmpty());

    verify(jobApplicationRepository, never())
            .save(any(JobApplication.class));

    verify(statusHistoryRepository, never())
            .save(any(ApplicationStatusHistory.class));
}
}