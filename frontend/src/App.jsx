import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";

function App() {
  const isAuthenticated =
    localStorage.getItem("access_token");

  const userRole =
    localStorage.getItem("user_role");

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Projects */}
        <Route
          path="/projects"
          element={
            isAuthenticated &&
            (userRole === "ADMIN" ||
              userRole === "PROJECT_MANAGER") ? (
              <Projects />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;