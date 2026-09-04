import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/TopNavbar";
import { getProjects, getTasks } from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("user_role");
  const username =
    localStorage.getItem("remembered_username") ||
    localStorage.getItem("username") ||
    "User";

  const isEmployee = role === "EMPLOYEE";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Employees only need their assigned tasks.
      if (isEmployee) {
        const tasksData = await getTasks();

        const taskList = Array.isArray(tasksData)
          ? tasksData
          : tasksData.results || [];

        setTasks(taskList);
        return;
      }

      // Admin and Project Manager need both.
      const [projectsData, tasksData] = await Promise.all([
        getProjects(),
        getTasks(),
      ]);

      const projectList = Array.isArray(projectsData)
        ? projectsData
        : projectsData.results || [];

      const taskList = Array.isArray(tasksData)
        ? tasksData
        : tasksData.results || [];

      setProjects(projectList);
      setTasks(taskList);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Project Statistics
  // =========================

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) =>
      project.status === "IN_PROGRESS" ||
      project.status === "in_progress" ||
      project.status === "In Progress"
  ).length;

  // =========================
  // Task Statistics
  // =========================

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) =>
      task.status === "PENDING" ||
      task.status === "pending" ||
      task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "IN_PROGRESS" ||
      task.status === "in_progress" ||
      task.status === "In Progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "COMPLETED" ||
      task.status === "completed" ||
      task.status === "Completed"
  ).length;

  // =========================
  // Employee Dashboard
  // =========================

  if (isEmployee) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar />
        <Navbar />

        <main className="ml-64 pt-20">
          <div className="p-6 lg:p-8">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                My Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Welcome back, {username}. Here are your assigned tasks.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Employee Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      My Tasks
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "..." : totalTasks}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                    📋
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Tasks assigned to you
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Pending
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "..." : pendingTasks}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                    ⏳
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Waiting to be started
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      In Progress
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "..." : inProgressTasks}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                    🚀
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Currently working on
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Completed
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "..." : completedTasks}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                    ✅
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Successfully completed
                </p>
              </div>

            </div>

            {/* My Tasks */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="font-bold text-slate-900">
                  My Assigned Tasks
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Tasks assigned specifically to you
                </p>
              </div>

              {loading ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Loading your tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="text-4xl">🎉</div>

                  <p className="mt-3 font-medium text-slate-700">
                    No tasks assigned
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Your assigned tasks will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">

                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Task
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Project
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Priority
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Due Date
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {tasks.slice(0, 10).map((task) => (
                        <tr
                          key={task.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-800">
                              {task.title}
                            </p>

                            {task.description && (
                              <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                {task.description}
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {task.project_name ||
                              task.project ||
                              "Project"}
                          </td>

                          <td className="px-6 py-4">
                            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
                              {task.priority || "Medium"}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                              {task.status || "Pending"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {task.due_date || "No due date"}
                          </td>

                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>
        </main>
      </div>
    );
  }

  // =========================
  // Admin / Project Manager
  // =========================

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6 lg:p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Projects
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : totalProjects}
              </h3>

              <p className="mt-4 text-xs text-slate-500">
                All projects
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Active Projects
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : activeProjects}
              </h3>

              <p className="mt-4 text-xs text-slate-500">
                Currently running
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Tasks
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : totalTasks}
              </h3>

              <p className="mt-4 text-xs text-slate-500">
                All tasks
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Pending Tasks
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : pendingTasks}
              </h3>

              <p className="mt-4 text-xs text-slate-500">
                Waiting to be completed
              </p>
            </div>

          </div>

          {/* Recent Projects */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Projects
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Projects from your workspace
                </p>
              </div>

              <button
                onClick={() => {
                  window.location.href = "/projects";
                }}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View All
              </button>

            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl">📁</div>

                <p className="mt-3 font-medium text-slate-700">
                  No projects yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">

                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="px-6 py-5 hover:bg-slate-50"
                  >

                    <div className="flex items-center justify-between">

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {project.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {project.description || "No description"}
                        </p>
                      </div>

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                        {project.status || "Active"}
                      </span>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Tasks */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

              <h2 className="font-bold text-slate-900">
                Recent Tasks
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest tasks from your workspace
              </p>

            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl">✅</div>

                <p className="mt-3 font-medium text-slate-700">
                  No tasks yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Task
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Project
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Priority
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {tasks.slice(0, 5).map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">
                            {task.title}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {task.project_name ||
                            task.project ||
                            "Project"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
                            {task.priority || "Medium"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                            {task.status || "Pending"}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;