import type { JobApplication } from "../types/JobApplication";

type ApplicationCardProps = {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: number) => void;
  onView: (application: JobApplication) => void;
};

function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onView,
}: ApplicationCardProps) {

  const companyInitial =
    application.company
      .charAt(0)
      .toUpperCase();

  const statusClass =
    application.status
      .toLowerCase()
      .replace(/\s+/g, "-");

  return (
    <article
      className="application-card"
      onClick={() =>
        onView(application)
      }
    >

      <div className="company-badge">
        {companyInitial}
      </div>

      <div className="application-info">

        <div className="application-title-row">

          <div className="application-title-copy">

            <h4>
              {application.position}
            </h4>

            <p className="company-name">
              {application.company}
            </p>

          </div>

          <span
            className={`status-badge status-${statusClass}`}
          >
            {application.status}
          </span>

        </div>


        <div className="application-meta">

          <span className="application-meta-item">
            <span className="meta-dot">
              ◦
            </span>

            {application.location ||
              "Location not added"}
          </span>

          <span className="application-meta-item">
            <span className="meta-dot">
              ◦
            </span>

            Applied{" "}
            {application.dateApplied ||
              "date not added"}
          </span>

        </div>


        <div className="application-card-footer">

          <div className="application-actions">

            <button
              type="button"
              className="edit-button"
              onClick={(event) => {

                event.stopPropagation();

                onEdit(application);
              }}
            >
              Edit
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={(event) => {

                event.stopPropagation();

                onDelete(
                  application.id
                );
              }}
            >
              Delete
            </button>

          </div>


          <button
            type="button"
            className="view-application-button"
            onClick={(event) => {

              event.stopPropagation();

              onView(application);
            }}
          >
            View details
            <span>
              →
            </span>
          </button>

        </div>

      </div>

    </article>
  );
}

export default ApplicationCard;