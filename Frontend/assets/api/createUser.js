const form = document.getElementById("form");
const createuser = document.querySelector(".create-user");
const spinnerCreate = document.getElementById('loadingSpinnerCreate');
<<<<<<< HEAD
const createpage = document.querySelector('.pageloader');
=======
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
form.addEventListener("submit", handleCreateUser);

async function handleCreateUser(event) {
  event.preventDefault();
  spinnerCreate.style.display = "block";
  createuser.style.display = "none";
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
    nextofKin: nextofKin,
    password: password,
    agent: agent,
    agent_id: agent_id,
  };

    createpage.style.display = "flex";
  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(
      `${BASE_URL}/savinghub/backend/api/staff/createUser.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // tell PHP it's JSON
        body: JSON.stringify(formData), // convert object to JSON string
      }
    );
    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
<<<<<<< HEAD
      createpage.style.display = "flex";
      setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 800); 
=======
      setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 1500); // 3000 ms = 3 seconds
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
    } else {
      showNotification(data.message, "error");
      restoreCreateButton()
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    restoreCreateButton()
  }
}


createuser.addEventListener("click", function (event) {
  event.preventDefault(); 
  handleCreateUser(event);
  
});

function restoreCreateButton() {
 spinnerCreate.style.display = "none";
  createuser.style.display = "block";
<<<<<<< HEAD
  createpage.style.display = "none";
=======

>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
}



