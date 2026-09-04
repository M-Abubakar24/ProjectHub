import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/TopNavbar";
import { getProjects, createProject } from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_manager: "",
    team_members: [],
    start_date: "",
    end_date: "",
    status: "PLANNING",
    priority: "MEDIUM",
    progress: 0,
  });

  // Load projects and users
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const [projectsData, usersResponse] = await Promise.all([
        getProjects(),

        fetch("http://127.0.0.1:8000/api/auth/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await usersResponse.json();

      setProjects(
        Array.isArray(projectsData)
          ? projectsData
          : projectsData.results || []
      );

      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const projectManagers = users.filter(
    (user) => user.role === "PROJECT_MANAGER"
  );

  const employees = users.filter(
    (user) => user.role === "EMPLOYEE"
  );

  const filteredProjects = projects.filter((project) => {
    const manager = users.find(
      (user) => user.id === project.project_manager
    );

    const managerName = manager
      ? manager.username
      : "";

    const matchesSearch =
      project.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (project.description || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      managerName
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setFormData({
      name: "",
      description: "",
      project_manager: "",
      team_members: [],
      start_date: "",
      end_date: "",
      status: "PLANNING",
      priority: "MEDIUM",
      progress: 0,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTeamMemberChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions
    );

    const selectedIds = selectedOptions.map((option) =>
      Number(option.value)
    );

    setFormData({
      ...formData,
      team_members: selectedIds,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    if (!formData.project_manager) {
      alert("Please select a Project Manager.");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newProject = await createProject({
        name: formData.name,
        description: formData.description,
        project_manager: Number(formData.project_manager),
        team_members: formData.team_members,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        priority: formData.priority,
        progress: Number(formData.progress),
      });

      setProjects((currentProjects) => [
        ...currentProjects,
        newProject,
      ]);

      setShowModal(false);

      setFormData({
        name: "",
        description: "",
        project_manager: "",
        team_members: [],
        start_date: "",
        end_date: "",
        status: "PLANNING",
        priority: "MEDIUM",
        progress: 0,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create project.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PLANNING: "Planning",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      ON_HOLD: "On Hold",
    };

    return labels[status] || status;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
    };

    return labels[priority] || priority;
  };

  const getStatusStyle = (status) => {
    if (status === "COMPLETED") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "IN_PROGRESS") {
      return "bg-blue-50 text-blue-600";
    }

    if (status === "ON_HOLD") {
      return "bg-orange-50 text-orange-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "HIGH") {
      return "bg-red-50 text-red-600";
    }

    if (priority === "MEDIUM") {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-green-50 text-green-600";
  };

  const getManagerName = (managerId) => {
    const manager = users.find(
      (user) => user.id === managerId
    );

    return manager ? manager.username : "Unknown";
  };

  const getMemberCount = (project) => {
    return project.team_members
      ? project.team_members.length
      : 0;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6 lg:p-8">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Projects
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage and track all your projects.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <span className="text-lg">+</span>
              Create Project
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Statistics */}
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Projects
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {projects.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                In Progress
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {
                  projects.filter(
                    (p) => p.status === "IN_PROGRESS"
                  ).length
                }
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {
                  projects.filter(
                    (p) => p.status === "COMPLETED"
                  ).length
                }
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Planning
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {
                  projects.filter(
                    (p) => p.status === "PLANNING"
                  ).length
                }
              </h3>
            </div>

          </div>

          {/* Search */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row">

              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-indigo-500"
              >
                <option value="All">
                  All Status
                </option>

                <option value="PLANNING">
                  Planning
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="ON_HOLD">
                  On Hold
                </option>
              </select>

            </div>
          </div>

          {/* Projects */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="font-bold text-slate-900">
                All Projects
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="text-4xl">⏳</div>

                <p className="mt-3 text-sm text-slate-500">
                  Loading projects...
                </p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-12 text-center">

                <div className="text-5xl">
                  📁
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  No projects found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first project using the button above.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-slate-100">

                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-6 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-semibold text-slate-900">
                            {project.name}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              project.status
                            )}`}
                          >
                            {getStatusLabel(project.status)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                              project.priority
                            )}`}
                          >
                            {getPriorityLabel(project.priority)} Priority
                          </span>

                        </div>

                        <p className="mt-2 max-w-2xl text-sm text-slate-500">
                          {project.description ||
                            "No description provided."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500">

                          <span>
                            👤 {getManagerName(
                              project.project_manager
                            )}
                          </span>

                          <span>
                            📅 {project.start_date}
                          </span>

                          <span>
                            🏁 {project.end_date}
                          </span>

                          <span>
                            👥 {getMemberCount(project)} members
                          </span>

                        </div>

                        <div className="mt-5 max-w-2xl">

                          <div className="mb-2 flex justify-between">

                            <span className="text-xs font-medium text-slate-500">
                              Progress
                            </span>

                            <span className="text-xs font-semibold text-slate-700">
                              {project.progress}%
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all"
                              style={{
                                width: `${project.progress}%`,
                              }}
                            ></div>

                          </div>

                        </div>

                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Project
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add a new project to ProjectHub.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the project..."
                  rows="4"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                ></textarea>
              </div>

              {/* Manager */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project Manager
                </label>

                <select
                  name="project_manager"
                  value={formData.project_manager}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">
                    Select Project Manager
                  </option>

                  {projectManagers.map((manager) => (
                    <option
                      key={manager.id}
                      value={manager.id}
                    >
                      {manager.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Members */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Team Members
                </label>

                <select
                  multiple
                  value={formData.team_members.map(String)}
                  onChange={handleTeamMemberChange}
                  className="h-32 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.username}
                    </option>
                  ))}
                </select>

                <p className="mt-1 text-xs text-slate-400">
                  Hold Ctrl and select multiple employees.
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    required
                  />
                </div>

              </div>

              {/* Status / Priority */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="PLANNING">
                      Planning
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="ON_HOLD">
                      On Hold
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

              </div>

              {/* Progress */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Progress: {formData.progress}%
                </label>

                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Creating..."
                    : "Create Project"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;