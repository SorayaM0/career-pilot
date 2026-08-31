import {
  useEffect,
  useState,
} from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import AddApplicationModal from "./components/AddApplicationModal";
import EditApplicationModal from "./components/EditApplicationModal";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import ApplicationDetails from "./pages/ApplicationDetails";
import AuthPage from "./pages/AuthPage";

import {
  apiFetch,
  getToken,
  removeToken,
} from "./api/api";

import type {
  JobApplication,
} from "./types/JobApplication";


function App() {

  // =========================
  // AUTHENTICATION
  // =========================

  const [token, setAuthToken] =
    useState<string | null>(
      () => getToken()
    );


  // =========================
  // APPLICATION STATE
  // =========================

  const [applications, setApplications] =
    useState<JobApplication[]>([]);

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState<JobApplication | null>(null);

  const [
    detailsApplication,
    setDetailsApplication,
  ] = useState<JobApplication | null>(null);


  // =========================
  // AUTH SUCCESS
  // =========================

  const handleAuthenticated = (
    newToken: string
  ) => {

    setAuthToken(
      newToken
    );

    setCurrentPage(
      "dashboard"
    );

  };


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    removeToken();

    setAuthToken(null);

    setApplications([]);

    setDetailsApplication(null);

    setSelectedApplication(null);

    setShowAddModal(false);

    setCurrentPage(
      "dashboard"
    );

  };


  // =========================
  // LOAD APPLICATIONS
  // =========================

  useEffect(() => {

    if (!token) {

      setApplications([]);

      return;

    }


    const loadApplications =
      async () => {

        try {

          const response =
            await apiFetch(
              "/api/applications"
            );


          if (
            response.status === 401
          ) {

            handleLogout();

            return;

          }


          if (!response.ok) {

            throw new Error(
              "Unable to load applications"
            );

          }


          const data =
            await response.json();


          setApplications(
            data
          );


        } catch (error) {

          console.error(
            "Unable to load applications:",
            error
          );

        }

      };


    loadApplications();

  }, [token]);


  // =========================
  // CREATE
  // =========================

  const handleApplicationCreated = (
    application: JobApplication
  ) => {

    setApplications(
      (currentApplications) => [
        ...currentApplications,
        application,
      ]
    );

  };


  // =========================
  // UPDATE
  // =========================

  const handleApplicationUpdated = (
    updatedApplication:
      JobApplication
  ) => {

    setApplications(
      (currentApplications) =>
        currentApplications.map(
          (application) =>
            application.id ===
            updatedApplication.id
              ? updatedApplication
              : application
        )
    );


    if (
      detailsApplication &&
      detailsApplication.id ===
        updatedApplication.id
    ) {

      setDetailsApplication(
        updatedApplication
      );

    }

  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this application?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response =
        await apiFetch(
          `/api/applications/${id}`,
          {
            method: "DELETE",
          }
        );


      if (
        response.status === 401
      ) {

        handleLogout();

        return;

      }


      if (!response.ok) {

        throw new Error(
          "Unable to delete application"
        );

      }


      setApplications(
        (currentApplications) =>
          currentApplications.filter(
            (application) =>
              application.id !== id
          )
      );


      if (
        detailsApplication &&
        detailsApplication.id === id
      ) {

        setDetailsApplication(null);

        setCurrentPage(
          "applications"
        );

      }


    } catch (error) {

      console.error(
        "Unable to delete application:",
        error
      );

    }

  };


  // =========================
  // VIEW APPLICATION
  // =========================

  const handleViewApplication = (
    application: JobApplication
  ) => {

    setDetailsApplication(
      application
    );

    setCurrentPage(
      "application-details"
    );

  };


  // =========================
  // SIDEBAR NAVIGATION
  // =========================

  const handleNavigate = (
    page: string
  ) => {

    setCurrentPage(page);


    if (
      page !== "application-details"
    ) {

      setDetailsApplication(null);

    }

  };


  // =========================
  // AUTH PAGE
  // =========================

  if (!token) {

    return (

      <AuthPage
        onAuthenticated={
          handleAuthenticated
        }
      />

    );

  }


  // =========================
  // MAIN APPLICATION
  // =========================

  return (

    <div className="app-shell">


      {/* =====================
          SIDEBAR
          ===================== */}

      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />


      {/* =====================
          DASHBOARD PAGE
          ===================== */}

      {currentPage === "dashboard" && (

        <Dashboard
          applications={applications}

          onAdd={() =>
            setShowAddModal(true)
          }

          onEdit={
            setSelectedApplication
          }

          onDelete={
            handleDelete
          }

          onView={
            handleViewApplication
          }
        />

      )}


      {/* =====================
          APPLICATIONS PAGE
          ===================== */}

      {currentPage === "applications" && (

        <Applications
          applications={applications}

          onAdd={() =>
            setShowAddModal(true)
          }

          onEdit={
            setSelectedApplication
          }

          onDelete={
            handleDelete
          }

          onView={
            handleViewApplication
          }
        />

      )}


      {/* =====================
          APPLICATION DETAILS
          ===================== */}

      {currentPage ===
        "application-details" &&
        detailsApplication && (

        <ApplicationDetails
          application={
            detailsApplication
          }

          onBack={() => {

            setDetailsApplication(
              null
            );

            setCurrentPage(
              "applications"
            );

          }}

          onEdit={
            setSelectedApplication
          }

          onDelete={
            handleDelete
          }
        />

      )}


      {/* =====================
          ANALYTICS PAGE
          ===================== */}

      {currentPage === "analytics" && (

        <Analytics
          applications={applications}
        />

      )}


      {/* =====================
          ADD APPLICATION MODAL
          ===================== */}

      {showAddModal && (

        <AddApplicationModal
          onClose={() =>
            setShowAddModal(false)
          }

          onApplicationCreated={
            handleApplicationCreated
          }
        />

      )}


      {/* =====================
          EDIT APPLICATION MODAL
          ===================== */}

      {selectedApplication && (

        <EditApplicationModal
          application={
            selectedApplication
          }

          onClose={() =>
            setSelectedApplication(
              null
            )
          }

          onApplicationUpdated={
            handleApplicationUpdated
          }
        />

      )}

    </div>

  );
}

export default App;