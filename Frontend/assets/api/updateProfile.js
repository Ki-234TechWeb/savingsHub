const formSetting = document.getElementById("profileSett");
formSetting.addEventListener("submit", handleUpdateSettings);
const spinnerUpdate = document.getElementById('loadingSpinnerProfile');
const profpage = document.querySelector('.pageloader');
const updateProfileBtn = document.querySelector(".update");
async function handleUpdateSettings(event) {
  event.preventDefault();
  updateProfileBtn.style.display = "none"
    spinnerUpdate.style.display = "block"
  let nameToSave = document.querySelector(".staffName").value.trim();
  let name = document.querySelector(".initialName").value.trim();
  let phone = document.querySelector(".staffPhone").value.trim();
  let address = document.querySelector(".staffAddress").value.trim();
  let StaffId = document.querySelector(".staffId").textContent.trim();
console.log(spinnerUpdate)
console.log(updateProfileBtn)
  if (!name || !phone || !address) {
    showNotification("Required fields cannot be empty", "error");
    restoreButton()
    return;
  }

 
  const formData = {
    name,
    nameToSave,
    phone,
    address,
    StaffId
  };
   profpage.style.display = "flex";
  try {
    const BASE_URL = window.location.origin;

    const res = await fetch(
      `${BASE_URL}/savinghub/backend/api/staff/updateProfile.php`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }
    );

    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
        profpage.style.display = "flex";
      setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 1000);
    } else {
      showNotification(data.message, "error");
      restoreButton()
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    restoreButton()
  }
}


function restoreButton() {
  updateProfileBtn.style.display = "block";
  spinnerUpdate.style.display = "none";
  profpage.style.display = "none";
}

