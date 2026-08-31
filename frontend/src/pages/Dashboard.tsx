import { useMemo } from "react";

import type { JobApplication } from "../types/JobApplication";

import StatCard from "../components/StatCard";
import ApplicationCard from "../components/ApplicationCard";

type DashboardProps = {
  applications: JobApplication[];
  onAdd: () => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: number) => void;
  onView: (application: JobApplication) => void;
};

function Dashboard({
  applications,
  onAdd,
  onEdit,
  onDelete,
  onView,
}: DashboardProps) {

  const stats = useMemo(() => {

    const total =
      applications.length;

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

    return {
      total,
      applied,
      interviews,
      offers,
    };

  }, [applications]);


  return (
    <main className="main-content">

      <header className="top-bar">

        <div>

          <p className="eyebrow">
            CAREERPILOT ✦
          </p>

          <h2>
            Your job search at a glance
          </h2>

          <p className="page-subtitle">
            Keep track of every opportunity
            and stay close to your next yes.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={onAdd}
        >
          + Add Application
        </button>

      </header>


      <section className="stats-grid">

        <StatCard
          label="Total Applications"
          value={stats.total}
          helper="Everything you're tracking"
          icon="✦"
          tone="sage"
        />

        <StatCard
          label="Applied"
          value={stats.applied}
          helper="Waiting for updates"
          icon="↗"
          tone="blue"
        />

        <StatCard
          label="Interviews"
          value={stats.interviews}
          helper="Conversations in progress"
          icon="☁"
          tone="lavender"
        />

        <StatCard
          label="Offers"
          value={stats.offers}
          helper="The exciting part"
          icon="★"
          tone="butter"
        />

      </section>


      <section className="applications-section">

        <div className="section-heading">

          <div>

            <p className="section-kicker">
              RECENT ACTIVITY
            </p>

            <h3>
              Recent Applications
            </h3>

            <p>
              Your latest opportunities and
              where things currently stand.
            </p>

          </div>

        </div>


        <div className="application-list">

          {applications.length === 0 ? (

            <div className="empty-state">

              <div className="empty-state-icon">
                ✦
              </div>

              <h4>
                Your search starts here
              </h4>

              <p>
                Add your first application and
                CareerPilot will help you keep
                everything organized.
              </p>

              <button
                className="primary-button"
                onClick={onAdd}
              >
                Add your first application
              </button>

            </div>

          ) : (

            applications
              .slice(-4)
              .reverse()
              .map((application) => (

                <ApplicationCard
                  key={application.id}
                  application={application}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />

              ))

          )}

        </div>

      </section>

    </main>
  );
}

export default Dashboard;