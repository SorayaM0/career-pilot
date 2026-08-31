type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

function Sidebar({
  currentPage,
  onNavigate,
  onLogout,
}: SidebarProps) {

  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">
          C
        </div>

        <div className="brand-copy">
          <h1>
            CareerPilot
          </h1>

          <p>
            Your cozy career space
          </p>
        </div>

      </div>


      <nav className="nav-menu">

        <button
          type="button"
          className={`nav-item ${
            currentPage === "dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("dashboard")
          }
        >
          <span className="nav-icon">
            ⌂
          </span>

          <span>
            Dashboard
          </span>
        </button>


        <button
          type="button"
          className={`nav-item ${
            currentPage === "applications"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("applications")
          }
        >
          <span className="nav-icon">
            ◫
          </span>

          <span>
            Applications
          </span>
        </button>


        <button
          type="button"
          className={`nav-item ${
            currentPage === "ai-assistant"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("ai-assistant")
          }
        >
          <span className="nav-icon">
            ✦
          </span>

          <span>
            AI Assistant
          </span>
        </button>


        <button
          type="button"
          className={`nav-item ${
            currentPage === "analytics"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("analytics")
          }
        >
          <span className="nav-icon">
            ◌
          </span>

          <span>
            Analytics
          </span>
        </button>

      </nav>


      <div className="sidebar-footer">

        <div className="sidebar-footer-text">

          <div className="sidebar-footer-badge">
            ✦
          </div>

          <div>
            <p>
              CareerPilot
            </p>

            <span>
              Build your next opportunity.
            </span>
          </div>

        </div>


        <button
          type="button"
          className="sidebar-logout-button"
          onClick={onLogout}
        >
          <span className="logout-icon">
            ↙
          </span>

          <span>
            Log Out
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;