    // Notification System
function showNotification(message, type = "info") {
  const container = document.getElementById("notificationsContainer");
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
                ${message}
  
            `;
  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}
    
    
    
    
    
    // const form = document.getElementById('loginForm');
    // const errorMsg = document.getElementById('errorMsg');
    // const loginBtn = document.getElementById('loginBtn');

    // form.addEventListener('submit', async (e) => {
    //   e.preventDefault();
    //   errorMsg.style.display = 'none';
    //   loginBtn.disabled = true;
    //   loginBtn.textContent = 'Signing in...';

    //   const username = document.getElementById('username').value.trim();
    //   const password = document.getElementById('password').value;

    //   try {
    //     const res = await fetch('/api/login.php', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ username, password })
    //     });

    //     const data = await res.json();

    //     if (!res.ok) {
    //       throw new Error(data.error || 'Login failed');
    //     }

    //     // Save token
    //     localStorage.setItem('token', data.token);

    //     // Redirect
    //     window.location.href = '/dashboard.html';

    //   } catch (err) {
    //     errorMsg.textContent = err.message;
    //     errorMsg.style.display = 'block';
    //   } finally {
    //     loginBtn.disabled = false;
    //     loginBtn.textContent = 'Login';
    //   }
    // });