package com.careerpilot.backend.ai;

public class AIAnalysisResponse {

    private String analysis;

    public AIAnalysisResponse() {
    }

    public AIAnalysisResponse(String analysis) {
        this.analysis = analysis;
    }

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }
}