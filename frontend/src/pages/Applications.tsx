import { useMemo, useState } from "react";

import type { JobApplication } from "../types/JobApplication";

import ApplicationCard from "../components/ApplicationCard";

type ApplicationsPageProps = {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  onView: (application: JobApplication) => void;
};

function Applications({
  applications,
  onEdit,
  onDelete,
  onAdd,
  onView,
}: ApplicationsPageProps) {

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");


  const filteredApplications = useMemo(() => {

    return applications.filter(
      (application) => {

        const normalizedSearch =
          search.toLowerCase();

        const matchesSearch =
          application.company
            .toLowerCase()
            .includes(normalizedSearch) ||
          application.position
            .toLowerCase()
            .includes(normalizedSearch) ||
          application.location
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "All" ||
          application.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );

  }, [
    applications,
    search,
    statusFilter,
  ]);


  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All";


  const clearFilters = () => {

    setSearch("");
    setStatusFilter("All");

  };


  return (
    <main className="main-content">

      <header className="top-bar">

        <div>

          <p className="eyebrow">
            CAREERPILOT ✦
          </p>

          <h2>
            Your applications
          </h2>

          <p className="page-subtitle">
            Keep every opportunity organized
            in one calm little workspace.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={onAdd}
        >
          + Add Application
        </button>

      </header>


      <section className="applications-section applications-page-panel">

        <div className="applications-section-header">

          <div>

            <p className="section-kicker">
              YOUR SEARCH
            </p>

            <h3>
              Application tracker
            </h3>

            <p>
              Search your roles or narrow
              everything down by status.
            </p>

          </div>


          <div className="applications-count-badge">
            {applications.length}

            <span>
              tracked
            </span>
          </div>

        </div>


        <div className="applications-toolbar">

          <div className="search-field">

            <span className="search-field-icon">
              ⌕
            </span>

            <input
              className="search-input"
              type="text"
              placeholder="Search company, role, or location..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          <div className="filter-field">

            <span className="filter-label">
              Status
            </span>

            <select
              className="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Statuses
              </option>

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

          </div>

        </div>


        <div className="applications-results-row">

          <div className="results-summary">

            Showing{" "}
            <strong>
              {filteredApplications.length}
            </strong>{" "}
            of{" "}
            <strong>
              {applications.length}
            </strong>{" "}
            applications

          </div>


          {hasFilters && (

            <button
              type="button"
              className="clear-filters-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>

          )}

        </div>


        <div className="application-list">

          {filteredApplications.length === 0 ? (

            <div className="empty-state">

              <div className="empty-state-icon">
                ⌕
              </div>

              <h4>
                Nothing matched
              </h4>

              <p>
                Try another search or clear
                your current filters.
              </p>


              {hasFilters && (

                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>

              )}

            </div>

          ) : (

            filteredApplications.map(
              (application) => (

                <ApplicationCard
                  key={application.id}
                  application={application}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />

              )
            )

          )}

        </div>

      </section>

    </main>
  );
}

export default Applications;