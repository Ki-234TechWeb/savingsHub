
const formUpdate = document.getElementById("formUpdate");
<<<<<<< HEAD
const spinnerUpdateUser = document.getElementById("spinnerUpdate");
const proceedBtn = document.querySelector(".proceedUpdate");

const Upuserpage = document.querySelector('.pageloader');
=======
const proceedBtn = document.querySelector(".proceedUpdate");
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
formUpdate.addEventListener("submit", handleUpdateUser);

async function handleUpdateUser(event) {
  event.preventDefault(); // stop form reload
<<<<<<< HEAD
=======
  proceedBtn.style.display = "none";
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
  let name = document.querySelector(".nameUpdate").value.trim();
  let email = document.querySelector(".emailUpdate").value.trim();
  let phone = document.querySelector(".phoneUpdate").value.trim();
  let address = document.querySelector(".addressUpdate").value.trim();
  let nextofKin = document.querySelector(".nextofKinUpdate").value.trim();
  let agent_id = document.querySelector(".staffAgent").value.trim();
  let user_id = document.querySelector(".Usersid").value.trim();
<<<<<<< HEAD
 proceedBtn.style.display = "none";
  // Validation
  if (!name || !phone || !address) {
    showNotification("Required fields cannot be empty", "error");
 proceedBtn.style.display = "inline-block";
=======

  // Validation
  if (!name || !phone || !address) {
    showNotification("Required fields cannot be empty", "error");
    proceedBtn.style.display = "inline-block";
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
    return;

  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNotification("Invalid email format", "error");
    proceedBtn.style.display = "inline-block";
    return;
  }

<<<<<<< HEAD

  const formData = { name, email, phone, address, nextofKin, agent_id, user_id };
    Upuserpage.style.display = "flex";
=======
  const formData = { name, email, phone, address, nextofKin, agent_id, user_id };

>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
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
<<<<<<< HEAD
        Upuserpage.style.display = "flex";
      setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 1500);
    } else {
      showNotification(data.message, "error");
      proceedBtn.style.display = "inline-block";
      spinnerUpdateUser.style.display = "none";
=======
      setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
      }, 3000);
    } else {
      showNotification(data.message, "error");
      proceedBtn.style.display = "inline-block";
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    proceedBtn.style.display = "inline-block";
<<<<<<< HEAD
    spinnerUpdateUser.style.display = "none";
  }
}

proceedBtn.addEventListener("click", function(event){
  handleUpdateUser(event) ;
 
})


=======
  }
}
 document.addEventListener("click", function(e) {
  if (e.target.classList.contains("proceedUpdate")) {

    const result = handleUpdateUser(e);
    if (!result) return; // only check if your function returns something meaningful
  }
});
>>>>>>> 81256442b605ca8e83665b70593c43a9a69ea9d7







