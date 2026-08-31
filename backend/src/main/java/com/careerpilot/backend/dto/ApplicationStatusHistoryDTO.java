package com.careerpilot.backend.dto;

import java.time.LocalDateTime;

public class ApplicationStatusHistoryDTO {

    private Long id;
    private String status;
    private LocalDateTime changedAt;

    public ApplicationStatusHistoryDTO(
            Long id,
            String status,
            LocalDateTime changedAt
    ) {
        this.id = id;
        this.status = status;
        this.changedAt = changedAt;
    }

    public Long getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }
}