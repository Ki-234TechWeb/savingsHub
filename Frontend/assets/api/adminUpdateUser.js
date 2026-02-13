
const adminformUpdate = document.getElementById("formUpdate");
const spinnerAdminUpdateUser = document.getElementById("spinnerUpdate");
const AdminuserUpdate = document.querySelector(".proceedUpdate");

const adminUpuserpage = document.querySelector('.pageloader');
adminformUpdate.addEventListener("submit", handleUpdateUser);

async function handleUpdateUser(event) {
  event.preventDefault(); // stop form reload
  let name = document.querySelector(".nameUpdate").value.trim();
  let email = document.querySelector(".emailUpdate").value.trim();
  let phone = document.querySelector(".phoneUpdate").value.trim();
  let address = document.querySelector(".addressUpdate").value.trim();
  let nextofKin = document.querySelector(".nextofKinUpdate").value.trim();
  let agent_id = document.querySelector(".staffAgent").value.trim();
  let user_id = document.querySelector(".Usersid").value.trim();
 AdminuserUpdate.style.display = "none";
  // Validation
  if (!name || !phone || !address) {
    showNotification("Required fields cannot be empty", "error");
 AdminuserUpdate.style.display = "inline-block";
    return;

  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNotification("Invalid email format", "error");
    AdminuserUpdate.style.display = "inline-block";
    return;
  }


  const formData = { name, email, phone, address, nextofKin, agent_id, user_id };
    adminUpuserpage.style.display = "flex";
  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(`${BASE_URL}/savinghub/backend/api/admin/adminUpdateUser.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
        adminUpuserpage.style.display = "flex";
      setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/admin.html`;
      }, 1500);
    } else {
      showNotification(data.message, "error");
      AdminuserUpdate.style.display = "inline-block";
      spinnerAdminUpdateUser.style.display = "none";
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    AdminuserUpdate.style.display = "inline-block";
    spinnerAdminUpdateUser.style.display = "none";
  }
}

AdminuserUpdate.addEventListener("click", function(event){
  handleUpdateUser(event) ;
 
})









