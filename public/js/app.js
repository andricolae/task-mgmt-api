// DOM Elements
const loggedOutView = document.getElementById('logged-out-view');
const loggedInView = document.getElementById('logged-in-view');
const usernameDisplay = document.getElementById('username-display');
const showLoginBtn = document.getElementById('show-login-btn');
const showRegisterBtn = document.getElementById('show-register-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormElement = document.getElementById('login-form-element');
const registerFormElement = document.getElementById('register-form-element');
const taskManagement = document.getElementById('task-management');
const createTaskBtn = document.getElementById('create-task-btn');
const taskForm = document.getElementById('task-form');
const taskFormElement = document.getElementById('task-form-element');
const taskFormTitle = document.getElementById('task-form-title');
const taskIdInput = document.getElementById('task-id');
const cancelTaskBtn = document.getElementById('cancel-task-btn');
const tasksList = document.getElementById('tasks-list');
const statusFilter = document.getElementById('status-filter');
const priorityFilter = document.getElementById('priority-filter');
const sortBy = document.getElementById('sort-by');
const notification = document.getElementById('notification');

const API_URL = '/api';

let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

showLoginBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

showRegisterBtn.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

logoutBtn.addEventListener('click', logout);

loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    login(email, password);
});

registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    register(name, email, password);
});

createTaskBtn.addEventListener('click', () => {
    resetTaskForm();
    taskForm.classList.remove('hidden');
    taskFormTitle.textContent = 'Create New Task';
});

cancelTaskBtn.addEventListener('click', () => {
    taskForm.classList.add('hidden');
});

taskFormElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        dueDate: document.getElementById('task-due-date').value || undefined,
        priority: document.getElementById('task-priority').value,
        status: document.getElementById('task-status').value
    };

    const taskId = taskIdInput.value;

    if (taskId) {
        updateTask(taskId, taskData);
    } else {
        createTask(taskData);
    }
});

statusFilter.addEventListener('change', fetchTasks);
priorityFilter.addEventListener('change', fetchTasks);
sortBy.addEventListener('change', fetchTasks);

function checkAuth() {
    if (authToken && currentUser) {
        loggedOutView.classList.add('hidden');
        loggedInView.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        taskManagement.classList.remove('hidden');

        usernameDisplay.textContent = currentUser.name;

        fetchTasks();
    } else {
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
        taskManagement.classList.add('hidden');
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to login');
        }

        authToken = data.token;
        currentUser = data.user;

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        checkAuth();

        showNotification('Logged in successfully', 'success');

        loginFormElement.reset();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function register(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to register');
        }

        authToken = data.token;
        currentUser = data.user;

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        checkAuth();

        showNotification('Registered successfully', 'success');

        registerFormElement.reset();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    checkAuth();

    showNotification('Logged out successfully', 'info');
}

async function fetchTasks() {
    try {
        const status = statusFilter.value;
        const priority = priorityFilter.value;
        const sort = sortBy.value;

        let url = `${API_URL}/tasks?`;

        if (status) url += `status=${status}&`;
        if (priority) url += `priority=${priority}&`;
        if (sort) url += `sortBy=${sort}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch tasks');
        }

        renderTasks(data);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function createTask(taskData) {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(taskData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create task');
        }

        taskForm.classList.add('hidden');

        fetchTasks();

        showNotification('Task created successfully', 'success');

        taskFormElement.reset();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateTask(taskId, taskData) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(taskData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update task');
        }

        taskForm.classList.add('hidden');

        fetchTasks();

        showNotification('Task updated successfully', 'success');

        taskFormElement.reset();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete task');
        }

        fetchTasks();

        showNotification('Task deleted successfully', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function editTask(task) {
    taskIdInput.value = task._id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-status').value = task.status;

    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toISOString().split('T')[0];
        document.getElementById('task-due-date').value = formattedDate;
    } else {
        document.getElementById('task-due-date').value = '';
    }

    taskFormTitle.textContent = 'Edit Task';
    taskForm.classList.remove('hidden');
}

function resetTaskForm() {
    taskFormElement.reset();
    taskIdInput.value = '';
}

function renderTasks(tasks) {
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = '<p>No tasks found. Create a new task to get started!</p>';
        return;
    }

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';

        let formattedDate = '';
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            formattedDate = date.toLocaleDateString();
        }

        taskElement.innerHTML = `
            <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description || 'No description'}</div>
                    <div class="task-meta">
                        <span>
                            Priority: <span class="task-priority priority-${task.priority}">${task.priority}</span>
                        </span>
                        <span>
                            Status: <span class="task-status status-${task.status}">${task.status}</span>
                        </span>
                        ${formattedDate ? `<span>Due: ${formattedDate}</span>` : ''}
                    </div>
                <div class="task-actions">
                <button class="edit-btn" data-id="${task._id}">Edit</button>
                <button class="delete-btn" data-id="${task._id}">Delete</button>
            </div>
    `;

        const editBtn = taskElement.querySelector('.edit-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => editTask(task));
        deleteBtn.addEventListener('click', () => deleteTask(task._id));

        tasksList.appendChild(taskElement);
    });
}

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = 'notification ' + type;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

checkAuth();