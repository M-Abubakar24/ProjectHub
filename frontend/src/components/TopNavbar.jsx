import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TopNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const username =
    localStorage.getItem("remembered_username") || "User";

  const handleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("remembered_username");

  window.location.href = "/";
};

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">

        {/* Page Information */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Dashboard
          </h2>

          <p className="text-sm text-slate-500">
            Welcome back, {username}
          </p>
        </div>

        {/* User Menu */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
              {username.charAt(0).toUpperCase()}
            </div>

            {/* Username */}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {username}
              </p>

              <p className="text-xs text-slate-500">
                Project User
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {open ? "▲" : "▼"}
            </span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-xs text-slate-400">
                  Signed in as
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {username}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default TopNavbar;