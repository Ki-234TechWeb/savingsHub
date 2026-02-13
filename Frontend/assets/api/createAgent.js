const addAgentModal = document.getElementById("addAgentModal");
const createAgent = document.querySelector(".create-agent");
const spinnerCreate = document.getElementById('loadingSpinnerCreate');
const createpage = document.querySelector('.pageloader');
addAgentModal.addEventListener("submit", handleCreateAgent);

async function handleCreateAgent(event) {
  event.preventDefault();
  spinnerCreate.style.display = "block";
  createAgent.style.display = "none";
  let name = document.querySelector(".agentName").value.trim();
  let email = document.querySelector(".agentEmail").value.trim();
  let phone = document.querySelector(".agentPhone").value.trim();
  let address = document.querySelector(".agentAddress").value.trim();
  let password = document.querySelector(".agentPassword").value.trim();
 
  // Validation
  if (!name || !phone || !address || !password) {
    showNotification("Required fields cannot be empty", "error");
    restoreCreateButton()
    return; // stop submission
  }

  if (password.length < 6) {
    showNotification("Password must be at least 6 characters", "error");
    restoreCreateButton()
    return;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    showNotification("Invalid email format", "error");
    restoreCreateButton()
    return;
  }


  // Build formData object
  const formData = {
    name: name,
    email: email,
    phone: phone,
    address: address,
    password: password,
    
  };

    createpage.style.display = "flex";
  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/createAgent.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // tell PHP it's JSON
        body: JSON.stringify(formData), // convert object to JSON string
      }
    );
    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
      createpage.style.display = "flex";
      setTimeout(() => {
        window.location.href = '';
      }, 800); 
    } else {
      showNotification(data.message, "error");
      restoreCreateButton()
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    restoreCreateButton()
  }
}


createAgent.addEventListener("click", function (event) {
  event.preventDefault(); 
  handleCreateAgent(event);
  
});

function restoreCreateButton() {
 spinnerCreate.style.display = "none";
  createAgent.style.display = "block";
  createpage.style.display = "none";
}



