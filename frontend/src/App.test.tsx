import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
  } from "vitest";
  
  import {
    render,
    screen,
    waitFor,
  } from "@testing-library/react";
  
  import App from "./App";
  
  import {
    apiFetch,
    getToken,
    removeToken,
  } from "./api/api";
  
  
  vi.mock(
    "./api/api",
    () => ({
      apiFetch: vi.fn(),
      getToken: vi.fn(),
      removeToken: vi.fn(),
    })
  );
  
  
  vi.mock(
    "./pages/AuthPage",
    () => ({
      default: () => (
        <div>
          Mock Auth Page
        </div>
      ),
    })
  );
  
  
  vi.mock(
    "./components/Sidebar",
    () => ({
      default: () => (
        <div>
          Mock Sidebar
        </div>
      ),
    })
  );
  
  
  vi.mock(
    "./pages/Dashboard",
    () => ({
      default: ({
        applications,
      }: {
        applications: Array<{
          id: number;
          company: string;
        }>;
      }) => (
        <div>
          <div>
            Mock Dashboard
          </div>
  
          <div>
            Application count:
            {" "}
            {applications.length}
          </div>
  
          {applications.map(
            (application) => (
              <div
                key={application.id}
              >
                {application.company}
              </div>
            )
          )}
        </div>
      ),
    })
  );
  
  
  vi.mock(
    "./pages/Applications",
    () => ({
      default: () => (
        <div>
          Mock Applications
        </div>
      ),
    })
  );
  
  
  vi.mock(
    "./pages/Analytics",
    () => ({
      default: () => (
        <div>
          Mock Analytics
        </div>
      ),
    })
  );
  
  
  vi.mock(
    "./pages/ApplicationDetails",
    () => ({
      default: () => (
        <div>
          Mock Application Details
        </div>
      ),
    })
  );
  
  
  vi.mock(
    "./pages/AIAssistant",
    () => ({
      default: () => (
        <div>
          Mock AI Assistant
        </div>
      ),
    })
  );
  
  
  vi.mock(
    "./components/AddApplicationModal",
    () => ({
      default: () => (
        <div>
          Mock Add Application Modal
        </div>
      ),
    })
  );
  
  
  vi.mock(
    "./components/EditApplicationModal",
    () => ({
      default: () => (
        <div>
          Mock Edit Application Modal
        </div>
      ),
    })
  );
  
  
  describe(
    "App",
    () => {
  
      beforeEach(() => {
  
        vi.clearAllMocks();
  
      });
  
  
      it(
        "shows the authentication page when there is no token",
        () => {
  
          vi.mocked(
            getToken
          ).mockReturnValue(
            null
          );
  
          render(
            <App />
          );
  
          expect(
            screen.getByText(
              "Mock Auth Page"
            )
          ).toBeInTheDocument();
  
          expect(
            apiFetch
          ).not.toHaveBeenCalled();
  
        }
      );
  
  
      it(
        "loads applications when the user is authenticated",
        async () => {
  
          vi.mocked(
            getToken
          ).mockReturnValue(
            "test-jwt-token"
          );
  
          vi.mocked(
            apiFetch
          ).mockResolvedValue(
            new Response(
              JSON.stringify([
                {
                  id: 1,
                  company: "OpenAI",
                  position:
                    "Software Engineer",
                  location:
                    "San Francisco",
                  status: "Applied",
                  jobUrl:
                    "https://example.com/job",
                  dateApplied:
                    "2026-09-01",
                  jobDescription:
                    "Example job description",
                },
              ]),
              {
                status: 200,
                headers: {
                  "Content-Type":
                    "application/json",
                },
              }
            )
          );
  
          render(
            <App />
          );
  
          expect(
            screen.getByText(
              "Mock Dashboard"
            )
          ).toBeInTheDocument();
  
          await waitFor(() => {
  
            expect(
              apiFetch
            ).toHaveBeenCalledWith(
              "/api/applications"
            );
  
          });
  
          await waitFor(() => {
  
            expect(
              screen.getByText(
                "OpenAI"
              )
            ).toBeInTheDocument();
  
          });
  
          expect(
            screen.getByText(
              /Application count:/
            )
          ).toHaveTextContent(
            "Application count: 1"
          );
  
        }
      );
  
  
      it(
        "logs the user out when loading applications returns 401",
        async () => {
  
          vi.mocked(
            getToken
          ).mockReturnValue(
            "expired-jwt-token"
          );
  
          vi.mocked(
            apiFetch
          ).mockResolvedValue(
            new Response(
              null,
              {
                status: 401,
              }
            )
          );
  
          render(
            <App />
          );
  
          await waitFor(() => {
  
            expect(
              apiFetch
            ).toHaveBeenCalledWith(
              "/api/applications"
            );
  
          });
  
          await waitFor(() => {
  
            expect(
              removeToken
            ).toHaveBeenCalledTimes(1);
  
          });
  
          await waitFor(() => {
  
            expect(
              screen.getByText(
                "Mock Auth Page"
              )
            ).toBeInTheDocument();
  
          });
  
          expect(
            screen.queryByText(
              "Mock Dashboard"
            )
          ).not.toBeInTheDocument();
  
        }
      );
  
    }
  );