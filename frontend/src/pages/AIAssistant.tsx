import { useEffect, useState } from "react";

import { apiFetch } from "../api/api";

import AIAnalysisContent
  from "../components/AIAnalysisContent";

import type { JobApplication } from "../types/JobApplication";


type AIAssistantProps = {
  applications: JobApplication[];
};


type AIAnalysisResponse = {
  analysis: string;
};


function AIAssistant({
  applications,
}: AIAssistantProps) {

  const [
    selectedApplicationId,
    setSelectedApplicationId,
  ] = useState<number | null>(
    applications.length > 0
      ? applications[0].id
      : null
  );

  const [
    analysis,
    setAnalysis,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // SELECT FIRST APPLICATION
  

  useEffect(() => {

    if (
      applications.length > 0 &&
      selectedApplicationId === null
    ) {

      setSelectedApplicationId(
        applications[0].id
      );

    }

  }, [
    applications,
    selectedApplicationId,
  ]);


  
  // SELECTED APPLICATION
  

  const selectedApplication =
    applications.find(
      (application) =>
        application.id ===
        selectedApplicationId
    );


 
  // CHANGE APPLICATION
 

  const handleApplicationChange = (
    applicationId: number
  ) => {

    setSelectedApplicationId(
      applicationId
    );

    setAnalysis("");

    setError("");

  };



  // AI ANALYSIS
 

  const handleAnalyze =
    async () => {

      if (!selectedApplication) {

        setError(
          "Choose an application to analyze."
        );

        return;

      }


      if (
        !selectedApplication.jobDescription ||
        !selectedApplication.jobDescription.trim()
      ) {

        setError(
          "This application needs a job description before CareerPilot AI can analyze it."
        );

        return;

      }


      try {

        setLoading(true);

        setError("");


        const response =
          await apiFetch(
            `/api/ai/applications/${selectedApplication.id}/analyze`,
            {
              method: "POST",
            }
          );


        const data =
          await response.json();


        if (
          response.status === 401
        ) {

          throw new Error(
            "Your session has expired. Please log in again."
          );

        }


        if (
          response.status === 404
        ) {

          throw new Error(
            "This application could not be found."
          );

        }


        if (
          response.status === 400
        ) {

          throw new Error(
            data.message ||
            "Add a job description before using AI analysis."
          );

        }


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to generate AI analysis right now."
          );

        }


        const aiResponse =
          data as AIAnalysisResponse;


        setAnalysis(
          aiResponse.analysis
        );


      } catch (error) {

        console.error(
          "Unable to generate AI analysis:",
          error
        );


        if (
          error instanceof Error
        ) {

          setError(
            error.message
          );

        } else {

          setError(
            "Unable to generate AI analysis right now."
          );

        }


      } finally {

        setLoading(false);

      }

    };

  // UI
 

  return (

    <main className="main-content ai-assistant-page">


      {/*  HERO
          */}

      <section className="ai-page-hero">

        <div>

          <p className="eyebrow">
            CAREERPILOT AI ✦
          </p>

          <h2>
            Prepare smarter for
            every opportunity.
          </h2>

          <p className="ai-page-subtitle">

            Choose one of your applications
            and turn its job description into
            focused career insights.

          </p>

        </div>


        <div className="ai-page-hero-icon">
          ✦
        </div>

      </section>


      {/*NO APPLICATIONS
        */}

      {applications.length === 0 ? (

        <section className="details-panel">

          <div className="ai-page-empty">

            <div className="ai-page-empty-icon">
              ✦
            </div>

            <h3>
              No applications yet
            </h3>

            <p>

              Add an application with a job
              description first, then come back
              here for AI-powered preparation.

            </p>

          </div>

        </section>

      ) : (

        <>


          {/* =========================
              APPLICATION PICKER
              ========================= */}

          <section className="details-panel ai-picker-panel">

            <div className="details-panel-heading">

              <div className="details-panel-icon lavender">
                ◫
              </div>


              <div>

                <p className="section-kicker">
                  OPPORTUNITY
                </p>

                <h3>
                  Choose an application
                </h3>

                <p className="details-panel-description">

                  CareerPilot will analyze the
                  saved job description for the
                  opportunity you select.

                </p>

              </div>

            </div>


            <div className="ai-application-grid">

              {applications.map(
                (application) => {

                  const isSelected =
                    application.id ===
                    selectedApplicationId;


                  return (

                    <button
                      type="button"
                      key={application.id}
                      className={`ai-application-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleApplicationChange(
                          application.id
                        )
                      }
                    >


                      <div className="ai-company-initial">

                        {application.company
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div className="ai-application-option-copy">

                        <strong>
                          {application.position}
                        </strong>

                        <span>
                          {application.company}
                        </span>

                        <small>

                          {application.location ||
                            "Location not added"}

                        </small>

                      </div>


                      <div className="ai-selection-indicator">

                        {isSelected
                          ? "✓"
                          : ""}

                      </div>

                    </button>

                  );

                }
              )}

            </div>

          </section>


          {/* =========================
              AI WORKSPACE
              ========================= */}

          {selectedApplication && (

            <section className="details-panel ai-workspace-panel">


              <div className="ai-analysis-header">

                <div className="details-panel-heading">

                  <div className="details-panel-icon lavender">
                    ✦
                  </div>


                  <div>

                    <p className="section-kicker">
                      AI WORKSPACE
                    </p>

                    <h3>
                      {selectedApplication.company}
                    </h3>

                    <p className="details-panel-description">
                      {selectedApplication.position}
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  className="ai-analyze-button"
                  onClick={handleAnalyze}
                  disabled={
                    loading ||
                    !selectedApplication
                      .jobDescription
                  }
                >

                  {loading
                    ? "Analyzing..."
                    : analysis
                      ? "Analyze again ✦"
                      : "Analyze with AI ✦"}

                </button>

              </div>


              {/* =========================
                  NO JOB DESCRIPTION
                  ========================= */}

              {!selectedApplication
                .jobDescription && (

                <div className="ai-empty-state">

                  <div className="ai-empty-icon">
                    ✦
                  </div>


                  <div>

                    <strong>
                      Job description needed
                    </strong>

                    <p>

                      Edit this application and
                      add its job description
                      before running AI analysis.

                    </p>

                  </div>

                </div>

              )}


              {/* =========================
                  READY STATE
                  ========================= */}

              {selectedApplication
                .jobDescription &&
                !analysis &&
                !loading &&
                !error && (

                <div className="ai-ready-state">

                  <div className="ai-ready-decoration">
                    ✦
                  </div>


                  <div>

                    <strong>
                      Ready to analyze.
                    </strong>

                    <p>

                      CareerPilot AI will look for
                      key skills, technologies,
                      resume keywords, interview
                      topics, and preparation
                      priorities.

                    </p>

                  </div>

                </div>

              )}


              {/* =========================
                  LOADING
                  ========================= */}

              {loading && (

                <div
                  className="ai-loading-state"
                  role="status"
                >

                  <div className="ai-loading-orb">
                    ✦
                  </div>


                  <div>

                    <strong>
                      Analyzing this opportunity...
                    </strong>

                    <p>

                      CareerPilot is turning the
                      job description into focused
                      preparation insights.

                    </p>

                  </div>

                </div>

              )}


              {/* =========================
                  ERROR
                  ========================= */}

              {error && (

                <div
                  className="ai-error-state"
                  role="alert"
                >

                  {error}

                </div>

              )}


              {/* =========================
                  AI RESULT
                  ========================= */}

              {analysis &&
                !loading && (

                <div className="ai-analysis-result">


                  <div className="ai-result-topline">

                    <span>
                      ✦ AI ANALYSIS
                    </span>

                    <span>
                      {
                        selectedApplication
                          .position
                      }
                    </span>

                  </div>


                  <div className="ai-analysis-content">

                    <AIAnalysisContent
                      analysis={analysis}
                    />

                  </div>


                  <p className="ai-disclaimer">

                    AI-generated guidance can
                    make mistakes. Verify
                    important details against
                    the original job posting.

                  </p>

                </div>

              )}

            </section>

          )}

        </>

      )}

    </main>

  );

}


export default AIAssistant;