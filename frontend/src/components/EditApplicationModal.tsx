import { useState } from "react";

import { apiFetch } from "../api/api";

import type { JobApplication } from "../types/JobApplication";

type EditApplicationModalProps = {
  application: JobApplication;
  onClose: () => void;
  onApplicationUpdated: (
    application: JobApplication
  ) => void;
};

function EditApplicationModal({
  application,
  onClose,
  onApplicationUpdated,
}: EditApplicationModalProps) {

  const [company, setCompany] =
    useState(application.company);

  const [position, setPosition] =
    useState(application.position);

  const [location, setLocation] =
    useState(application.location);

  const [status, setStatus] =
    useState(application.status);

  const [jobUrl, setJobUrl] =
    useState(application.jobUrl || "");

  const [dateApplied, setDateApplied] =
    useState(application.dateApplied);

  const [
    jobDescription,
    setJobDescription,
  ] = useState(
    application.jobDescription || ""
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    setLoading(true);
    setError("");

    const updatedApplication = {
      company,
      position,
      location,
      status,
      jobUrl,
      dateApplied,
      jobDescription,
    };

    try {

      const response = await apiFetch(
        `/api/applications/${application.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            updatedApplication
          ),
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      if (response.status === 404) {
        throw new Error(
          "Application not found."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Unable to update application"
        );
      }

      const savedApplication =
        await response.json();

      onApplicationUpdated(
        savedApplication
      );

      onClose();

    } catch (error) {

      console.error(
        "Unable to update application:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Something went wrong."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="modal-overlay">

      <div className="modal application-modal">

        <div className="modal-header application-modal-header">

          <div className="modal-heading-group">

            <div className="modal-icon">
              ✦
            </div>

            <div>

              <p className="modal-kicker">
                UPDATE OPPORTUNITY
              </p>

              <h3>
                Edit Application
              </h3>

              <p>
                Keep this opportunity
                up to date as things move.
              </p>

            </div>

          </div>


          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>

        </div>


        <form
          className="application-form polished-application-form"
          onSubmit={handleSubmit}
        >

          <label>
            Company

            <input
              type="text"
              value={company}
              onChange={(event) =>
                setCompany(
                  event.target.value
                )
              }
              placeholder="e.g. Google"
              required
            />
          </label>


          <label>
            Position

            <input
              type="text"
              value={position}
              onChange={(event) =>
                setPosition(
                  event.target.value
                )
              }
              placeholder="e.g. Software Engineer"
              required
            />
          </label>


          <label>
            Location

            <input
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              placeholder="e.g. New York, NY"
            />
          </label>


          <label>
            Status

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
            >
              <option value="Applied">
                Applied
              </option>

              <option value="Interview">
                Interview
              </option>

              <option value="Offer">
                Offer
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </label>


          <label>
            Job URL

            <input
              type="url"
              value={jobUrl}
              onChange={(event) =>
                setJobUrl(
                  event.target.value
                )
              }
              placeholder="https://..."
            />
          </label>


          <label>
            Date Applied

            <input
              type="date"
              value={dateApplied}
              onChange={(event) =>
                setDateApplied(
                  event.target.value
                )
              }
              required
            />
          </label>


          <label className="full-width">
            Job Description

            <textarea
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(
                  event.target.value
                )
              }
              placeholder="Paste the role description, requirements, or notes here..."
              rows={6}
            />
          </label>


          {error && (

            <div className="modal-error full-width">

              <span>
                !
              </span>

              <p>
                {error}
              </p>

            </div>

          )}


          <div className="form-actions full-width">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditApplicationModal;