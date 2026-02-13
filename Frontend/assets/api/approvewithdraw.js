const approveForm = document.getElementById('approveStatus');
const approveWithdrawbtnspin = document.getElementById("spinnerUpdate");
const approveBtn = document.querySelector(".proceedUpdate");

const approvePage = document.querySelector('.pageloader');
approveForm.addEventListener("submit", approveWithdrawal);

async function approveWithdrawal(event) {
  event.preventDefault();

  const userId = document.querySelector(".useridStatus").value;
  const userPlanId = document.querySelector(".userPlanId").value;
 approveBtn.style.display = "none";
  if (!userPlanId) {
    showNotification("Invalid plan", "error");
         approveBtn.style.display = "inline-block";
    return;
  }

  const approveformData = {
    userId,
    userPlanId
  };
 approvePage.style.display = "flex";
  try {
    const BASE_URL = window.location.origin;

    const res = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/approvewithdraw.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(approveformData),
      }
    );

    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
approvePage.style.display = "flex";
      setTimeout(() => {
        window.location.href =
          `${BASE_URL}/savinghub/Frontend/dashboards/admin.html`;
      }, 1000);

    } else {
      showNotification(data.message, "error");
        approveBtn.style.display = "inline-block";
      approveWithdrawbtnspin.style.display = "none";
    }

  } catch (error) {
    showNotification("Server error: " + error.message, "error");
      approveBtn.style.display = "inline-block";
      approveWithdrawbtnspin.style.display = "none";
  }
}
