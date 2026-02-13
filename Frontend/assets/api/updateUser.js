
const formUpdate = document.getElementById("formUpdate");
const spinnerUpdateUser = document.getElementById("spinnerUpdate");
const proceedBtn = document.querySelector(".proceedUpdate");

const Upuserpage = document.querySelector('.pageloader');
formUpdate.addEventListener("submit", handleUpdateUser);

async function handleUpdateUser(event) {
  event.preventDefault(); // stop form reload
  let name = document.querySelector(".nameUpdate").value.trim();
  let email = document.querySelector(".emailUpdate").value.trim();
  let phone = document.querySelector(".phoneUpdate").value.trim();
  let address = document.querySelector(".addressUpdate").value.trim();
  let nextofKin = document.querySelector(".nextofKinUpdate").value.trim();
  let agent_id = document.querySelector(".staffAgent").value.trim();
  let user_id = document.querySelector(".Usersid").value.trim();
 proceedBtn.style.display = "none";
  // Validation
  if (!name || !phone || !address) {
    showNotification("Required fields cannot be empty", "error");
 proceedBtn.style.display = "inline-block";
    return;

  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNotification("Invalid email format", "error");
    proceedBtn.style.display = "inline-block";
    return;
  }


  const formData = { name, email, phone, address, nextofKin, agent_id, user_id };
    Upuserpage.style.display = "flex";
  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(`${BASE_URL}/savinghub/backend/api/staff/updateUser.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
        Upuserpage.style.display = "flex";
      setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 1500);
    } else {
      showNotification(data.message, "error");
      proceedBtn.style.display = "inline-block";
      spinnerUpdateUser.style.display = "none";
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    proceedBtn.style.display = "inline-block";
    spinnerUpdateUser.style.display = "none";
  }
}

proceedBtn.addEventListener("click", function(event){
  handleUpdateUser(event) ;
 
})









