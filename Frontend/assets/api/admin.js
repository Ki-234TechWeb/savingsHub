let portfolioUsers = [];
let collectionsHistory = [];
let todaysCollections = [];
let weeklyCollections = [];
let monthlyCollection = [];
let collectionsSummary = [];
let agents = [];
let notifications = [];
let getAllPlans = [];
const adminhomepageSpin = document.querySelector('.pageloader');
 const token = localStorage.getItem("token");
  let welcomeName = document.querySelectorAll('.Welcome')
     welcomeName.forEach(item => {
      item.textContent = localStorage.getItem("user_name")
     });
let globalName = localStorage.getItem("user_name")
console.log(globalName)

const BASE_URL = window.location.origin;

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/login.html`;
}
if (localStorage.getItem("user_role") !== "admin") {
  logout();
}
async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    logout();
    throw new Error("No token");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok && response.status === 401) {
    alert("Session expired. Logging out.");
    logout();
    throw new Error("Session expired");
  }

  return response;
}



async function loadData() {
 try {
  const BASE_URL = window.location.origin;
  const response = await authFetch(`${BASE_URL}/savinghub/backend/api/admin/get.php`);
  const data = await response.json();
  console.log(data);
} catch (err) {
  console.log(err.message); // "Session expired"
}
}
loadData()






async function cardData() {
    try {
const BASE_URL = window.location.origin;
 if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/get.php?type=cardD`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
document.getElementById('depositsCard').innerText = data.cardData[0].total_deposits;
document.getElementById('incomeCard').innerText   = data.cardData[0].total_income;


    } catch (error) {
        console.error("Error fetching CardData:", error);
    }
    finally {
    
     setTimeout(() => {
         adminhomepageSpin.style.display = "none";
      }, 2000);
   
  }
}

cardData();
async function graph() {
    try {
        const BASE_URL = window.location.origin;
         if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
        
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/get.php?type=graph`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let graphdata = await response.json();
     const depositsNum = graphdata.graphInfo.map(item => Number(item.total_deposits)); 
     const incomesNum = graphdata.graphInfo.map(item => Number(item.total_income));
    const months = graphdata.graphInfo.map(item => {
  const [year, month] = item.month.split("-");
  const date = new Date(year, month - 1); // month is 0-based
  return date.toLocaleString("default", { month: "short" }); 
});

 const ctx = document.getElementById('transactionsLineChart').getContext('2d');

  // Gradients
  const depositGradient = ctx.createLinearGradient(0, 0, 0, 300);
  depositGradient.addColorStop(0, 'rgba(46, 204, 113, 0.4)');
  depositGradient.addColorStop(1, 'rgba(46, 204, 113, 0)');

  const withdrawGradient = ctx.createLinearGradient(0, 0, 0, 300);
  withdrawGradient.addColorStop(0, 'rgba(231, 76, 60, 0.4)');
  withdrawGradient.addColorStop(1, 'rgba(231, 76, 60, 0)');

  const incomeGradient = ctx.createLinearGradient(0, 0, 0, 300);
  incomeGradient.addColorStop(0, 'rgba(241, 196, 15, 0.4)');
  incomeGradient.addColorStop(1, 'rgba(241, 196, 15, 0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Deposits',
          data: depositsNum,
          borderColor: '#2ecc71',
          backgroundColor: depositGradient,
          borderWidth: 3,
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        // {
        //   label: 'Withdrawals',
        //   data: [800, 1000, 1200, 1100, 1300, 1400],
        //   borderColor: '#e74c3c',
        //   backgroundColor: withdrawGradient,
        //   borderWidth: 3,
        //   fill: true,
        //   tension: 0.45,
        //   pointRadius: 4,
        //   pointHoverRadius: 6
        // },
        {
          label: 'Income',
          data: incomesNum,
          borderColor: '#f1c40f',
          backgroundColor: incomeGradient,
          borderWidth: 3,
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 13
            }
          }
        },
        title: {
          display: true,
          text: 'Financial Activity Overview',
          padding: { bottom: 20 },
          font: {
            size: 18,
            weight: '600'
          }
        },
        tooltip: {
          backgroundColor: '#111',
          padding: 12,
          titleFont: { size: 14 },
          bodyFont: { size: 13 },
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 12 }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          },
          ticks: {
            callback: value => `₦${value.toLocaleString()}`,
            font: { size: 12 }
          }

           
          }
      },
      animations: {
  tension: {
    duration: 2500,
    easing: 'easeInOutSine',
    from: 0.45,
    to: 0.65,
    loop: true
  }
}


      
    }
  });


        
    } catch (error) {
         console.error("Error fetching graph:", error);
    }



}

graph();

async function fetchUsersCount() {
  try {
    const BASE_URL = window.location.origin;
     if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/get.php?type=usersCounts`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    
   usersCounts = data.usersCounts || [];
   let totalUsers = usersCounts[0].total_users; 
   let activeUsers = usersCounts[0].active_users; 
   let usersThisMonth = usersCounts[0].users_this_month;
  document.querySelector(".totalUserLength").textContent = totalUsers;
   document.querySelector(".activeUserLength").textContent = activeUsers;
    document.querySelector(".newUserLength").textContent = usersThisMonth;


    
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  
}
fetchUsersCount();
  async function fetchUsers() {
  try {
    const BASE_URL = window.location.origin;
     if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/get.php?type=user`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    
    portfolioUsers = data.users || [];
    let users = portfolioUsers;
    

    renderPortfolioUsers(portfolioUsers);
    
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
fetchUsers();

async function fetchGetPlan() {
 let select = document.getElementById("agentFilterPlan");
  let selectedOption = select.options[select.selectedIndex];

  let agentId = selectedOption?.dataset.agent_id || "";

  
  try {

    const BASE_URL = window.location.origin;
     if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/get.php?type=getPlans&agent_id=${agentId}`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    getAllPlans = data.getPlans || [];
renderActivePlans(getAllPlans)

  } catch (error) {
     console.error("Error fetching allplans", error);
  }
}
fetchGetPlan(); 

async function fetchStaff() {
  try {
    const BASE_URL = window.location.origin;
     if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/get.php?type=staff`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
   let data = await response.json();
let staff = data.staff || [];
let selects = document.querySelectorAll(".agent");

let staffCount = document.querySelectorAll('.total-agent')
staffCount.forEach(item => {
  item.innerHTML = staff.length
  
});
staff.forEach((staffMember) => {
  selects.forEach((select) => {
    let option = document.createElement("option");
    option.value = staffMember.name;
    option.dataset.agent_id = staffMember.agent_id;
    
    console.log(staffMember.agent_id);
    
    option.textContent = staffMember.name;
    select.appendChild(option);
  });
});

      

   
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
fetchStaff();


async function fetchAgents() {
  try {
    const BASE_URL = window.location.origin;
     if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/get.php?type=agent`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
   let data = await response.json();
let agent = data.agent || [];
      
renderAgentsTable(agent) 
   
  } catch (error) {
    console.error("Error fetching agents infos:", error);
  }
}
fetchAgents();


  function renderAgentsTable(agents = []) {
  const tbody = document.getElementById('agentsTableBody');
  tbody.innerHTML = agents.map(agent => {
    const created = String(agent.created_at || "").replace(" ", "T");
    const dateObj = created ? new Date(created) : new Date();

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short", // use "long" for full month name
      year: "numeric"
    });

    return `
      <tr>
        <td><strong>${agent.name}</strong></td>
        <td>${agent.phone}</td>
        <td>${agent.address}</td>
        <td>${agent.email}</td>
        <td>${agent.total_users}</td>
        <td>${formattedDate}</td>
        <td>
           <button class="button btn-primary record" onclick="openModal('recordCollectionModal', '${agent.agent_id}', this)">
            + Record Collection
          </button>
          </td>
        <td>
          <button class="button btn-sm btn-outline updateAgent"  data-agent-id="${agent.agent_id}">Edit Agent</button>
        </td>
      </tr>
    `;
  }).join('');
}

// modal function
  async function openModal(modalId, agentId, buttonEl) {
  // Open  modal
  document.getElementById(modalId).classList.add('active');
 let agentid = agentId 
 console.log(agentid)
try {
    const res = await fetch(`/savinghub/backend/api/admin/get.php?type=userPlans&id=${agentid}`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    let data = await res.json();
    userplans = data.userPlans || [];
    let users = userplans;

    let select = document.querySelector(".usersplan");
    select.innerHTML = '<option value="">-- Select User Plan --</option>';
    users.forEach((users) => {
      let option = document.createElement("option");
      option.value = users.user_name;
      option.textContent = `${users.user_name} (${users.plan_type}, ₦${users.contribution_per_cycle}/cycle,)`;
      // Store extra info in data attributes
      option.dataset.planType = users.plan_type;
      option.dataset.agent_id = users.agent_id;
      option.dataset.user_id = users.user_id;
      option.dataset.user_plan_id = users.user_plan_id;
      select.appendChild(option);
    });

    select.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];

      document.querySelector(".plan_type").value =
        selectedOption.dataset.planType;
      document.querySelector(".user_id").value = selectedOption.dataset.user_id;
      document.querySelector(".agent_id").value =
        selectedOption.dataset.agent_id;
      
    });
  } catch (err) {
    console.error("Error fetching user:", err);
  }

}

document.querySelector('.usersplan').addEventListener('change', function () {
  const selectedOption = this.options[this.selectedIndex];
  if (!selectedOption) return;

  document.querySelector('.plan_type').value =
    selectedOption.dataset.planType || '';

  document.querySelector('.user_id').value =
    selectedOption.dataset.user_id || '';

  document.querySelector('.agent_id').value =
    selectedOption.dataset.agent_id || '';
});


        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

function renderPortfolioUsers(portfolioUsers = []) {
  const tbody = document.getElementById("usersTableBody");
  const statusFilter = document.getElementById('userStatusFilter')?.value || '';
  const agentFilter = document.getElementById('agentFilter')?.value || '';

  const norm = (s) => String(s || "").trim().toLowerCase();

  let filteredUsers = portfolioUsers;

  // Status filter
  if (statusFilter) {
    const filterValue = norm(statusFilter);
    filteredUsers = filteredUsers.filter(u => norm(u.status) === filterValue);
  }

  // Agent filter
  if (agentFilter) {
    if (norm(agentFilter) === 'unassigned') {
      filteredUsers = filteredUsers.filter(u => norm(u.agent) === 'unassigned' || !u.agent);
    } else {
      filteredUsers = filteredUsers.filter(u => norm(u.agent) === norm(agentFilter));
    }
  }

  tbody.innerHTML = filteredUsers.map((user) => {
    const created = String(user.created_at || "").replace(" ", "T");
    const date = created ? new Date(created) : new Date();
    let agentName = user.agent && user.agent.trim() !== "" ? user.agent : "Unassigned";

    return `
      <tr>
        <td><strong>${user.name || ""}</strong></td>
        <td>${user.address || ""}</td>
        <td>${user.phone || ""}</td>
        <td>
          <button class="openModalAgent" onclick="assignAgent(this)" data-userid="${user.user_id}" style="padding:0.5rem; border:1px solid var(--border); border-radius:var(--radius);">${agentName}</button>
        </td>
        <td>
          <span class="badge badge-${norm(user.status)}">
            ${String(user.status || "").charAt(0).toUpperCase() + String(user.status || "").slice(1)}
          </span>
        </td>
        <td>${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
        <td>
         <button class="button btn-outline btn-sm" onclick="setSelectFromButton('setupPlanModal',this)"
              data-user="${user.name || ""}" data-user-id="${user.user_id}" data-agentId="${user.agent_id}">
              Setup Plan 
            </button>
        </td>
        <td>
          <button class="button btn-sm btn-outline updateUser" data-user-id="${user.user_id}">Edit User</button>
        </td>
      </tr>
    `;
  }).join("");
}

function setSelectFromButton(modal, button) {
    document.getElementById(modal).classList.add('active');
  let select = document.querySelector(".users");

  // Clear existing options
  select.innerHTML = "";

  // Create new option based on button dataset
  let option = document.createElement("option");
  option.value = button.dataset.user;
  option.textContent = button.dataset.user;
  option.dataset.userId = button.dataset.userId;
  option.dataset.agentId = button.dataset.agentid;

  // Add option to select
  select.appendChild(option);

  // Automatically select it
  select.selectedIndex = 0;

}

 function renderActivePlans(getAllPlans = []) {
  const tbody = document.getElementById("activePlansBody");
  
  let plans = getAllPlans;
let acctCard = document.querySelectorAll('.accountsCard');        
acctCard.forEach(item => {
  item.innerText = plans.length;
});


  tbody.innerHTML = plans
    .map((plan) => {
      // Calculate progress percentage safely
      const progress =
        plan.target_amount > 0
          ? ((plan.collected / plan.target_amount) * 100).toFixed(2)
          : 0;
      ``;
      let planStyle = "";
      if (["Daily", "weekly", "monthly"].includes(plan.plan_type)) {
        planStyle =
          "background-color: lightblue; color: #000;padding: 4px 10px;  border-radius: 4px;";
      } else if (plan.plan_type === "loan") {
        planStyle =
          "background-color: red; color: #fff; padding: 4px 10px; border-radius: 4px;";
      }

     const statusStyles = {
  "in progress": "background:#fff8cc;color:#7a6200;",
  "completed": "background:#e6f9f0;color:#047857;",
  "payment approved": "background:#e6f9f0;color:#047857;",
};

const statusClass = `
  ${statusStyles[plan.status] || "background:#f1f5f9;color:#475569;"}
  padding:4px 12px;
  border-radius:999px;
  font-weight:500;
  text-align:center;
`;

      return `
        <tr>
          <td><strong>${plan.user_name}</strong></td>
          <td><span  style="${planStyle}">${plan.plan_type || "N/A"}</span></td>
          <td>₦${plan.target_amount}</td>
          <td>₦${plan.collected}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div style="font-size: 0.75rem; margin-top: 0.25rem; color: var(--muted-foreground);"  >
              ${progress}%
            </div>
          </td>
          <td><span class="status" style="${statusClass}" >${plan.status}</span></td>
          <td>${plan.start_date}</td>
           <td>${plan.duration_months} month(s)</td>
            <td>₦${plan.Commision} month(s)</td>
          <td>${plan.commission_cycles} month(s)</td>
          <td>₦${plan.real_time_commission} </td>
          <td> <button class="button btn-sm Agentbtn-primary  closePlan" style="" onclick="updateStatus(this)" data-userid ="${plan.user_id}" data-planid ="${plan.user_plan_id}"> Approve payment
           </button> </td>
          
        </tr>
      `;
    })
    .join("");
}



function filterUsers() {
fetchGetPlan();
  renderPortfolioUsers(portfolioUsers);
}

// Sending Data
function updateUser() { 
document.addEventListener("click", async function(e) {
  if (e.target.classList.contains("updateUser")) {
  const updateModal = document.getElementById("updateUser");
  if (!updateModal) return;
  let btn = e.target.closest(".updateUser");
 let user_ids = btn.getAttribute("data-user-id");
  
  updateModal.style.display = "flex"; 

 try {
   if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const res = await fetch(`/savinghub/backend/api/staff/get.php?type=singleUser&id=${user_ids}`,
       {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    const dataUser= await res.json();
    let data = dataUser.userUpdate || [];
    let user = data[0]; 
      document.querySelector(".nameUpdate").value = user.name || "";
    document.querySelector(".emailUpdate").value = user.email || ""; // only works if backend sends "email"
      updateModal.querySelector(".phoneUpdate").value = user.phone || "";
      updateModal.querySelector(".addressUpdate").value = user.address || "";
      updateModal.querySelector(".nextofKinUpdate").value = user.nextofkin || "";
        user.next_of_kin || "";
       document.querySelector(".staffAgent").value = user.agent_id || "";
       document.querySelector(".Usersid").value = user.user_id || "";
  } catch (err) {
    console.error("Error fetching user:", err);
  }
  }
});




document.addEventListener("click", function(e) {
  if (e.target.classList.contains("closeUpdate")) {
  const updateModal = document.getElementById("updateUser");
  if (!updateModal) return;
  updateModal.style.display = "none"; 


  }
});

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("update_content")) {
  const update_content = document.getElementById("updateUser");
  if (!update_content) return;
  update_content.style.display = "none"; 


  }
});

}

updateUser();

// edit agent modal
function updateAgent() { 
document.addEventListener("click", async function(e) {
  if (e.target.classList.contains("updateAgent")) {
  const agentModal = document.getElementById("EditAgentModal");
  if (!agentModal) return;
  let btn = e.target.closest(".updateAgent");
 let agent_ids = btn.getAttribute("data-agent-id");
  
  agentModal.style.display = "flex"; 

 try {
   if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const res = await fetch(`/savinghub/backend/api/admin/get.php?type=singleAgent&id=${agent_ids}`,
       {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    const dataUser= await res.json();
    let data = dataUser.agentUpdate || [];
    let agent = data[0]; 
      document.querySelector(".EditagentName").value = agent.name || "";
    document.querySelector(".EditagentEmail").value = agent.email || ""; 
       document.querySelector(".EditagentPhone").value = agent.phone || "";
       document.querySelector(".EditagentAddress").value = agent.address || "";
       document.querySelector(".agentsid").value = agent.agent_id || "";
       console.log(agent.agent_id)
  } catch (err) {
    console.error("Error fetching singleAgent:", err);
  }
  }
});




document.addEventListener("click", function(e) {
  if (e.target.classList.contains("closeModal")) {
  let updateModal = document.getElementById("EditAgentModal");
  if (!updateModal) return;
  updateModal.style.display = "none"; 


  }
});



}

updateAgent();


async function renderCollectionsHistory() {
  const tbody = document.getElementById("collectionsHistoryBody");
  const filterValue = document.getElementById("collectionDateFilter").value;
 let select = document.getElementById("agentCollectPlan");
  let selectedOption = select.options[select.selectedIndex];

  let agentId = selectedOption?.dataset.agent_id || "";


  try {
    const BASE_URL = window.location.origin;

    // Fetch both datasets in parallel
    const [
      collectionsRes,
      todaysRes,
      weekRes,
      monthlyRes,
      summaryRes,
      pendingRes,
    ] = await Promise.all([
      fetch(`${BASE_URL}/savinghub/backend/api/admin/get.php?type=collections&agent_id=${agentId}`,
        {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
      ),
      
      fetch(
        `${BASE_URL}/savinghub/backend/api/admin/get.php?type=todaysCollections&agent_id=${agentId}`,
        {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
      ),
      fetch(
        `${BASE_URL}/savinghub/backend/api/admin/get.php?type=weeklyCollections&agent_id=${agentId}`,
        {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
      ),
      fetch(`${BASE_URL}/savinghub/backend/api/admin/get.php?type=monthly&agent_id=${agentId}`,
        {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
      ),
      fetch(
        `${BASE_URL}/savinghub/backend/api/admin/get.php?type=collectionsSummary&agent_id=${agentId}`,
        {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
      ),
      fetch(
        `${BASE_URL}/savinghub/backend/api/admin/get.php?type=todaysPendingCollections&agent_id=${agentId}`,
        {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
      ),
    ]);

    if (
      !collectionsRes.ok ||
      !todaysRes.ok ||
      !weekRes.ok ||
      !monthlyRes.ok ||
      !summaryRes.ok ||
      !pendingRes.ok
    ) {
      throw new Error("Failed to fetch collections");
    }

    const collectionsData = await collectionsRes.json();
    const summaryData = await summaryRes.json();
    const todaysData = await todaysRes.json();
    const weeklyData = await weekRes.json();
    const monthlyData = await monthlyRes.json();
    const collectionsHistory = collectionsData.collections || [];
    const collectionsSummary = summaryData.collectionsSummary || [];
    const todaysCollections = todaysData.todaysCollections || [];
    const monthlyCollection = monthlyData.monthlyCollection || [];
    const weeklyCollections = (await weeklyData.weeklyCollections) || [];
    const todays_num = collectionsSummary.todays_total;
    let today_total = Number(todays_num);
    const weekly_num = collectionsSummary.weekly_total;
    let weekly_total = Number(weekly_num);
    const monthly_num = collectionsSummary.monthly_total;
    let monthly_total = Number(monthly_num);
    document.querySelector(".today_collection").innerHTML =
      today_total.toLocaleString("en-US");
    document.querySelector(".weekly_collection").innerHTML =
      weekly_total.toLocaleString("en-US");
    document.querySelector(".monthly_collection").innerHTML =
      monthly_total.toLocaleString("en-US");
  

    let filteredCollections = [];

    if (filterValue === "Recent") {
      filteredCollections = todaysCollections;
    } else if (filterValue === "weekly") {
      filteredCollections = weeklyCollections;
    } else if (filterValue === "monthly") {
      filteredCollections = monthlyCollection;
    } else {
      filteredCollections = collectionsHistory; // fallback
    }

    // Render rows
    tbody.innerHTML = filteredCollections
      .map((collection) => {
        const date = new Date(collection.date);
        return `
          <tr>
            <td><strong>${collection.name}</strong></td>
            <td>${collection.amount}</td>
            <td>${date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}</td>
            <td>${collection.plan_type}</td>
            <td>
              <span class="badge badge-${
                collection.status === "active"
                  ? "collected"
                  : "pending-collection"
              }">
                ${
                  collection.status.charAt(0).toUpperCase() +
                  collection.status.slice(1)
                }
              </span>
            </td>
            <td>
              <button class="button btn-sm btn-outline collectionEdit " data-collect-id= "${collection.contribution_id}" data-collect-userid= "${collection.user_id}" data-collect-agentid= "${collection.agent_id}" data-collect-username= "${collection.name}" data-collect-userdate= "${collection.date}" data-collect-useramount= "${collection.amount}">Edit</button>
            </td>
          </tr>
        `;
      })
      .join("");


  } catch (error) {
    console.error("Error rendering collections:", error);
    tbody.innerHTML = `<tr><td colspan="6">Failed to load collections</td></tr>`;
  }
}


function filterUsersCollect() {
  renderCollectionsHistory()
  
}
let collectTriger = document.getElementById("colledId");
collectTriger.addEventListener('click', function () {
renderCollectionsHistory()
})

async function fetchNotifyData() {
  try {
    const BASE_URL = window.location.origin;
     if (!token) {
      window.location.href = "/savinghub/Frontend/dashboards/login.html";
      return;
    }
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/admin/get.php?type=notifications`,
       {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    notifications = data.notifications || [];
 renderTable(notifications);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
const notify3 = document.querySelector(".showNotify")
    notify3.addEventListener('click',function(){
fetchNotifyData();
    })


let currentPage = 1;
const rowsPerPage = 10;
let filteredD = []; 

async function renderTable(notifications ) {
  const body = document.getElementById("notify-body");
  body.innerHTML = "";
 page = currentPage;
 filteredD = notifications
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  notifications.slice(start, end).forEach((n, index) => {
    const cleanedMessage = n.message.replace(/^Agent\s+[^\s]+\s+/, "");
    body.innerHTML += `
      <tr>
        <td>${start + index + 1}</td>
        <td>${n.message}</td>
        <td>${n.created_at}</td>
      </tr>
    `;
  });

  renderPagination(notifications.length, rowsPerPage, page);
}

function renderPagination(totalItems, rowsPerPage, currentPage) {
  const pagination = document.getElementById("notify-pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button class="notify-page-btn ${i === currentPage ? "active" : ""}"
        onclick="changePage(${i})">${i}</button>
    `;
  }
}

function changePage(p) {
  currentPage = p;
  renderTable(filteredD, currentPage);
}

/* Date Filter */
function applyDateFilter(notifications ) {
  const start = document.getElementById("notify-start-date").value;
  const end = document.getElementById("notify-end-date").value;
  filteredD = notifications.filter((item) => {
    return (
      (!start || item.created_at >= start) &&
      (!end || item.created_at <= end)
    );
  });

  currentPage = 1;
  renderTable(filteredD, currentPage);
}

function resetFilter(notifications ) {
  filteredD = notifications;
  document.getElementById("notify-start-date").value = "";
  document.getElementById("notify-end-date").value = "";
  currentPage = 1;
  renderTable(filteredD, currentPage);
}

// Initialize with your notifications array
 // <-- set this to your actual data
renderTable(filteredD, currentPage);







