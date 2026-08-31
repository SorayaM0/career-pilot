import { useMemo } from "react";

import type { JobApplication } from "../types/JobApplication";

type AnalyticsProps = {
  applications: JobApplication[];
};

function Analytics({
  applications,
}: AnalyticsProps) {

  const analytics = useMemo(() => {

    const total = applications.length;

    const applied =
      applications.filter(
        (application) =>
          application.status.toLowerCase() ===
          "applied"
      ).length;

    const interviews =
      applications.filter(
        (application) =>
          application.status.toLowerCase() ===
          "interview"
      ).length;

    const offers =
      applications.filter(
        (application) =>
          application.status.toLowerCase() ===
          "offer"
      ).length;

    const rejected =
      applications.filter(
        (application) =>
          application.status.toLowerCase() ===
          "rejected"
      ).length;


    const percentage = (
      value: number
    ) => {

      if (total === 0) {
        return 0;
      }

      return Math.round(
        (value / total) * 100
      );
    };


    return {
      total,
      applied,
      interviews,
      offers,
      rejected,

      interviewRate:
        percentage(interviews),

      offerRate:
        percentage(offers),

      rejectionRate:
        percentage(rejected),
    };

  }, [applications]);


  const maxCount = Math.max(
    analytics.applied,
    analytics.interviews,
    analytics.offers,
    analytics.rejected,
    1
  );


  const getBarWidth = (
    value: number
  ) => {

    return `${(
      value / maxCount
    ) * 100}%`;
  };


  return (
    <main className="main-content">

      <header className="top-bar">

        <div>

          <p className="eyebrow">
            CAREERPILOT ✦
          </p>

          <h2>
            Your job search story
          </h2>

          <p className="page-subtitle">
            A softer look at your progress,
            momentum, and outcomes.
          </p>

        </div>

      </header>


      <section className="analytics-summary-grid">

        <div className="analytics-summary-card analytics-card-sage">

          <div className="analytics-card-icon">
            ✦
          </div>

          <span>
            Total Applications
          </span>

          <strong>
            {analytics.total}
          </strong>

          <p>
            Roles tracked so far
          </p>

        </div>


        <div className="analytics-summary-card analytics-card-blue">

          <div className="analytics-card-icon">
            ☁
          </div>

          <span>
            Interview Rate
          </span>

          <strong>
            {analytics.interviewRate}%
          </strong>

          <p>
            Applications currently interviewing
          </p>

        </div>


        <div className="analytics-summary-card analytics-card-butter">

          <div className="analytics-card-icon">
            ★
          </div>

          <span>
            Offer Rate
          </span>

          <strong>
            {analytics.offerRate}%
          </strong>

          <p>
            Applications resulting in offers
          </p>

        </div>


        <div className="analytics-summary-card analytics-card-lavender">

          <div className="analytics-card-icon">
            ◌
          </div>

          <span>
            Rejection Rate
          </span>

          <strong>
            {analytics.rejectionRate}%
          </strong>

          <p>
            Applications marked rejected
          </p>

        </div>

      </section>


      <section className="analytics-panel analytics-pipeline-panel">

        <div className="analytics-panel-header">

          <div>

            <p className="section-kicker">
              PIPELINE
            </p>

            <h3>
              Application Pipeline
            </h3>

            <p>
              See how your applications are
              distributed right now.
            </p>

          </div>

          <div className="analytics-panel-badge">
            {analytics.total}

            <span>
              total
            </span>
          </div>

        </div>


        <div className="pipeline-list">


          <div className="pipeline-row">

            <div className="pipeline-label">

              <span>
                Applied
              </span>

              <strong>
                {analytics.applied}
              </strong>

            </div>

            <div className="pipeline-track">

              <div
                className="pipeline-bar bar-applied"
                style={{
                  width:
                    getBarWidth(
                      analytics.applied
                    ),
                }}
              />

            </div>

          </div>


          <div className="pipeline-row">

            <div className="pipeline-label">

              <span>
                Interview
              </span>

              <strong>
                {analytics.interviews}
              </strong>

            </div>

            <div className="pipeline-track">

              <div
                className="pipeline-bar bar-interview"
                style={{
                  width:
                    getBarWidth(
                      analytics.interviews
                    ),
                }}
              />

            </div>

          </div>


          <div className="pipeline-row">

            <div className="pipeline-label">

              <span>
                Offer
              </span>

              <strong>
                {analytics.offers}
              </strong>

            </div>

            <div className="pipeline-track">

              <div
                className="pipeline-bar bar-offer"
                style={{
                  width:
                    getBarWidth(
                      analytics.offers
                    ),
                }}
              />

            </div>

          </div>


          <div className="pipeline-row">

            <div className="pipeline-label">

              <span>
                Rejected
              </span>

              <strong>
                {analytics.rejected}
              </strong>

            </div>

            <div className="pipeline-track">

              <div
                className="pipeline-bar bar-rejected"
                style={{
                  width:
                    getBarWidth(
                      analytics.rejected
                    ),
                }}
              />

            </div>

          </div>

        </div>

      </section>


      <section className="analytics-panel">

        <div className="analytics-panel-header">

          <div>

            <p className="section-kicker">
              QUICK INSIGHTS
            </p>

            <h3>
              Job Search Insights
            </h3>

            <p>
              A little snapshot of how your
              pipeline is moving.
            </p>

          </div>

        </div>


        {analytics.total === 0 ? (

          <div className="analytics-empty">

            <div className="analytics-empty-icon">
              ✦
            </div>

            <h4>
              Your analytics will grow with you
            </h4>

            <p>
              Add applications to start seeing
              patterns in your job search.
            </p>

          </div>

        ) : (

          <div className="insight-grid">

            <div className="insight-card insight-card-sage">

              <span>
                Applications still active
              </span>

              <strong>
                {
                  analytics.applied +
                  analytics.interviews
                }
              </strong>

              <p>
                Still moving through the process
              </p>

            </div>


            <div className="insight-card insight-card-butter">

              <span>
                Applications with outcomes
              </span>

              <strong>
                {
                  analytics.offers +
                  analytics.rejected
                }
              </strong>

              <p>
                Roles with a final result
              </p>

            </div>


            <div className="insight-card insight-card-lavender">

              <span>
                Interview opportunities
              </span>

              <strong>
                {analytics.interviews}
              </strong>

              <p>
                Conversations currently in motion
              </p>

            </div>

          </div>

        )}

      </section>

    </main>
  );
}

export default Analytics;