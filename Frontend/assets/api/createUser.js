const form = document.getElementById('form');

form.addEventListener("submit", handleCreateUser);

async function handleCreateUser(event) {
  event.preventDefault();
 let select = document.querySelector(".agent");
  let name = document.querySelector(".name").value.trim();
  let email = document.querySelector(".email").value.trim();
  let phone = document.querySelector(".phone").value.trim();
  let address = document.querySelector(".address").value.trim();
  let nextofKin = document.querySelector(".nextofKin").value.trim();
  let password = document.querySelector(".password").value.trim();
  let agent = select.value.trim();
  let agent_id = select.options[select.selectedIndex].dataset.agent_id;
  // Validation
  if (!name || !phone || !address || !password ) {
    showNotification("Required fields cannot be empty", "error");
    return; // stop submission
  }

  if (password.length < 6) {
    showNotification("Password must be at least 6 characters", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNotification("Invalid email format", "error");
    return;
  }

  // Build formData object
 const formData = {
  name: name,
  email: email,
  phone: phone,
  address: address,
  nextofKin: nextofKin,
  password: password,
  agent: agent,
  agent_id : agent_id
};

  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(`${BASE_URL}/savinghub/backend/api/staff/createUser.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // tell PHP it's JSON
      body: JSON.stringify(formData) // convert object to JSON string
    });
    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
     setTimeout(() => {
    window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
  }, 3000); // 3000 ms = 3 seconds
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
  }
}

let createuser = document.querySelector('.create-user')
createuser.addEventListener("click", function(event){
    console.log("worked")
 event.preventDefault(); // ✅ stop page reload
  handleCreateUser(event);
  createuser.style.display= "none"
   setTimeout(() => {
     createuser.style.display= "block"
  }, 3000); 
})


