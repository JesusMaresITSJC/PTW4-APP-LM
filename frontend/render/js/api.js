const API_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {

  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: options.body || null
  };

  const response = await fetch(
    `http://localhost:3000/api${endpoint}`,
    config
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  return response.json();
}


window.apiRequest = apiRequest;
