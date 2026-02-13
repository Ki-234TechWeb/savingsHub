
let navbtn = document.querySelector(".navBtn");
let nav = document.querySelector(".nav");
let darkTheme = document.querySelector(".darktheme");
let banner = document.querySelector(".banner");
navbtn.addEventListener("click", () => {
  nav.classList.toggle("navToggle");
  darkTheme.classList.toggle("openDT");
});
let navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    nav.classList.remove("navToggle");
    darkTheme.classList.remove("openDT");
  });
});


       
        // Tab Navigation
        function showTab(tabName, event) {
            if (event) event.preventDefault();
            
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            
            const tab = document.getElementById(tabName);
            if (tab) {
                tab.classList.add('active');
                event.target.classList.add('active');
            }
        }

        // Approval Tab Navigation
        function showApprovalTab(tabName, button) {
            document.querySelectorAll('.tab-content').forEach(tab => {
                if (tab.id === `${tabName}-tab`) {
                    tab.style.display = 'block';
                } else if (tab.id && tab.id.endsWith('-tab')) {
                    tab.style.display = 'none';
                }
            });
            
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            button.classList.add('active');
        }

        // Modal Functions
   

      

        function filterAgents() {
            renderAgentsTable();
        }

        // Action Functions
        function reassignAgent(userId, agentName) {
            showNotification(`User reassigned to ${agentName}`, 'success');
        }

        function approveUser(userId) {
            const approval = pendingApprovals.find(a => a.id === userId);
            if (approval) {
                showNotification(`User ${approval.name} has been approved!`, 'success');
                pendingApprovals.splice(pendingApprovals.indexOf(approval), 1);
                renderPendingApprovals();
            }
        }

        function rejectUser(userId) {
            const approval = pendingApprovals.find(a => a.id === userId);
            if (approval) {
                showNotification(`User ${approval.name} has been rejected.`, 'warning');
                pendingApprovals.splice(pendingApprovals.indexOf(approval), 1);
                renderPendingApprovals();
            }
        }

        function viewUserDetails(userId) {
            const user = users.find(u => u.id === userId);
            if (user) {
                showNotification(`Viewing details for ${user.name}`, 'info');
            }
        }

        // function viewAgentDetails(agentId) {
        //     const agent = agents.find(a => a.id === agentId);
        //     if (agent) {
        //         showNotification(`Viewing details for ${agent.name}`, 'info');
        //     }
        // }

        function refreshDashboard() {
            showNotification('Dashboard refreshed successfully', 'success');
        }

        function handleAddUser(event) {
            event.preventDefault();
            showNotification('New user added successfully', 'success');
            closeModal('addUserModal');
            event.target.reset();
        }

        function handleAddAgent(event) {
            event.preventDefault();
            showNotification('New agent registered successfully', 'success');
            closeModal('addAgentModal');
            event.target.reset();
        }

        // Notification System
       function showNotification(message, type = "info") {
  const container = document.getElementById("notificationsContainer");
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
                ${message}
  
            `;
  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}



async function updateStatus(button) {
    let userId = button.getAttribute("data-userid"); console.log("Selected User ID:", userId);
    let planId = button.getAttribute("data-planid");
 const Agentmodal = document.querySelector('.statusmodal-overlay');
const AgentcloseBtn = document.getElementById('closeModalStatus');
    let userPlanId = document.querySelector(".userPlanId");
    let useridStatus = document.querySelector(".useridStatus");
    userPlanId.value=planId;
    useridStatus.value = userId;
    console.log(button)
    console.log(userPlanId,useridStatus)
    Agentmodal.classList.add('active')

AgentcloseBtn.addEventListener('click', (e) => {
  e.preventDefault(); // prevent form submit
  Agentmodal.classList.remove('active');
});
}

   async function assignAgent(button) {
    let userId = button.getAttribute("data-userid"); console.log("Selected User ID:", userId);
 const Agentmodal = document.querySelector('.Agentmodal-overlay');
const AgentcloseBtn = document.getElementById('closeModalAgent');

    console.log('hi')
    Agentmodal.classList.add('active');
  
 try {
    const res = await fetch(`/savinghub/backend/api/admin/get.php?type=getAgent&id=${userId}`,
        {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    const dataUser= await res.json();
    let data = dataUser.userAgent || [];
    let userAgent = data[0]; 
     let singleAgent = document.querySelector(".userAgent");
     console.log(singleAgent)
     document.querySelector(".userNameAssigned").textContent = userAgent.name || "";
     document.querySelector(".useridAssigned").value = userAgent.user_id || "";
     singleAgent.textContent = userAgent.agent || "";
       console.log(userAgent.agent )
  } catch (err) {
    console.error("Error fetching userAgent:", err);
  }

AgentcloseBtn.addEventListener('click', (e) => {
  e.preventDefault(); // prevent form submit
  Agentmodal.classList.remove('active');
});
   }

document.addEventListener("click", function(e) {
    
  if (e.target.classList.contains("closeEditColl")) {
    
  const update_record = document.getElementById("recordCollectionModalEdit");
  if (!update_record) return;
  update_record.style.display = "none"; 


  }
});

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("recordCollect")) {
  const update_record = document.getElementById("recordCollectionModalEdit");
  if (!update_record) return;
  update_record.style.display = "none"; 


  }
});


// register agent triger
function registerAgent() {
     const modalAgent = document.getElementById("addAgentModal");
 if (!modalAgent) return;
 modalAgent.style.display = "flex"; 

  document.addEventListener("click", function(e) {
  if (e.target.classList.contains("closeModal")) {
  let updateModal = document.getElementById("addAgentModal");
  if (!updateModal) return;
  updateModal.style.display = "none"; 


  }
});

}
// document.addEventListener("click", function(e) {
//   if (e.target.classList.contains("registerAgent")) {
//     console.log("hello")
//   const modalAgent = document.getElementById("addAgentModal");
//   if (!modalAgent) return;
//   modalAgent.style.display = "flex"; 


//   }
// });







        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('active');
            }
        });
    