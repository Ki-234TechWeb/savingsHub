
const spinnerUpdatePass = document.getElementById('loadingSpinnerPass');
const changePassBtn = document.querySelector(".changePassword")
const changePass = document.getElementById("changePass");

changePass.addEventListener("submit", changePassword);

async function changePassword(event) {
  event.preventDefault();
  changePassBtn.style.display = "none";
    spinnerUpdatePass.style.display = "block";
  // Get values from form fields
  let currentPassword = document.querySelector(".staffPass").value.trim();
  let newPassword = document.querySelector(".staffNewPass").value.trim();
  let confirmPassword = document.querySelector(".staffConfirmPass").value.trim();
 let StaffId = document.querySelector(".staffId").textContent.trim();
  // ✅ Basic validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    showNotification("Password fields cannot be empty", "error");
    restorePassButton()
    return;
  }

  if (newPassword !== confirmPassword) {
   showNotification("New password and confirmation do not match!", "error");
   restorePassButton()
    return;
  }

  if (newPassword.length < 6) {
  showNotification("Password must be at least 6 characters long.","error");
  restorePassButton()
    return;
  }

   
  const formData2 = {
 currentPassword : currentPassword,
 newPassword : newPassword,
 StaffId: StaffId
  };

  // ✅ Send request to backend
  try {
    const BASE_URL = window.location.origin;

    const res = await fetch(
      `${BASE_URL}/savinghub/backend/api/staff/updatePassword.php`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData2)
      }
    );

    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");

      setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 3000);
    } else {
      showNotification(data.message, "error");
      restorePassButton()
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    restorePassButton()
  }
}

function restorePassButton() {
 spinnerUpdatePass.style.display = "none";
  changePassBtn.style.display = "block";

}


