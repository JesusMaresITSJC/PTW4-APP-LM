const API_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: options.body || null
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  // Solo parsear JSON si hay contenido
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("No se pudo parsear JSON:", text);
    throw new Error("Respuesta inválida del servidor");
  }

  if (!response.ok) {
    throw new Error(data?.mensaje || `Error ${response.status}`);
  }

  return data;
}

window.apiRequest = apiRequest;