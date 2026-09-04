const API_URL = "http://127.0.0.1:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// ==================== PROJECTS ====================

export async function getProjects() {
  const response = await fetch(`${API_URL}/projects/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error("Your session has expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function createProject(projectData) {
  const response = await fetch(`${API_URL}/projects/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  });

  if (response.status === 401) {
    throw new Error("Your session has expired. Please login again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create project");
  }

  return data;
}

// ==================== TASKS ====================

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error("Your session has expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function createTask(taskData) {
  const response = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  if (response.status === 401) {
    throw new Error("Your session has expired. Please login again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create task");
  }

  return data;
}

// ==================== USERS ====================

export async function getUsers() {
  const response = await fetch(`${API_URL}/auth/users/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error("Your session has expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}