// Redirect if already logged in
if (localStorage.getItem('token')) {
  window.location.href = '/index.html';
}

// DOM Elements
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginAlert = document.getElementById('login-alert');
const registerAlert = document.getElementById('register-alert');

// Toggle forms
showRegisterLink?.addEventListener('click', (e) => {
  e.preventDefault();
  loginCard.classList.add('hidden');
  registerCard.classList.remove('hidden');
});

showLoginLink?.addEventListener('click', (e) => {
  e.preventDefault();
  registerCard.classList.add('hidden');
  loginCard.classList.remove('hidden');
});

// Show alert helper
const showAlert = (element, message, isSuccess = false) => {
  element.textContent = message;
  element.className = `form-alert ${isSuccess ? 'success' : 'error'}`;
  element.style.display = 'block';
  
  setTimeout(() => {
    element.style.display = 'none';
  }, 4000);
};

// Login
const loginForm = document.getElementById('login-form');
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  
  try {
    const { data } = await axios.post('/api/auth/login', { email, password });
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.user.name);
    
    showAlert(loginAlert, 'Login successful! Redirecting...', true);
    
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 500);
  } catch (error) {
    const message = error.response?.data?.msg || 'Login failed. Please try again.';
    showAlert(loginAlert, message);
  }
});

// Register
const registerForm = document.getElementById('register-form');
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  
  if (password.length < 6) {
    showAlert(registerAlert, 'Password must be at least 6 characters');
    return;
  }
  
  try {
    const { data } = await axios.post('/api/auth/register', {
      name,
      email,
      password
    });
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.user.name);
    
    showAlert(registerAlert, 'Registration successful! Welcome!', true);
    
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 500);
  } catch (error) {
    const message = error.response?.data?.msg || 'Registration failed. Please try again.';
    showAlert(registerAlert, message);
  }
});