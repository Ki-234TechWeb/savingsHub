// navbtn
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

const activePlans = [
  {
    id: 1,
    user: "Chioma Nwosu",
    type: "Weekly",
    target: "₦50,000",
    collected: "₦32,500",
    progress: 65,
    start: "2025-09-01",
    end: "2025-12-31",
  },
  {
    id: 2,
    user: "Tunde Adesanya",
    type: "Monthly",
    target: "₦100,000",
    collected: "₦75,000",
    progress: 75,
    start: "2025-08-01",
    end: "2025-12-31",
  },
  {
    id: 3,
    user: "Grace Eze",
    type: "Daily",
    target: "₦30,000",
    collected: "₦28,500",
    progress: 95,
    start: "2025-10-01",
    end: "2025-12-31",
  },
];


// Tab Navigation
function showTab(tabName, event) {
  if (event) event.preventDefault();

  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((item) => item.classList.remove("active"));

  const tab = document.getElementById(tabName);
  if (tab) {
    tab.classList.add("active");
    event.target.classList.add("active");
  }
}

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// Filter Functions
function filterPortfolioUsers() {
  renderPortfolioUsers(portfolioUsers);
}

// Action Functions
function viewUserDetails(userId) {
  const user = portfolioUsers.find((u) => u.id === userId);
  if (user) {
    showNotification(`Viewing details for ${user.name}`, "info");
  }
}

function editCollection(collectionId) {
  const collection = collectionsHistory.find((c) => c.id === collectionId);
  if (collection) {
    showNotification(`Editing collection for ${collection.user}`, "info");
  }
}

function editPlan(planId) {
  const plan = activePlans.find((p) => p.id === planId);
  if (plan) {
    showNotification(`Editing plan for ${plan.user}`, "info");
  }
}

function refreshPortfolio() {
  showNotification("Portfolio refreshed successfully", "success");
  
}

// function handleCreateUser(event) {
//   event.preventDefault();
//   showNotification("New user created successfully", "success");
//   event.target.reset();
// }

// function handleRecordCollection(event) {
//   event.preventDefault();
//   showNotification("Collection recorded successfully", "success");
//   closeModal("recordCollectionModal");
//   event.target.reset();
// }

// function handleSetupPlan(event) {
//   event.preventDefault();
//   showNotification("Plan setup successfully for user", "success");
//   closeModal("setupPlanModal");
//   event.target.reset();
// }

// Notification System
function showNotification(message, type = "info") {
  const container = document.getElementById("notificationsContainer");
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
                ${message}
                <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
            `;
  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Chart Initialization
function initializeCharts() {
  const collectionCtx = document.getElementById("collectionTrendChart");
  if (collectionCtx) {
    new Chart(collectionCtx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Weekly Collections",
            data: [15000, 18000, 12500, 22000, 25000, 20000, 10000],
            borderColor: "oklch(0.45 0.15 260)",
            backgroundColor: "oklch(0.45 0.15 260 / 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: true } } },
    });
  }

  const onboardingCtx = document.getElementById("onboardingChart");
  if (onboardingCtx) {
    new Chart(onboardingCtx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Users Onboarded",
            data: [25, 32, 28, 35, 40, 45],
            backgroundColor: "oklch(0.45 0.15 260)",
          },
        ],
      },
      options: { responsive: true },
    });
  }

  const successCtx = document.getElementById("successRateChart");
  if (successCtx) {
    new Chart(successCtx, {
      type: "doughnut",
      data: {
        labels: ["Successful", "Pending", "Failed"],
        datasets: [
          {
            data: [92.5, 5, 2.5],
            backgroundColor: [
              "oklch(0.65 0.15 140)",
              "oklch(0.75 0.12 50)",
              "oklch(0.577 0.245 27.325)",
            ],
          },
        ],
      },
      options: { responsive: true },
    });
  }

  const earningsCtx = document.getElementById("earningsChart");
  if (earningsCtx) {
    new Chart(earningsCtx, {
      type: "bar",
      data: {
        labels: ["Onboarding", "Collections", "Referrals", "Bonuses"],
        datasets: [
          {
            label: "Earnings (₦)",
            data: [45000, 65000, 12000, 8450],
            backgroundColor: [
              "oklch(0.45 0.15 260)",
              "oklch(0.65 0.12 180)",
              "oklch(0.65 0.15 140)",
              "oklch(0.75 0.12 50)",
            ],
          },
        ],
      },
      options: { responsive: true, indexAxis: "y" },
    });
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeDashboard);

// Close modals when clicking outside
window.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("active");
  }
});
