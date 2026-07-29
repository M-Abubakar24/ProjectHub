# 🚀 ProjectHub - Project Management System

A modern **Project Management System** built with **Django**, **Django REST Framework**, and **React**. The application enables organizations to manage projects, teams, tasks, and progress through a secure, role-based platform.

---

## 📌 Project Overview

ProjectHub is a full-stack web application designed to streamline project planning and collaboration. It provides different user roles with dedicated dashboards, task management, project tracking, and secure authentication.

This project is being developed as a portfolio project following industry best practices.

---

## ✨ Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Role-Based Authorization
- User Profile Management

### User Roles
- Admin
- Project Manager
- Employee

### Project Management
- Create Projects
- Update Projects
- Delete Projects
- Assign Team Members
- Track Project Progress

### Task Management
- Create Tasks
- Assign Tasks
- Update Task Status
- Task Priorities
- Due Dates

### Dashboard
- Admin Dashboard
- Project Manager Dashboard
- Employee Dashboard

### Notifications
- Task Assignment Notifications
- Deadline Reminders

### Reports
- Project Reports
- Task Reports

---

## 🛠️ Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication
- SQLite (Development)
- PostgreSQL (Production)

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Tools
- Git
- GitHub
- VS Code
- Postman

---

## 📂 Project Structure

```text
ProjectHub/
│
├── accounts/
├── activity/
├── config/
├── dashboard/
├── notifications/
├── projects/
├── reports/
├── tasks/
├── media/
├── static/
├── manage.py
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/M-Abubakar24/ProjectHub.git
```

```bash
cd ProjectHub
```

### Create a virtual environment

```bash
python -m venv venv
```

### Activate the virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory.

```env
SECRET_KEY=your_secret_key
DEBUG=True
```

---

## ▶️ Run the Project

Apply migrations

```bash
python manage.py migrate
```

Start the development server

```bash
python manage.py runserver
```

Open your browser:

```
http://127.0.0.1:8000/
```

---

## 🗺️ Development Roadmap

- [x] Django Project Setup
- [x] Custom User Model
- [ ] JWT Authentication
- [ ] User Registration API
- [ ] Login API
- [ ] Project CRUD
- [ ] Task CRUD
- [ ] Team Management
- [ ] Dashboards
- [ ] Notifications
- [ ] Reports
- [ ] React Frontend
- [ ] Deployment

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Muhammad Abubakar**

GitHub: https://github.com/M-Abubakar24