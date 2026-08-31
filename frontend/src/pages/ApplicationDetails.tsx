import { useEffect, useState } from "react";

import { apiFetch } from "../api/api";

import AIAnalysisContent
  from "../components/AIAnalysisContent";

import type { JobApplication } from "../types/JobApplication";


type ApplicationDetailsProps = {
  application: JobApplication;
  onBack: () => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: number) => void;
};


type ApplicationStatusHistory = {
  id: number;
  status: string;
  changedAt: string;
};


type AIAnalysisResponse = {
  analysis: string;
};


function ApplicationDetails({
  application,
  onBack,
  onEdit,
  onDelete,
}: ApplicationDetailsProps) {

  const [
    statusHistory,
    setStatusHistory,
  ] = useState<ApplicationStatusHistory[]>([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  const [
    historyError,
    setHistoryError,
  ] = useState("");


  const [
    aiAnalysis,
    setAiAnalysis,
  ] = useState("");

  const [
    aiLoading,
    setAiLoading,
  ] = useState(false);

  const [
    aiError,
    setAiError,
  ] = useState("");


  // =========================
  // FETCH STATUS HISTORY
  // =========================

  useEffect(() => {

    const fetchStatusHistory =
      async () => {

        try {

          setHistoryLoading(true);
          setHistoryError("");

          const response =
            await apiFetch(
              `/api/applications/${application.id}/history`
            );


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
              "Application history was not found."
            );

          }


          if (!response.ok) {

            throw new Error(
              "Failed to load application history."
            );

          }


          const data:
            ApplicationStatusHistory[] =
              await response.json();


          setStatusHistory(data);


        } catch (error) {

          console.error(
            "Unable to load application history:",
            error
          );


          if (
            error instanceof Error
          ) {

            setHistoryError(
              error.message
            );

          } else {

            setHistoryError(
              "Unable to load application history."
            );

          }


        } finally {

          setHistoryLoading(false);

        }

      };


    fetchStatusHistory();

  }, [application.id]);


  // =========================
  // RESET AI WHEN APP CHANGES
  // =========================

  useEffect(() => {

    setAiAnalysis("");

    setAiError("");

    setAiLoading(false);

  }, [application.id]);


  // =========================
  // AI ANALYSIS
  // =========================

  const handleAnalyzeWithAI =
    async () => {

      if (
        !application.jobDescription ||
        !application.jobDescription.trim()
      ) {

        setAiError(
          "Add a job description before using AI analysis."
        );

        return;

      }


      try {

        setAiLoading(true);

        setAiError("");


        const response =
          await apiFetch(
            `/api/ai/applications/${application.id}/analyze`,
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


        setAiAnalysis(
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

          setAiError(
            error.message
          );

        } else {

          setAiError(
            "Unable to generate AI analysis right now."
          );

        }


      } finally {

        setAiLoading(false);

      }

    };


  // =========================
  // FORMAT DATE
  // =========================

  const formatDateTime = (
    dateString: string
  ) => {

    const date =
      new Date(dateString);


    return date.toLocaleString();

  };


  const statusClass =
    application.status
      .toLowerCase()
      .replace(/\s+/g, "-");


  // =========================
  // UI
  // =========================

  return (

    <main className="main-content details-page">


      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <span>
          ←
        </span>

        Back to Applications
      </button>


      {/* =========================
          HEADER
          ========================= */}

      <section className="details-header details-hero">

        <div className="details-hero-main">

          <div className="details-company-badge">

            {application.company
              .charAt(0)
              .toUpperCase()}

          </div>


          <div>

            <p className="eyebrow">
              APPLICATION DETAILS ✦
            </p>

            <h2>
              {application.company}
            </h2>

            <p className="details-position">
              {application.position}
            </p>

          </div>

        </div>


        <div className="details-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              onEdit(application)
            }
          >
            Edit application
          </button>


          <button
            type="button"
            className="delete-button"
            onClick={() =>
              onDelete(
                application.id
              )
            }
          >
            Delete
          </button>

        </div>

      </section>


      {/* =========================
          APPLICATION INFO
          ========================= */}

      <section className="details-grid">


        <div className="details-card details-card-sage">

          <div className="details-card-icon">
            ◌
          </div>

          <span>
            Status
          </span>

          <strong>

            <span
              className={`status-badge status-${statusClass}`}
            >
              {application.status}
            </span>

          </strong>

        </div>


        <div className="details-card details-card-blue">

          <div className="details-card-icon">
            ◦
          </div>

          <span>
            Location
          </span>

          <strong>
            {application.location ||
              "Not provided"}
          </strong>

        </div>


        <div className="details-card details-card-butter">

          <div className="details-card-icon">
            ✦
          </div>

          <span>
            Date Applied
          </span>

          <strong>
            {application.dateApplied ||
              "Not provided"}
          </strong>

        </div>

      </section>


      {/* =========================
          JOB DESCRIPTION
          ========================= */}

      <section className="details-panel">

        <div className="details-panel-heading">

          <div className="details-panel-icon sage">
            ≡
          </div>


          <div>

            <p className="section-kicker">
              ROLE
            </p>

            <h3>
              Job Description
            </h3>

          </div>

        </div>


        {application.jobDescription ? (

          <p className="job-description">

            {application.jobDescription}

          </p>

        ) : (

          <div className="details-soft-empty">

            No job description added yet.

          </div>

        )}

      </section>


      {/* =========================
          AI CAREER ANALYSIS
          ========================= */}

      <section className="details-panel ai-analysis-panel">

        <div className="ai-analysis-header">


          <div className="details-panel-heading">

            <div className="details-panel-icon lavender">
              ✦
            </div>


            <div>

              <p className="section-kicker">
                CAREERPILOT AI
              </p>

              <h3>
                AI Career Analysis
              </h3>

              <p className="details-panel-description">

                Turn this job description into
                focused preparation insights.

              </p>

            </div>

          </div>


          <button
            type="button"
            className="ai-analyze-button"
            onClick={handleAnalyzeWithAI}
            disabled={
              aiLoading ||
              !application.jobDescription
            }
          >

            {aiLoading
              ? "Analyzing..."
              : aiAnalysis
                ? "Analyze again ✦"
                : "Analyze with AI ✦"}

          </button>

        </div>


        {!application.jobDescription && (

          <div className="ai-empty-state">

            <div className="ai-empty-icon">
              ✦
            </div>


            <div>

              <strong>
                Add a job description first
              </strong>

              <p>

                CareerPilot uses the saved job
                description to generate role-specific
                career insights.

              </p>

            </div>

          </div>

        )}


        {application.jobDescription &&
          !aiAnalysis &&
          !aiLoading &&
          !aiError && (

            <div className="ai-ready-state">

              <div className="ai-ready-decoration">
                ✦
              </div>


              <div>

                <strong>
                  Ready when you are.
                </strong>

                <p>

                  CareerPilot AI can identify key
                  skills, technologies, resume
                  keywords, interview topics, and
                  preparation advice for this role.

                </p>

              </div>

            </div>

          )}


        {aiLoading && (

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

                CareerPilot is reviewing the role
                and building your preparation
                insights.

              </p>

            </div>

          </div>

        )}


        {aiError && (

          <div
            className="ai-error-state"
            role="alert"
          >

            {aiError}

          </div>

        )}


        {aiAnalysis &&
          !aiLoading && (

            <div className="ai-analysis-result">


              <div className="ai-result-topline">

                <span>
                  ✦ AI ANALYSIS
                </span>

                <span>

                  Generated for{" "}
                  {application.position}

                </span>

              </div>


              <div className="ai-analysis-content">

                <AIAnalysisContent
                  analysis={aiAnalysis}
                />

              </div>


              <p className="ai-disclaimer">

                AI-generated guidance can make
                mistakes. Use it as preparation
                support and verify important details
                against the original job posting.

              </p>

            </div>

          )}

      </section>


      {/* =========================
          JOB POSTING
          ========================= */}

      <section className="details-panel">

        <div className="details-panel-heading">

          <div className="details-panel-icon lavender">
            ↗
          </div>


          <div>

            <p className="section-kicker">
              ORIGINAL LISTING
            </p>

            <h3>
              Job Posting
            </h3>

          </div>

        </div>


        {application.jobUrl ? (

          <a
            className="job-link polished-job-link"
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
          >

            <span>
              Open original job posting
            </span>

            <span>
              ↗
            </span>

          </a>

        ) : (

          <div className="details-soft-empty">

            No job URL added yet.

          </div>

        )}

      </section>


      {/* =========================
          APPLICATION PROGRESS
          ========================= */}

      <section className="details-panel">

        <div className="details-panel-heading">

          <div className="details-panel-icon butter">
            ✦
          </div>


          <div>

            <p className="section-kicker">
              JOURNEY
            </p>

            <h3>
              Application Progress
            </h3>

            <p className="details-panel-description">

              Follow how this opportunity is
              moving through your pipeline.

            </p>

          </div>

        </div>


        {application.status ===
        "Rejected" ? (

          <div className="status-timeline">


            <div className="timeline-step completed">

              <div className="timeline-dot" />

              <span>
                Applied
              </span>

            </div>


            <div className="timeline-step rejected">

              <div className="timeline-dot" />

              <span>
                Rejected
              </span>

            </div>

          </div>

        ) : (

          <div className="status-timeline">


            <div
              className={`timeline-step ${
                [
                  "Applied",
                  "Interview",
                  "Offer",
                ].includes(
                  application.status
                )
                  ? "completed"
                  : ""
              }`}
            >

              <div className="timeline-dot" />

              <span>
                Applied
              </span>

            </div>


            <div
              className={`timeline-step ${
                [
                  "Interview",
                  "Offer",
                ].includes(
                  application.status
                )
                  ? "completed"
                  : ""
              }`}
            >

              <div className="timeline-dot" />

              <span>
                Interview
              </span>

            </div>


            <div
              className={`timeline-step ${
                application.status ===
                "Offer"
                  ? "completed"
                  : ""
              }`}
            >

              <div className="timeline-dot" />

              <span>
                Offer
              </span>

            </div>

          </div>

        )}

      </section>


      {/* =========================
          STATUS HISTORY
          ========================= */}

      <section className="details-panel">

        <div className="details-panel-heading">

          <div className="details-panel-icon blue">
            ◷
          </div>


          <div>

            <p className="section-kicker">
              ACTIVITY
            </p>

            <h3>
              Status History
            </h3>

            <p className="details-panel-description">

              A timeline of changes for this
              application.

            </p>

          </div>

        </div>


        {historyLoading && (

          <div className="details-soft-empty">

            Loading history...

          </div>

        )}


        {historyError && (

          <div className="details-soft-empty">

            {historyError}

          </div>

        )}


        {!historyLoading &&
          !historyError &&
          statusHistory.length === 0 && (

            <div className="details-soft-empty">

              No status history available yet.

            </div>

          )}


        {!historyLoading &&
          !historyError &&
          statusHistory.length > 0 && (

            <div className="history-list">

              {statusHistory.map(
                (historyItem) => (

                  <div
                    className="history-item"
                    key={historyItem.id}
                  >


                    <div className="history-item-left">

                      <div className="history-marker">
                        ✦
                      </div>


                      <div>

                        <strong>
                          {historyItem.status}
                        </strong>

                        <p>

                          Application status changed
                          to{" "}
                          {historyItem.status}.

                        </p>

                      </div>

                    </div>


                    <span className="history-date">

                      {formatDateTime(
                        historyItem.changedAt
                      )}

                    </span>

                  </div>

                )
              )}

            </div>

          )}

      </section>

    </main>

  );

}


export default ApplicationDetails;