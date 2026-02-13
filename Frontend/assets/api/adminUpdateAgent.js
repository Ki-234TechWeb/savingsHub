const adminagentUpdate = document.getElementById("formEditAgent");
const spinnerAdminUpdateAgent = document.getElementById("spinnerUpdate");
const AdminAgentUpdate = document.querySelector(".proceedUpdate");

const adminUpAgentpage = document.querySelector('.pageloader');

if (adminagentUpdate) {
  adminagentUpdate.addEventListener("submit", handleUpdateAgent);
}

async function handleUpdateAgent(event) {
  event.preventDefault();

  let name = document.querySelector(".EditagentName").value.trim();
  let email = document.querySelector(".EditagentEmail").value.trim();
  let phone = document.querySelector(".EditagentPhone").value.trim();
  let address = document.querySelector(".EditagentAddress").value.trim();
  let agent_id = document.querySelector(".agentsid").value.trim();
 AdminAgentUpdate.style.display = "none";
  if (!name || !phone || !address) {
    showNotification("Required fields cannot be empty", "error");
     AdminAgentUpdate.style.display = "inline-block";
    return;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNotification("Invalid email format", "error");
         AdminAgentUpdate.style.display = "inline-block";
    return;
  }

  const formData = { name, email, phone, address, agent_id };
 adminUpAgentpage.style.display = "flex";
  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(`${BASE_URL}/savinghub/backend/api/admin/adminUpdateAgent.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.status === "success") {
       adminUpAgentpage.style.display = "flex";
      showNotification(data.message, "success");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showNotification(data.message, "error");
      AdminAgentUpdate.style.display = "inline-block";
      spinnerAdminUpdateAgent.style.display = "none";
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    AdminAgentUpdate.style.display = "inline-block";
      spinnerAdminUpdateAgent.style.display = "none";
  }
}
