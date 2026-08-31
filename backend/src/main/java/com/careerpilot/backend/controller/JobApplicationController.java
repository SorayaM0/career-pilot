package com.careerpilot.backend.controller;

import com.careerpilot.backend.dto.ApplicationStatusHistoryDTO;
import com.careerpilot.backend.model.JobApplication;
import com.careerpilot.backend.service.JobApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(
            JobApplicationService service
    ) {
        this.service = service;
    }

    // =========================
    // GET ALL
    // =========================

    @GetMapping
    public List<JobApplication> getApplications(
            Authentication authentication
    ) {
        String email =
                authentication.getName();

        return service.getApplications(email);
    }

    // =========================
    // GET ONE
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication>
    getApplicationById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email =
                authentication.getName();

        Optional<JobApplication> application =
                service.getApplicationById(
                        id,
                        email
                );

        return application
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // =========================
    // CREATE
    // =========================

    @PostMapping
    public JobApplication createApplication(
            @RequestBody JobApplication application,
            Authentication authentication
    ) {
        String email =
                authentication.getName();

        return service.createApplication(
                application,
                email
        );
    }

    // =========================
    // UPDATE
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<JobApplication>
    updateApplication(
            @PathVariable Long id,
            @RequestBody JobApplication updatedApplication,
            Authentication authentication
    ) {
        String email =
                authentication.getName();

        Optional<JobApplication> updated =
                service.updateApplication(
                        id,
                        updatedApplication,
                        email
                );

        return updated
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // =========================
    // DELETE
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email =
                authentication.getName();

        boolean deleted =
                service.deleteApplication(
                        id,
                        email
                );

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity
                .noContent()
                .build();
    }

    // =========================
    // GET STATUS HISTORY
    // =========================

    @GetMapping("/{id}/history")
    public ResponseEntity<List<ApplicationStatusHistoryDTO>>
    getStatusHistory(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email =
                authentication.getName();

        Optional<List<ApplicationStatusHistoryDTO>>
                history =
                service.getStatusHistory(
                        id,
                        email
                );

        return history
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }
}