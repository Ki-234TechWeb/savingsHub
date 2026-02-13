// const BASE_URL = window.location.origin;

// function logout() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   window.location.href = `${BASE_URL}/savinghub/Frontend/dashboards/login.html`;
// }

// async function authFetch(url, options = {}) {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     logout();
//     throw new Error("No token");
//   }

//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       "Authorization": "Bearer " + token,
//       "Content-Type": "application/json"
//     }
//   });

//   if (!response.ok && response.status === 401) {
//     alert("Session expired. Logging out.");
//     logout();
//     throw new Error("Session expired");
//   }

//   return response;
// }

