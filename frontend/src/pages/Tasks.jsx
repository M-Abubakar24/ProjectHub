import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
  getTasks,
  getProjects,
  getUsers,
  createTask,
} from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assigned_to: "",
    status: "TODO",
    priority: "MEDIUM",
    due_date: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [tasksData, projectsData, usersData] =
        await Promise.all([
          getTasks(),
          getProjects(),
          getUsers(),
        ]);

      const taskList = Array.isArray(tasksData)
        ? tasksData
        : tasksData.results || [];

      const projectList = Array.isArray(projectsData)
        ? projectsData
        : projectsData.results || [];

      const userList = Array.isArray(usersData)
        ? usersData
        : usersData.results || [];

      setTasks(taskList);
      setProjects(projectList);

      const employees = userList.filter(
        (user) => user.role === "EMPLOYEE"
      );

      setUsers(employees);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to load task data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.project ||
      !formData.assigned_to ||
      !formData.due_date
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newTask = await createTask({
        title: formData.title.trim(),
        description: formData.description,
        project: Number(formData.project),
        assigned_to: Number(formData.assigned_to),
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date,
      });

      setTasks((previousTasks) => [
        newTask,
        ...previousTasks,
      ]);

      setFormData({
        title: "",
        description: "",
        project: "",
        assigned_to: "",
        status: "TODO",
        priority: "MEDIUM",
        due_date: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to create task."
      );
    } finally {
      setSaving(false);
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(
      (item) => item.id === projectId
    );

    return project
      ? project.name
      : "Unknown Project";
  };

  const getEmployeeName = (userId) => {
    const user = users.find(
      (item) => item.id === userId
    );

    return user
      ? user.username
      : "Unknown Employee";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "TODO":
        return "To Do";

      case "IN_PROGRESS":
        return "In Progress";

      case "COMPLETED":
        return "Completed";

      case "BLOCKED":
        return "Blocked";

      default:
        return status;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-600";

      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-600";

      case "BLOCKED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-50 text-red-600";

      case "LOW":
        return "bg-green-50 text-green-600";

      default:
        return "bg-yellow-50 text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <TopNavbar />

      <main className="ml-64 pt-20">
        <div className="p-6 lg:p-8">

          {/* Page Header */}

          <div className="mb-8 flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Tasks
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage and track your project tasks.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowForm(!showForm)
              }
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {showForm
                ? "Cancel"
                : "+ Create Task"}
            </button>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Create Task Form */}

          {showForm && (
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-lg font-bold text-slate-900">
                Create New Task
              </h2>

              <form
                onSubmit={handleCreateTask}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >

                {/* Title */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Task Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />

                </div>

                {/* Description */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the task..."
                    rows="3"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />

                </div>

                {/* Project */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Project *
                  </label>

                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  >

                    <option value="">
                      Select project
                    </option>

                    {projects.map((project) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.name}
                      </option>
                    ))}

                  </select>

                </div>

                {/* Employee */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Assign To *
                  </label>

                  <select
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  >

                    <option value="">
                      Select employee
                    </option>

                    {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.username}
                      </option>
                    ))}

                  </select>

                </div>

                {/* Status */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  >

                    <option value="TODO">
                      To Do
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="BLOCKED">
                      Blocked
                    </option>

                  </select>

                </div>

                {/* Priority */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  >

                    <option value="LOW">
                      Low
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                  </select>

                </div>

                {/* Due Date */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Due Date *
                  </label>

                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />

                </div>

                {/* Create Button */}

                <div className="flex items-end">

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Creating..."
                      : "Create Task"}
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* Tasks */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

              <h2 className="font-bold text-slate-900">
                All Tasks
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {tasks.length} task
                {tasks.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>

            </div>

            {/* Loading */}

            {loading && (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading tasks...
              </div>
            )}

            {/* Empty */}

            {!loading && tasks.length === 0 && (
              <div className="p-10 text-center">

                <div className="text-4xl">
                  ✅
                </div>

                <p className="mt-3 font-medium text-slate-700">
                  No tasks yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Create a task to get started.
                </p>

              </div>
            )}

            {/* Task Table */}

            {!loading && tasks.length > 0 && (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>

                    <tr className="border-b bg-slate-50">

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Task
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Project
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Assigned To
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

                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <p className="font-semibold text-slate-800">
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                              {task.description}
                            </p>
                          )}

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {getProjectName(
                            task.project
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {getEmployeeName(
                            task.assigned_to
                          )}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              task.status
                            )}`}
                          >
                            {getStatusLabel(
                              task.status
                            )}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {task.due_date}
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

export default Tasks;