// Auth guard
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login.html';
}

const authAxios = axios.create({
  headers: { Authorization: `Bearer ${token}` }
});

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

// Initialize
const navUserDOM = document.getElementById('nav-user');
const logoutBtnDOM = document.getElementById('logout-btn');

if (navUserDOM) {
  const userName = localStorage.getItem('userName');
  navUserDOM.textContent = userName ? `Welcome, ${userName}` : '';
}

logoutBtnDOM?.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = '/login.html';
});

// DOM Elements
const editForm = document.getElementById('edit-task-form');
const taskIdDOM = document.querySelector('.task-id');
const taskNameDOM = document.getElementById('task-name');
const taskDescriptionDOM = document.getElementById('task-description');
const taskStatusDOM = document.getElementById('task-status');
const taskDueDateDOM = document.getElementById('task-due-date');
const taskCompletedDOM = document.getElementById('task-completed');
const formAlertDOM = document.getElementById('form-alert');
const saveBtn = editForm?.querySelector('button[type="submit"]');

// Get task ID from URL
const params = new URLSearchParams(window.location.search);
const taskId = params.get('id');

if (!taskId) {
  window.location.href = '/index.html';
}

// Format date for input
const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
};

// Load task
const loadTask = async () => {
  try {
    const { data: { task } } = await authAxios.get(`/api/v1/tasks/${taskId}`);
    
    taskIdDOM.textContent = task._id;
    taskNameDOM.value = task.name;
    taskDescriptionDOM.value = task.description || '';
    taskStatusDOM.value = task.status || 'pending';
    taskDueDateDOM.value = formatDateForInput(task.dueDate);
    taskCompletedDOM.checked = task.completed || false;
    
    // Set min date for due date
    const today = new Date().toISOString().split('T')[0];
    taskDueDateDOM.min = today;
  } catch (error) {
    console.error('Error loading task:', error);
    formAlertDOM.textContent = 'Failed to load task';
    formAlertDOM.className = 'form-alert error';
    formAlertDOM.style.display = 'block';
  }
};

// Save task
editForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const originalText = saveBtn.textContent;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  saveBtn.disabled = true;
  
  try {
    const taskData = {
      name: taskNameDOM.value.trim(),
      description: taskDescriptionDOM.value.trim(),
      status: taskStatusDOM.value,
      dueDate: taskDueDateDOM.value || null,
      completed: taskCompletedDOM.checked
    };
    
    if (!taskData.name) {
      throw new Error('Task title is required');
    }
    
    const { data: { task } } = await authAxios.patch(`/api/v1/tasks/${taskId}`, taskData);
    
    // Update form with server response
    taskNameDOM.value = task.name;
    taskDescriptionDOM.value = task.description || '';
    taskStatusDOM.value = task.status || 'pending';
    taskDueDateDOM.value = formatDateForInput(task.dueDate);
    taskCompletedDOM.checked = task.completed || false;
    
    // Show success
    formAlertDOM.textContent = 'Task updated successfully!';
    formAlertDOM.className = 'form-alert success';
    formAlertDOM.style.display = 'block';
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      formAlertDOM.style.display = 'none';
    }, 3000);
  } catch (error) {
    console.error('Error saving task:', error);
    formAlertDOM.textContent = error.response?.data?.msg || 'Failed to update task';
    formAlertDOM.className = 'form-alert error';
    formAlertDOM.style.display = 'block';
  } finally {
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  }ther
});

// Initialize
loadTask();