package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.JobApplication;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserEmail(String email);

    Optional<JobApplication> findByIdAndUserEmail(
            Long id,
            String email
    );
}