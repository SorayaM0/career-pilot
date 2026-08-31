package com.careerpilot.backend.service;

import com.careerpilot.backend.dto.ApplicationStatusHistoryDTO;
import com.careerpilot.backend.model.ApplicationStatusHistory;
import com.careerpilot.backend.model.JobApplication;
import com.careerpilot.backend.model.User;
import com.careerpilot.backend.repository.ApplicationStatusHistoryRepository;
import com.careerpilot.backend.repository.JobApplicationRepository;
import com.careerpilot.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public JobApplicationService(
            JobApplicationRepository repository,
            ApplicationStatusHistoryRepository historyRepository,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    public List<JobApplication> getApplications(
            String email
    ) {
        return repository.findByUserEmail(email);
    }

    public Optional<JobApplication> getApplicationById(
            Long id,
            String email
    ) {
        return repository.findByIdAndUserEmail(
                id,
                email
        );
    }

    public JobApplication createApplication(
            JobApplication application,
            String email
    ) {
        User user = getUserByEmail(email);

        application.setUser(user);

        JobApplication savedApplication =
                repository.save(application);

        ApplicationStatusHistory history =
                new ApplicationStatusHistory(
                        savedApplication.getStatus(),
                        LocalDateTime.now(),
                        savedApplication
                );

        historyRepository.save(history);

        return savedApplication;
    }

    public Optional<JobApplication> updateApplication(
            Long id,
            JobApplication updatedApplication,
            String email
    ) {
        Optional<JobApplication> existing =
                repository.findByIdAndUserEmail(
                        id,
                        email
                );

        if (existing.isEmpty()) {
            return Optional.empty();
        }

        JobApplication application =
                existing.get();

        String oldStatus =
                application.getStatus();

        application.setCompany(
                updatedApplication.getCompany()
        );

        application.setPosition(
                updatedApplication.getPosition()
        );

        application.setLocation(
                updatedApplication.getLocation()
        );

        application.setStatus(
                updatedApplication.getStatus()
        );

        application.setJobUrl(
                updatedApplication.getJobUrl()
        );

        application.setDateApplied(
                updatedApplication.getDateApplied()
        );

        application.setJobDescription(
                updatedApplication.getJobDescription()
        );

        JobApplication saved =
                repository.save(application);

        if (
                oldStatus == null ||
                !oldStatus.equals(saved.getStatus())
        ) {
            ApplicationStatusHistory history =
                    new ApplicationStatusHistory(
                            saved.getStatus(),
                            LocalDateTime.now(),
                            saved
                    );

            historyRepository.save(history);
        }

        return Optional.of(saved);
    }

    public boolean deleteApplication(
            Long id,
            String email
    ) {
        Optional<JobApplication> application =
                repository.findByIdAndUserEmail(
                        id,
                        email
                );

        if (application.isEmpty()) {
            return false;
        }

        repository.delete(application.get());

        return true;
    }

    public Optional<List<ApplicationStatusHistoryDTO>>
    getStatusHistory(
            Long id,
            String email
    ) {
        Optional<JobApplication> application =
                repository.findByIdAndUserEmail(
                        id,
                        email
                );

        if (application.isEmpty()) {
            return Optional.empty();
        }

        List<ApplicationStatusHistoryDTO> history =
                historyRepository
                        .findByJobApplicationIdOrderByChangedAtAsc(id)
                        .stream()
                        .map(item ->
                                new ApplicationStatusHistoryDTO(
                                        item.getId(),
                                        item.getStatus(),
                                        item.getChangedAt()
                                )
                        )
                        .toList();

        return Optional.of(history);
    }

    private User getUserByEmail(String email) {
        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated user not found."
                        )
                );
    }
}