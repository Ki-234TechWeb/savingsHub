document.addEventListener("click", function (e) {
  if (e.target.classList.contains("loginBtn")) {
    loginAction(e);
  }
});

async function loginAction(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  // Validation
  if (!username ) {
    showNotification("Name field cannot be empty", "error");
    return;
  }
   if(!password) {
    showNotification("Password field cannot be empty", "error");
    return;
  }

  if (password.length < 6) {
    showNotification("Password must be at least 6 characters", "error");
    return;
  }

  const BASE_URL = window.location.origin;

  try {
    const res = await fetch(
      `${BASE_URL}/savinghub/backend/api/auth/login.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await res.json();

    // ❌ Login failed
    if (!res.ok || data.status !== "success") {
      showNotification(data.message || "Invalid login", "error");
      return;
    }

    // ✅ Store auth data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user_role", data.user_role);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("user_name", data.username);

    showNotification("Login successful", "success");

    setTimeout(() => {
      // 🔀 Role-based redirect
      if (data.user_role === "agent") {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      } else if (data.user_role === "admin") {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/admin.html`;
      } else {
        // ❌ Unknown role — force logout
        localStorage.clear();
        showNotification("Unauthorized role. Contact admin.", "error");
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/login.html`;
      }
    }, 800);

  } catch (error) {
    showNotification("Server error. Please try again.", "error");
  }
}
