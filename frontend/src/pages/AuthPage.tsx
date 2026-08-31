import {
    useState,
  } from "react";
  
  import "./AuthPage.css";
  
  import {
    setToken,
  } from "../api/api";
  
  
  type AuthPageProps = {
    onAuthenticated: (
      token: string
    ) => void;
  };
  
  
  type AuthResponse = {
    id: number;
    name: string;
    email: string;
    token: string;
  };
  
  
  function AuthPage({
    onAuthenticated,
  }: AuthPageProps) {
  
    const [mode, setMode] =
      useState<"login" | "register">(
        "login"
      );
  
    const [name, setName] =
      useState("");
  
    const [email, setEmail] =
      useState("");
  
    const [password, setPassword] =
      useState("");
  
    const [error, setError] =
      useState("");
  
    const [loading, setLoading] =
      useState(false);
  
  
    // =========================
    // LOGIN
    // =========================
  
    const login = async (
      loginEmail: string,
      loginPassword: string
    ) => {
  
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
  
          headers: {
            "Content-Type":
              "application/json",
          },
  
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );
  
  
      const data =
        await response.json();
  
  
      if (!response.ok) {
  
        throw new Error(
          data.message ||
            "Unable to log in."
        );
  
      }
  
  
      const authData =
        data as AuthResponse;
  
  
      setToken(
        authData.token
      );
  
  
      onAuthenticated(
        authData.token
      );
  
    };
  
  
    // =========================
    // SUBMIT
    // =========================
  
    const handleSubmit = async (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {
  
      event.preventDefault();
  
      setError("");
      setLoading(true);
  
  
      try {
  
        if (mode === "register") {
  
          const registerResponse =
            await fetch(
              "http://localhost:8080/api/auth/register",
              {
                method: "POST",
  
                headers: {
                  "Content-Type":
                    "application/json",
                },
  
                body: JSON.stringify({
                  name,
                  email,
                  password,
                }),
              }
            );
  
  
          const registerData =
            await registerResponse.json();
  
  
          if (!registerResponse.ok) {
  
            throw new Error(
              registerData.message ||
                "Unable to create account."
            );
  
          }
  
  
          await login(
            email,
            password
          );
  
          return;
        }
  
  
        await login(
          email,
          password
        );
  
  
      } catch (error) {
  
        if (error instanceof Error) {
  
          setError(
            error.message
          );
  
        } else {
  
          setError(
            "Something went wrong."
          );
  
        }
  
      } finally {
  
        setLoading(false);
  
      }
  
    };
  
  
    // =========================
    // SWITCH MODE
    // =========================
  
    const switchMode = () => {
  
      setError("");
  
      setMode(
        mode === "login"
          ? "register"
          : "login"
      );
  
    };
  
  
    // =========================
    // UI
    // =========================
  
    return (
  
      <main className="auth-page">
  
        <section className="auth-layout">
  
          <aside className="auth-showcase">
  
            <div className="auth-showcase-top">
  
              <div className="auth-logo">
  
                <div className="auth-logo-mark">
                  C
                </div>
  
                <div>
                  <h1>
                    CareerPilot
                  </h1>
  
                  <p>
                    Your cozy career space
                  </p>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="auth-showcase-content">
  
              <p className="auth-showcase-kicker">
                YOUR NEXT OPPORTUNITY ✦
              </p>
  
              <h2>
                Make your job search
                feel a little more
                organized.
              </h2>
  
              <p className="auth-showcase-description">
                Track applications,
                follow your progress,
                and keep every opportunity
                in one calm workspace.
              </p>
  
  
              <div className="auth-feature-list">
  
                <div className="auth-feature">
  
                  <span className="auth-feature-icon">
                    ✦
                  </span>
  
                  <div>
                    <strong>
                      Stay organized
                    </strong>
  
                    <p>
                      Keep every role and
                      application status together.
                    </p>
                  </div>
  
                </div>
  
  
                <div className="auth-feature">
  
                  <span className="auth-feature-icon">
                    ◫
                  </span>
  
                  <div>
                    <strong>
                      Follow your progress
                    </strong>
  
                    <p>
                      See interviews,
                      offers, and outcomes
                      at a glance.
                    </p>
                  </div>
  
                </div>
  
  
                <div className="auth-feature">
  
                  <span className="auth-feature-icon">
                    ◌
                  </span>
  
                  <div>
                    <strong>
                      Learn from your search
                    </strong>
  
                    <p>
                      Use analytics to understand
                      how your pipeline is moving.
                    </p>
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
  
            <div className="auth-showcase-footer">
              Built for calmer job searching.
            </div>
  
          </aside>
  
  
          <section className="auth-form-side">
  
            <div className="auth-card">
  
              <div className="auth-mobile-brand">
  
                <div className="auth-logo-mark">
                  C
                </div>
  
                <span>
                  CareerPilot
                </span>
  
              </div>
  
  
              <div className="auth-heading">
  
                <p className="auth-heading-kicker">
                  {mode === "login"
                    ? "WELCOME BACK ✦"
                    : "LET'S GET STARTED ✦"}
                </p>
  
                <h2>
                  {mode === "login"
                    ? "Welcome back"
                    : "Create your account"}
                </h2>
  
                <p>
                  {mode === "login"
                    ? "Sign in and pick up where you left off."
                    : "Create your CareerPilot space and start tracking your opportunities."}
                </p>
  
              </div>
  
  
              <div className="auth-mode-switch">
  
                <button
                  type="button"
                  className={
                    mode === "login"
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setError("");
                    setMode("login");
                  }}
                >
                  Sign in
                </button>
  
                <button
                  type="button"
                  className={
                    mode === "register"
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setError("");
                    setMode("register");
                  }}
                >
                  Create account
                </button>
  
              </div>
  
  
              <form
                className="auth-form"
                onSubmit={
                  handleSubmit
                }
              >
  
                {mode === "register" && (
  
                  <div className="auth-field">
  
                    <label htmlFor="name">
                      Name
                    </label>
  
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={
                        (event) =>
                          setName(
                            event.target.value
                          )
                      }
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
  
                  </div>
  
                )}
  
  
                <div className="auth-field">
  
                  <label htmlFor="email">
                    Email
                  </label>
  
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={
                      (event) =>
                        setEmail(
                          event.target.value
                        )
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
  
                </div>
  
  
                <div className="auth-field">
  
                  <label htmlFor="password">
                    Password
                  </label>
  
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={
                      (event) =>
                        setPassword(
                          event.target.value
                        )
                    }
                    placeholder={
                      mode === "login"
                        ? "Enter your password"
                        : "Choose a password"
                    }
                    autoComplete={
                      mode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                    required
                  />
  
                </div>
  
  
                {error && (
  
                  <div
                    className="auth-error"
                    role="alert"
                  >
                    <span>
                      !
                    </span>
  
                    <p>
                      {error}
                    </p>
                  </div>
  
                )}
  
  
                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
  
                  {loading
                    ? "Please wait..."
                    : mode === "login"
                      ? "Sign In"
                      : "Create Account"}
  
                  {!loading && (
                    <span>
                      →
                    </span>
                  )}
  
                </button>
  
              </form>
  
  
              <div className="auth-switch">
  
                <span>
  
                  {mode === "login"
                    ? "New to CareerPilot?"
                    : "Already have an account?"}
  
                </span>
  
                <button
                  type="button"
                  onClick={
                    switchMode
                  }
                >
  
                  {mode === "login"
                    ? "Create an account"
                    : "Sign in instead"}
  
                </button>
  
              </div>
  
  
              <p className="auth-note">
                Your applications stay connected
                to your account.
              </p>
  
            </div>
  
          </section>
  
        </section>
  
      </main>
  
    );
  
  }
  
  export default AuthPage;