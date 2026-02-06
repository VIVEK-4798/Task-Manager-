// Auth guard
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login.html';
}

// Axios instance with auth
const authAxios = axios.create({
  headers: { Authorization: `Bearer ${token}` }
});

// Global 401 handler
authAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.location.href = '/login.html';
    }
    return Promise.reject(error);
  }
);

// DOM Elements
const tasksGrid = document.getElementById('tasks-grid');
const loadingDOM = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.getElementById('task-name');
const taskDescriptionDOM = document.getElementById('task-description');
const taskStatusDOM = document.getElementById('task-status');
const taskDueDateDOM = document.getElementById('task-due-date');
const formAlertDOM = document.getElementById('form-alert');
const filterStatusDOM = document.getElementById('filter-status');
const searchInputDOM = document.getElementById('search-input');
const navUserDOM = document.getElementById('nav-user');
const logoutBtnDOM = document.getElementById('logout-btn');

// Initialize
if (navUserDOM) {
  const userName = localStorage.getItem('userName');
  navUserDOM.textContent = userName ? `Welcome, ${userName}` : '';
}

logoutBtnDOM?.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = '/login.html';
});

// Status configuration
const statusConfig = {
  pending: { 
    label: 'Pending', 
    class: 'status-pending',
    icon: 'fas fa-clock'
  },
  'in-progress': { 
    label: 'In Progress', 
    class: 'status-in-progress',
    icon: 'fas fa-spinner'
  },
  completed: { 
    label: 'Completed', 
    class: 'status-completed',
    icon: 'fas fa-check-circle'
  }
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Check if overdue
const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'completed') return false;
  return new Date(dateStr) < new Date().setHours(0, 0, 0, 0);
};

// Show alert
const showAlert = (element, message, isSuccess = false) => {
  element.textContent = message;
  element.className = `form-alert ${isSuccess ? 'success' : 'error'}`;
  element.style.display = 'block';
  
  setTimeout(() => {
    element.style.display = 'none';
  }, 3000);
};

// Render tasks
const renderTasks = async () => {
  loadingDOM.style.display = 'flex';
  tasksGrid.innerHTML = '';
  
  try {
    const params = {};
    const filterVal = filterStatusDOM.value;
    if (filterVal !== 'all') params.status = filterVal;
    
    const searchVal = searchInputDOM.value.trim();
    if (searchVal) params.search = searchVal;

    const { data: { tasks } } = await authAxios.get('/api/v1/tasks', { params });

    if (!tasks.length) {
      loadingDOM.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    
    tasks.forEach(task => {
      const {
        _id: taskID,
        name,
        description,
        status,
        dueDate,
        completed
      } = task;

      const dueDateFormatted = formatDate(dueDate);
      const overdue = isOverdue(dueDate, status);
      const statusInfo = statusConfig[status] || statusConfig.pending;
      
      const taskCard = document.createElement('div');
      taskCard.className = `task-card ${status} ${overdue ? 'overdue' : ''} fade-in`;
      taskCard.innerHTML = `
        <div class="task-content">
          <div class="task-title ${completed ? 'completed' : ''}">
            <i class="${statusInfo.icon}"></i>
            ${name}
          </div>
          ${description ? `<p class="task-description">${description}</p>` : ''}
          <div class="task-meta">
            <span class="task-status ${statusInfo.class}">
              ${statusInfo.label}
            </span>
            ${dueDateFormatted ? `
              <span class="task-due ${overdue ? 'overdue' : ''}">
                <i class="far fa-calendar"></i>
                ${dueDateFormatted} ${overdue ? '(Overdue)' : ''}
              </span>
            ` : ''}
          </div>
        </div>
        <div class="task-actions">
          <a href="task.html?id=${taskID}" class="task-action-btn edit-btn" title="Edit">
            <i class="fas fa-edit"></i>
          </a>
          <button class="task-action-btn delete-btn" data-id="${taskID}" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      tasksGrid.appendChild(taskCard);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
    emptyState.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Unable to load tasks</h3>
        <p>Please try again later</p>
      </div>
    `;
    emptyState.style.display = 'block';
  }
  
  loadingDOM.style.display = 'none';
};

// Initialize tasks
renderTasks();

// Event listeners
filterStatusDOM.addEventListener('change', renderTasks);

let searchTimeout;
searchInputDOM.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(renderTasks, 500);
});

// Delete task
tasksGrid.addEventListener('click', async (e) => {
  const deleteBtn = e.target.closest('.delete-btn');
  if (deleteBtn) {
    const taskId = deleteBtn.dataset.id;
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await authAxios.delete(`/api/v1/tasks/${taskId}`);
        renderTasks();
        showAlert(formAlertDOM, 'Task deleted successfully', true);
      } catch (error) {
        showAlert(formAlertDOM, 'Failed to delete task');
      }
    }
  }
});

// Create task
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const taskData = {
    name: taskInputDOM.value.trim(),
    description: taskDescriptionDOM.value.trim(),
    status: taskStatusDOM.value,
    dueDate: taskDueDateDOM.value || null
  };
  
  if (!taskData.name) {
    showAlert(formAlertDOM, 'Task title is required');
    return;
  }
  
  try {
    await authAxios.post('/api/v1/tasks', taskData);
    
    // Reset form
    taskInputDOM.value = '';
    taskDescriptionDOM.value = '';
    taskStatusDOM.value = 'pending';
    taskDueDateDOM.value = '';
    
    // Refresh tasks
    renderTasks();
    
    // Show success
    showAlert(formAlertDOM, 'Task added successfully!', true);
  } catch (error) {
    showAlert(formAlertDOM, error.response?.data?.msg || 'Failed to add task');
  }
});

// Set today's date as default for due date
const today = new Date().toISOString().split('T')[0];
taskDueDateDOM.min = today;