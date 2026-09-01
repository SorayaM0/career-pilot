import {
    describe,
    expect,
    it,
    vi,
  } from "vitest";
  
  import {
    fireEvent,
    render,
    screen,
    waitFor,
  } from "@testing-library/react";
  
  import AuthPage from "./AuthPage";
  
  
  describe("AuthPage", () => {
  
    it("shows the login form by default", () => {
  
      const onAuthenticated = vi.fn();
  
      render(
        <AuthPage
          onAuthenticated={onAuthenticated}
        />
      );
  
      expect(
        screen.getByRole(
          "heading",
          {
            name: "Welcome back",
          }
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText("Email")
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText("Password")
      ).toBeInTheDocument();
  
      expect(
        screen.queryByLabelText("Name")
      ).not.toBeInTheDocument();
  
    });
  
  
    it("switches to the registration form", () => {
  
      const onAuthenticated = vi.fn();
  
      render(
        <AuthPage
          onAuthenticated={onAuthenticated}
        />
      );
  
      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create account",
          }
        )
      );
  
      expect(
        screen.getByRole(
          "heading",
          {
            name: "Create your account",
          }
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText("Name")
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText("Email")
      ).toBeInTheDocument();
  
      expect(
        screen.getByLabelText("Password")
      ).toBeInTheDocument();
  
    });
  
  
    it("logs in successfully and stores the token", async () => {
  
      const onAuthenticated = vi.fn();
  
      const fetchMock = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              id: 1,
              name: "Soraya",
              email: "soraya@example.com",
              token: "test-jwt-token",
            }),
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
        <AuthPage
          onAuthenticated={onAuthenticated}
        />
      );
  
      fireEvent.change(
        screen.getByLabelText("Email"),
        {
          target: {
            value: "soraya@example.com",
          },
        }
      );
  
      fireEvent.change(
        screen.getByLabelText("Password"),
        {
          target: {
            value: "password123",
          },
        }
      );
  
      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: /^Sign In/,
          }
        )
      );
  
      await waitFor(() => {
  
        expect(
          fetchMock
        ).toHaveBeenCalledWith(
          "http://localhost:8080/api/auth/login",
          expect.objectContaining({
            method: "POST",
          })
        );
  
      });
  
      expect(
        localStorage.getItem(
          "careerpilot_token"
        )
      ).toBe(
        "test-jwt-token"
      );
  
      expect(
        onAuthenticated
      ).toHaveBeenCalledWith(
        "test-jwt-token"
      );
  
    });
  
  
    it("shows an error when login fails", async () => {
  
      const onAuthenticated = vi.fn();
  
      vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              message:
                "Invalid email or password.",
            }),
            {
              status: 401,
              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          )
        );
  
      render(
        <AuthPage
          onAuthenticated={onAuthenticated}
        />
      );
  
      fireEvent.change(
        screen.getByLabelText("Email"),
        {
          target: {
            value: "wrong@example.com",
          },
        }
      );
  
      fireEvent.change(
        screen.getByLabelText("Password"),
        {
          target: {
            value: "wrongpassword",
          },
        }
      );
  
      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: /^Sign In/,
          }
        )
      );
  
      await waitFor(() => {
  
        expect(
          screen.getByRole("alert")
        ).toHaveTextContent(
          "Invalid email or password."
        );
  
      });
  
      expect(
        onAuthenticated
      ).not.toHaveBeenCalled();
  
      expect(
        localStorage.getItem(
          "careerpilot_token"
        )
      ).toBeNull();
  
    });
  
  
    it("registers a new user and logs them in", async () => {
  
      const onAuthenticated = vi.fn();
  
      const fetchMock = vi
        .spyOn(globalThis, "fetch")
  
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              id: 1,
              name: "Soraya",
              email: "soraya@example.com",
            }),
            {
              status: 200,
              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          )
        )
  
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              id: 1,
              name: "Soraya",
              email: "soraya@example.com",
              token: "registered-jwt-token",
            }),
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
        <AuthPage
          onAuthenticated={onAuthenticated}
        />
      );
  
      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create account",
          }
        )
      );
  
      fireEvent.change(
        screen.getByLabelText("Name"),
        {
          target: {
            value: "Soraya",
          },
        }
      );
  
      fireEvent.change(
        screen.getByLabelText("Email"),
        {
          target: {
            value: "soraya@example.com",
          },
        }
      );
  
      fireEvent.change(
        screen.getByLabelText("Password"),
        {
          target: {
            value: "password123",
          },
        }
      );
  
      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: /^Create Account/,
          }
        )
      );
  
      await waitFor(() => {
  
        expect(
          fetchMock
        ).toHaveBeenCalledTimes(2);
  
      });
  
      expect(
        fetchMock
      ).toHaveBeenNthCalledWith(
        1,
        "http://localhost:8080/api/auth/register",
        expect.objectContaining({
          method: "POST",
        })
      );
  
      expect(
        fetchMock
      ).toHaveBeenNthCalledWith(
        2,
        "http://localhost:8080/api/auth/login",
        expect.objectContaining({
          method: "POST",
        })
      );
  
      expect(
        localStorage.getItem(
          "careerpilot_token"
        )
      ).toBe(
        "registered-jwt-token"
      );
  
      expect(
        onAuthenticated
      ).toHaveBeenCalledWith(
        "registered-jwt-token"
      );
  
    });
  
  });