package com.careerpilot.backend.ai;

import org.springframework.web.bind.annotation.*;

 // @RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final AIService aiService;

    public AIController(
            AIService aiService
    ) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public AIAnalysisResponse analyze(
            @RequestBody AIAnalysisRequest request
    ) {

        String analysis =
                aiService.analyzeJobDescription(
                        request.getJobDescription()
                );

        return new AIAnalysisResponse(
                analysis
        );
    }
}