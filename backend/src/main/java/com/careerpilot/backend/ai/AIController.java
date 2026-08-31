package com.careerpilot.backend.ai;

import com.careerpilot.backend.model.JobApplication;
import com.careerpilot.backend.service.JobApplicationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final AIService aiService;

    private final JobApplicationService
            jobApplicationService;


    public AIController(
            AIService aiService,
            JobApplicationService jobApplicationService
    ) {

        this.aiService = aiService;

        this.jobApplicationService =
                jobApplicationService;
    }


    @PostMapping(
            "/applications/{id}/analyze"
    )
    public ResponseEntity<?> analyzeApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        Optional<JobApplication> application =
                jobApplicationService
                        .getApplicationById(
                                id,
                                email
                        );


        if (application.isEmpty()) {

            return ResponseEntity
                    .status(
                            HttpStatus.NOT_FOUND
                    )
                    .body(
                            new ErrorResponse(
                                    "Application not found."
                            )
                    );
        }


        JobApplication jobApplication =
                application.get();


        if (
                jobApplication
                        .getJobDescription() == null ||
                jobApplication
                        .getJobDescription()
                        .isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    "Add a job description before using AI analysis."
                            )
                    );
        }


        try {

            String analysis =
                    aiService
                            .analyzeJobDescription(
                                    jobApplication
                                            .getCompany(),

                                    jobApplication
                                            .getPosition(),

                                    jobApplication
                                            .getJobDescription()
                            );


            return ResponseEntity.ok(
                    new AIAnalysisResponse(
                            analysis
                    )
            );


        } catch (Exception exception) {

            System.err.println(
                    "AI analysis failed: " +
                    exception.getMessage()
            );


            return ResponseEntity
                    .status(
                            HttpStatus.BAD_GATEWAY
                    )
                    .body(
                            new ErrorResponse(
                                    "Unable to generate AI analysis right now."
                            )
                    );
        }
    }


    private static class ErrorResponse {

        private final String message;


        public ErrorResponse(
                String message
        ) {
            this.message = message;
        }


        public String getMessage() {
            return message;
        }
    }
}