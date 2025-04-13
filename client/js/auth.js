// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      })
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/crud/index.html';
    } else {
      alert(data.error || 'Login failed');
    }
  });
  
  // Handle registration form submission
  document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Registration successful! Please login.');
      window.location.href = '/auth/login.html';
    } else {
      alert(data.error || 'Registration failed');
    }
  });