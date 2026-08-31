import { useEffect, useState } from "react";

import { apiFetch } from "../api/api";

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

function ApplicationDetails({
  application,
  onBack,
  onEdit,
  onDelete,
}: ApplicationDetailsProps) {

  const [
    statusHistory,
    setStatusHistory,
  ] = useState<
    ApplicationStatusHistory[]
  >([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  const [
    historyError,
    setHistoryError,
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
        <span>←</span>
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