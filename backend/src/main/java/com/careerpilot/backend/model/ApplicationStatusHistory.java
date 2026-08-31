package com.careerpilot.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "application_status_history")
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private LocalDateTime changedAt;

    @ManyToOne
    @JoinColumn(name = "job_application_id")
    private JobApplication jobApplication;

    public ApplicationStatusHistory() {
    }

    public ApplicationStatusHistory(
            String status,
            LocalDateTime changedAt,
            JobApplication jobApplication
    ) {
        this.status = status;
        this.changedAt = changedAt;
        this.jobApplication = jobApplication;
    }

    public Long getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public JobApplication getJobApplication() {
        return jobApplication;
    }

    public void setJobApplication(
            JobApplication jobApplication
    ) {
        this.jobApplication = jobApplication;
    }
}