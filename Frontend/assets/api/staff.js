let portfolioUsers = [];
let collectionsHistory = [];
let todaysCollections = [];
let weeklyCollections = [];
let monthlyCollection = [];
let collectionsSummary = [];
let notifications = [];
let staff = [];
let singleStaff = [];
let userplans = [];
async function fetchUsers() {
  try {
    const BASE_URL = window.location.origin;
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/staff/get.php?type=user`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    portfolioUsers = data.users || [];
    let users = portfolioUsers;
    let select = document.querySelector(".users");
    users.forEach((users) => {
      let option = document.createElement("option");
      option.value = users.name;
      option.textContent = users.name;
      option.dataset.userId = users.user_id;
      option.dataset.agentId = users.agent_id;
      select.appendChild(option);
    });

    renderPortfolioUsers(portfolioUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
fetchUsers();


// Sending Data
document.addEventListener("click", async function(e) {
  if (e.target.classList.contains("updateUser")) {
  const updateModal = document.getElementById("updateUser");
  if (!updateModal) return;
  let btn = e.target.closest(".updateUser");
 let user_ids = btn.getAttribute("data-user-id");
  console.log(user_ids);
  updateModal.style.display = "flex"; 

 try {
    const res = await fetch(`/savinghub/backend/api/staff/get.php?type=singleUser&id=${user_ids}`);
    const dataUser= await res.json();
    let data = dataUser.userUpdate || [];
    let user = data[0]; // grab the first user object
  console.log(data)
    console.log(user.name);
      
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

// document.addEventListener("click",  function(e) {
//   if (e.target.classList.contains("collectionEdit")) {
//     const editCollection = document.getElementById("recordCollectionModalEdit");
//     if (!editCollection) return;
//     editCollection.style.display = "flex"; 
//     let collect_id = e.target.getAttribute("data-collect-id"); 
//     let collectUser_id = e.target.getAttribute("data-collect-userid");
//     let collectUserName = e.target.getAttribute("data-collect-username");
//     let collectUserDate = e.target.getAttribute("data-collect-userdate");
//     let collectUserAmount = e.target.getAttribute("data-collect-useramount");
//     console.log("Clicked collect_id:", collect_id); 
//     console.log("Clicked collectUser_id:", collectUser_id);
//     let select = editCollection.querySelector(".usersplanEdit");
//     console.log(select);
//     let option = select.querySelector(".optionEdit");
//      let collectOption = option.value ;
//      option.textContent = `${collectUserName}`;
//        console.log(option);
        
//       let selectOption = option.textContent;
//     let amountEdit =  document.querySelector(".amountEdit").value ;
//      let assignAmount = collectUserAmount;
//      let dateEdit = document.querySelector(".dateEdit").value ;
//       let assignDate = collectUserDate;


//       document.addEventListener("click", async function(sub) {
//   if (sub.target.classList.contains("recordCollectionEdit")) {
//        if (!recordCollectionEdit) return;
//         // Validation
//   if (!assignAmount || !assignDate || !collectOption ) {
//     showNotification("Required fields cannot be empty", "error");
   
//     return;
//   }

//      const collectForm ={
//     selectOption,amountEdit,dateEdit,collect_id
//      }

// try {
//       const res = await fetch(`/savinghub/backend/api/staff/updateCollection.php`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(collectForm)
//       });

//       const dataEdit = await res.json();
//       console.log("Update response:", dataEdit);

//       // Optionally populate modal fields with returned data
//       // e.g., editCollection.querySelector("#fieldName").value = dataEdit.someField;

//     } catch (err) {
//       console.error("Error fetching user:", err);
//     }
//   }
// });

    
//   }
// });


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



async function fetchUserPlans() {
  try {
    const BASE_URL = window.location.origin;
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/staff/get.php?type=userPlans`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    userplans = data.userPlans || [];
    let users = userplans;

    let select = document.querySelector(".usersplan");
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
      console.log(
        (document.querySelector(".plan_type").value =
          selectedOption.dataset.planType)
      );
    });
    renderActivePlans(userplans);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
fetchUserPlans();

// Initialize Dashboard
function initializeDashboard() {
  renderPortfolioUsers(portfolioUsers);
  renderActivePlans(userplans);
  initializeCharts();
}

// render porfolio table
function renderPortfolioUsers(portfolioUsers = []) {
  const tbody = document.getElementById("portfolioUsersBody");
  const statusFilterEl = document.getElementById("userStatusFilter");
  const statusFilter = statusFilterEl ? statusFilterEl.value : "";
  const totalUsers = portfolioUsers.length;
  document.querySelector(".total_user").innerHTML = totalUsers;

  // Normalize to avoid casing/whitespace mismatches
  const norm = (s) =>
    String(s || "")
      .trim()
      .toLowerCase();
  const filterValue = norm(statusFilter);

  let filteredUsers = portfolioUsers;
  if (filterValue) {
    filteredUsers = portfolioUsers.filter(
      (u) => norm(u.status) === filterValue
    );
  }

  tbody.innerHTML = filteredUsers
    .map((user) => {
      const created = String(user.created_at || "").replace(" ", "T");
      const date = created ? new Date(created) : new Date();

      return `
      <tr>
        <td><strong>${user.name || ""}</strong></td>
        <td>${user.phone || ""}</td>
        <td>${user.address || ""}</td>
        <td>${date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        })}</td>
        <td>
          <span class="badge badge-${norm(user.status)}">
            ${
              String(user.status || "")
                .charAt(0)
                .toUpperCase() + String(user.status || "").slice(1)
            }
          </span>
        </td>
        <td>
          <button class="button btn-sm btn-outline updateUser" data-user-id="${user.user_id}"> View user
           </button>

        </td>
      </tr>
    `;
    })
    .join("");
}

// Render Collections History Table
async function renderCollectionsHistory() {
  const tbody = document.getElementById("collectionsHistoryBody");
  const filterValue = document.getElementById("collectionDateFilter").value;

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
      fetch(`${BASE_URL}/savinghub/backend/api/staff/get.php?type=collections`),
      fetch(
        `${BASE_URL}/savinghub/backend/api/staff/get.php?type=todaysCollections`
      ),
      fetch(
        `${BASE_URL}/savinghub/backend/api/staff/get.php?type=weeklyCollections`
      ),
      fetch(`${BASE_URL}/savinghub/backend/api/staff/get.php?type=monthly`),
      fetch(
        `${BASE_URL}/savinghub/backend/api/staff/get.php?type=collectionsSummary`
      ),
      fetch(
        `${BASE_URL}/savinghub/backend/api/staff/get.php?type=todaysPendingCollections`
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
    const pendingData = await pendingRes.json();
    const todaysPendingCollections = pendingData.todaysPendingCollections || [];
    let pendingCollect = todaysPendingCollections.pending_collections;
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
    document.querySelector(".pending_collection").innerHTML = pendingCollect;

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

renderCollectionsHistory()


async function fetchStaff() {
  try {
    const BASE_URL = window.location.origin;
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/staff/get.php?type=staff`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    staff = data.staff || [];
     console.log(staff.name)
    let select = document.querySelector(".agent");
    staff.forEach((staff) => {
      let option = document.createElement("option");
      option.value = staff.name;
      option.dataset.agent_id = staff.agent_id;
      option.textContent = staff.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
fetchStaff();

// async function fetchStaffSettings() {
//   try {
//     const BASE_URL = window.location.origin;
//     const response = await fetch(
//       `${BASE_URL}/savinghub/backend/api/staff/get.php?type=singleStaff`
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//      let data = await response.json();
//     singleStaff = data.singleStaff || [];
//     let staff1 = singleStaff;
//     console.log(staff1)
//     let staffName = document.querySelectorAll(".staffName");
//     staffName.forEach(item => {
//       item.textContent = staff1.name;
//     });
//     let staffPass = document.querySelector(".staffPass");
//     let staffMail = document.querySelector(".staffMail");
//     let staffId = document.querySelector(".staffId");
//     staffPass.value= staff1.password; 
//     staffId.innerHTML = staff1.agent_id;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//   }
// }

async function fetchStaffSettings() {
  try {
    const BASE_URL = window.location.origin;
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/staff/get.php?type=singleStaff`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const staff1 = (data.singleStaff && data.singleStaff[0]) || {};

    // update DOM
    document.querySelectorAll(".staffName").forEach(item => {
      item.textContent = staff1.name;
      item.value = staff1.name;
    });

    // const staffPass = document.querySelector(".staffPass");
    const staffMail = document.querySelector(".staffMail");
     const staffNewMail = document.querySelector(".staffNewMail");
    const staffId = document.querySelector(".staffId");
    const staffPhone = document.querySelector(".staffPhone")
    const staffAddress = document.querySelector(".staffAddress")
    // if (staffPass) staffPass.value = staff1.password;
    if (staffMail) staffMail.innerHTML = staff1.email;
     if (staffNewMail) staffNewMail.value = staff1.email;
    if (staffId) staffId.innerHTML = staff1.agent_id;
    if (staffPhone) staffPhone.value = staff1.phone;
    if (staffAddress) staffAddress.value = staff1.address;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

fetchStaffSettings();


// Render Active Plans Table
function renderActivePlans(userplans = []) {
  const tbody = document.getElementById("activePlansBody");
  let plans = userplans;

  tbody.innerHTML = plans
    .map((plan) => {
      // Calculate progress percentage safely
      const progress =
        plan.target_amount > 0
          ? ((plan.collected / plan.target_amount) * 100).toFixed(2)
          : 0;
      ``;
      let planStyle = "";
      if (["daily", "weekly", "monthly"].includes(plan.plan_type)) {
        planStyle =
          "background-color: lightblue; color: #000;padding: 4px 10px;  border-radius: 4px;";
      } else if (plan.plan_type === "loan") {
        planStyle =
          "background-color: red; color: #fff; padding: 4px 10px; border-radius: 4px;";
      }

      let statusClass = "";
      if (plan.status === "in progress") {
        statusClass =
          "  background-color: rgb(244, 247, 84);color: #000000ff; padding: 4px 10px;border-radius:4px; text-align: center;";
      } else if (plan.status === "completed") {
        statusClass =
          "background-color: green;color: #fff;padding: 4px 10px;border-radius: 4px;text-align: center;";
      }

      return `
        <tr>
          <td><strong>${plan.user_name}</strong></td>
          <td><span  style="${planStyle}">${plan.plan_type || "N/A"}</span></td>
          <td>${plan.target_amount}</td>
          <td>${plan.collected}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div style="font-size: 0.75rem; margin-top: 0.25rem; color: var(--muted-foreground);">
              ${progress}%
            </div>
          </td>
          <td><span style="${statusClass}">${plan.status}</span></td>
          <td>${plan.start_date}</td>
          <td>${plan.duration_months} month(s)</td>
          <td> <button class="button btn-sm btn-destructive2 closePlan" data-plan-id="${plan.user_plan_id}" data-agent-id="${plan.agent_id}" data-user-name="${plan.user_name}"> Close Plan
           </button> </td>
          
        </tr>
      `;
    })
    .join("");
}


document.addEventListener("click", async function(e) {
  if (e.target.classList.contains("closePlan")) {
    let btn = e.target.closest(".closePlan");
    const deleteId = btn.getAttribute("data-plan-id");
    const deleteAgentId = btn.getAttribute("data-agent-id");
    const deleteUserName = btn.getAttribute("data-user-name");

    // Confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to close/delete the plan for ${deleteUserName}?`
    );

    if (!confirmed) {
      return; // stop if user cancels
    }

    const deleteFormData = {
      deleteId,
      deleteAgentId,
      deleteUserName
    };

    try {
      const BASE_URL = window.location.origin;

      const res = await fetch(
        `${BASE_URL}/savinghub/backend/api/staff/delete.php`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deleteFormData)
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        showNotification(data.message, "success");

        setTimeout(() => {
          window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/staff.html`;
        }, 1500);
      } else {
        showNotification(data.message, "error");
      }
    } catch (error) {
      showNotification("Server error: " + error.message, "error");
    }
  }
});


async function fetchNotifyData() {
  try {
    const BASE_URL = window.location.origin;
    const response = await fetch(
      `${BASE_URL}/savinghub/backend/api/staff/get.php?type=notifications`
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
const notify2 = document.querySelector(".showNotify")
    notify2.addEventListener('click',function(){
fetchNotifyData();
    })


let currentPage = 1;
const rowsPerPage = 10;
let filteredD = []; 

async function renderTable(notifications ) {
  const body = document.getElementById("notify-body");
  body.innerHTML = "";
 page = currentPage;
 console.log(notifications)
 filteredD = notifications
 console.log(filteredD)
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  notifications.slice(start, end).forEach((n, index) => {
    const cleanedMessage = n.message.replace(/^Agent\s+[^\s]+\s+/, "");
    body.innerHTML += `
      <tr>
        <td>${start + index + 1}</td>
        <td>${cleanedMessage}</td>
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

