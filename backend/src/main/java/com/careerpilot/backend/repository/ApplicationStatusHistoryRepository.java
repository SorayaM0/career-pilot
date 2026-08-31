package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.ApplicationStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationStatusHistoryRepository
        extends JpaRepository<ApplicationStatusHistory, Long> {

    List<ApplicationStatusHistory>
    findByJobApplicationIdOrderByChangedAtAsc(
            Long jobApplicationId
    );
}