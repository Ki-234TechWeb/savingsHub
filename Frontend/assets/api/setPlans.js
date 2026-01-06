const planForm = document.getElementById('plans');
 const setplans = document.querySelector('.setplan')
planForm.addEventListener("submit", handleSetupPlan );
const spinnerSetplan = document.getElementById('loadingSpinnerSetplan');
async function handleSetupPlan(event) {
  event.preventDefault();
  spinnerSetplan.style.display = "block";
setplans.style.display = "none";
let select = document.querySelector(".users");
  let user = select.value.trim();
  let agentId = select.options[select.selectedIndex].dataset.agentId;
  let userId = select.options[select.selectedIndex].dataset.userId;
    let planType = document.querySelector(".planType").value.trim();
  let targetAmount = document.querySelector(".targetAmount").value.trim();
  let duration = document.querySelector(".duration").value.trim();
  let contribution = document.querySelector(".contribution").value.trim();
  let Commision = document.querySelector(".Commision").value.trim();
  // Validation
  if (!user || !targetAmount || !duration || !contribution ) {
    showNotification("Required fields cannot be empty", "error");
    restoreSetplanButton()
    return; // stop submission
  }

 const formData = {
  user: user,
  userId: userId,
  agentId: agentId,
   planType: planType,
  targetAmount: targetAmount,
  duration: duration,
  contribution: contribution,
  Commision: Commision
};

  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(`${BASE_URL}/savinghub/backend/api/staff/setPlans.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // tell PHP it's JSON
      body: JSON.stringify(formData) // convert object to JSON string
    });
    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
     setTimeout(() => {
    window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
  }, 2000); 
    } else {
      showNotification(data.message, "error");
      restoreSetplanButton()
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
    restoreSetplanButton()
  }
}


setplans.addEventListener("click", function(event){
  handleSetupPlan(event);
 
})


function restoreSetplanButton() {
 spinnerSetplan.style.display = "none";
  setplans.style.display = "block";

}



