import { useEffect, useState } from "react";

function Login() {
  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load remembered username
  useEffect(() => {
    const rememberedUsername = localStorage.getItem(
      "remembered_username"
    );

    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
    setError("");

    // Basic validation
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        }
      );

      // Try to parse response
      const data = await response.json();

      // Login failed
      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid username or password."
        );
      }

      // Make sure tokens exist
      if (!data.access || !data.refresh) {
        throw new Error("Login failed. Tokens were not received.");
      }

      // Save JWT tokens
localStorage.setItem("access_token", data.access);
localStorage.setItem("refresh_token", data.refresh);

// Get logged-in user's profile
const profileResponse = await fetch(
  "http://127.0.0.1:8000/api/auth/profile/",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${data.access}`,
      "Content-Type": "application/json",
    },
  }
);

if (!profileResponse.ok) {
  throw new Error("Unable to load user profile.");
}

const profile = await profileResponse.json();

// Save user information
localStorage.setItem("user_role", profile.role);
localStorage.setItem("username", profile.username);


      // Remember username
      if (rememberMe) {
        localStorage.setItem(
          "remembered_username",
          username.trim()
        );
      } else {
        localStorage.removeItem("remembered_username");
      }

     window.location.href = "/dashboard";
      
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = () => {
    alert("Password reset functionality will be available soon.");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">

          {/* Header */}
          <div className="text-center mb-8">

            {/* Logo */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white text-2xl font-bold shadow-md">
              P
            </div>

            {/* App Name */}
            <h1 className="text-3xl font-bold text-slate-900">
              ProjectHub
            </h1>

            {/* Tagline */}
            <p className="mt-2 text-sm text-slate-500">
              Manage projects. Manage teams. Get things done.
            </p>

          </div>

          {/* Welcome */}
          <div className="mb-6">

            <h2 className="text-xl font-semibold text-slate-900">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to access your workspace.
            </p>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              <span className="mt-0.5">
                ⚠️
              </span>

              <p>
                {error}
              </p>

            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Username */}
            <div>

              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                autoComplete="username"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between gap-4">

              {/* Remember Me */}
              <label className="flex cursor-pointer items-center gap-2">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  disabled={loading}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                />

                <span className="text-sm text-slate-600">
                  Remember me
                </span>

              </label>

              {/* Forgot Password */}
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-sm font-medium text-slate-900 hover:underline disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >

              {loading ? (
                <>
                  {/* Loading Spinner */}
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>

                  Signing in...
                </>
              ) : (
                "Sign in"
              )}

            </button>

          </form>

          {/* Security Information */}
          <div className="mt-7 border-t border-slate-200 pt-5">

            <div className="flex items-center justify-center gap-2">

              <span className="text-sm">
                🔒
              </span>

              <p className="text-xs text-slate-400">
                Your account is protected with secure authentication.
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 ProjectHub. Project Management System.
        </p>

      </div>

    </div>
  );
}

export default Login;