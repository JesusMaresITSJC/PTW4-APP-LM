const API_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_URL + endpoint, options);
  return response.json();
}

window.apiRequest = apiRequest;
