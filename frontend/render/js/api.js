const API_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    // Configuración base
    const config = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
        }
    };

    // Solo agregamos body si existe y no es GET
    if (options.body && config.method !== "GET") {
        // Asegurarnos que sea string JSON
        config.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        // Parseamos el texto solo si hay contenido
        const text = await response.text();
        let data = text ? JSON.parse(text) : null;

        // Si la respuesta no es OK, lanzamos un error con mensaje del backend
        if (!response.ok) {
            throw new Error(data?.mensaje || `Error ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("Error en apiRequest:", error);
        throw error; // lo propagamos al frontend
    }
}

// Hacemos global la función
window.apiRequest = apiRequest;