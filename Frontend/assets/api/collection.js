
const recordCollectBtn = document.querySelector('.recordCollection');
const spinner = document.getElementById('loadingSpinner');
<<<<<<< HEAD
const collectspin = document.querySelector('.pageloader');
=======

>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("recordCollection")) {
    handleRecordCollection(e);
  }
});

async function handleRecordCollection(event) {
  event.preventDefault();

  // Hide button, show spinner
  recordCollectBtn.style.display = "none";
  spinner.style.display = "block";

  let select = document.querySelector(".usersplan");
  let user = select.value.trim();
  let user_id = document.querySelector(".user_id").value.trim();
  let agent_id = document.querySelector(".agent_id").value.trim();
  let date = document.querySelector(".date").value.trim();
  let amount = document.querySelector(".amount").value.trim();
  let userplansid = select.options[select.selectedIndex].dataset.user_plan_id;
  let plan_type = document.querySelector(".plan_type").value.trim();
<<<<<<< HEAD
=======

  // Validation
  if (!user || !date || !amount || !user_id) {
    showNotification("Required fields cannot be empty", "error");
    recordCollectBtn.style.display = "block";
  spinner.style.display = "none";
    return;
  }

  const formData = { user, user_id, agent_id, date, amount, userplansid, plan_type };
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7

  // Validation
  if (!user || !date || !amount || !user_id) {
    showNotification("Required fields cannot be empty", "error");
    recordCollectBtn.style.display = "block";
  spinner.style.display = "none";
    return;
  }

  const formData = { user, user_id, agent_id, date, amount, userplansid, plan_type };
collectspin.style.display = "flex";
  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(`${BASE_URL}/savinghub/backend/api/staff/collection.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
      setTimeout(() => {
<<<<<<< HEAD
          collectspin.style.display = "flex";
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 800);
=======
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 2000);
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
    } else {
      showNotification(data.message, "error");
      restoreButton();
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    restoreButton();
  }
}

function restoreButton() {
  recordCollectBtn.style.display = "block";
  spinner.style.display = "none";
<<<<<<< HEAD
  collectspinstyle.display = "none";
=======
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
}




