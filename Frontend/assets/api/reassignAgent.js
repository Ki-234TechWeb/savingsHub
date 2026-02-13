let formReassign = document.getElementById('selectionFormAgent')
const reasignSpin = document.getElementById("reasignUpdate");
const reAssigned = document.querySelector(".reAssigned");

const reAssignedPage = document.querySelector('.pageloader');
formReassign.addEventListener("submit", reassignUserAgent);

async function reassignUserAgent(event) {
 event.preventDefault();
      let select = document.querySelector(".Agentselect");
     let agent = select.value.trim();
      let agent_id = select.options[select.selectedIndex].dataset.agent_id;
     let assignedId =  document.querySelector(".useridAssigned");
      let userId = assignedId.value;
      reAssigned.style.display = "none"; 
       if (!userId ) {
    showNotification("Invalid or missing IDs", "error");
 reAssigned.style.display = "inline-block";
    return;

  }
        reAssignedPage.style.display = "flex";
  const formData = {
    userId,
    agent: agent,
    agent_id: agent_id,
  };

    
  try {
    const BASE_URL = window.location.origin;
    const res = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/reassignAgent.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // tell PHP it's JSON
        body: JSON.stringify(formData), // convert object to JSON string
      }
    );
    const data = await res.json();

    if (data.status === "success") {
      showNotification(data.message, "success");
        reAssignedPage.style.display = "flex";
        setTimeout(() => {
        window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/admin.html`;
      }, 1000); 
    
    } else {
      showNotification(data.message, "error");
       reAssigned.style.display = "inline-block";
      reasignSpin.style.display = "none";
    }
  } catch (error) {
    showNotification("Server error: " + error.message, "error");
     reAssigned.style.display = "inline-block";
      reasignSpin.style.display = "none";
  }





}








