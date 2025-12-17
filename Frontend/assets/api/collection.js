const recordForm = document.getElementById('recordCollect');

recordForm.addEventListener("submit", handleRecordCollection);

async function handleRecordCollection(event) {
  event.preventDefault();
  let select = document.querySelector(".usersplan");
  let user = select.value.trim();
    let user_id = document.querySelector(".user_id").value.trim();
     let agent_id = document.querySelector(".agent_id").value.trim();
  let date = document.querySelector(".date").value.trim();
  let amount = document.querySelector(".amount").value.trim();
    let userplansid = select.options[select.selectedIndex].dataset.user_plan_id;
let plan_type = document.querySelector(".plan_type").value.trim();
  // Validation
  if (!user || !date || !amount || !user_id ) {
    showNotification("Required fields cannot be empty", "error");
    return; // stop submission
  }
  // Build formData object
 const formData = {
  user: user,
   user_id: user_id,
    agent_id: agent_id,
  date: date,
  amount: amount,
  userplansid: userplansid,
  plan_type: plan_type
};

  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(`${BASE_URL}/savinghub/backend/api/staff/collection.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // tell PHP it's JSON
      body: JSON.stringify(formData) // convert object to JSON string
    });
    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
     setTimeout(() => {
    window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
  }, 3000); 
    } else {
      showNotification(data.message, "error");

    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
  }
}

let recordCollectInfo = document.querySelector('.recordCollection')
recordCollectInfo.addEventListener("click", function(event){
    console.log("worked")
 event.preventDefault(); // ✅ stop page reload
  handleRecordCollection(event);
    recordCollectInfo.style.display= "none"
    setTimeout(() => {
      recordCollectInfo.style.display= "block"
  }, 3000); 
})


