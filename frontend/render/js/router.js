const app = document.getElementById("app");

async function loadView(view) {
  const token = localStorage.getItem("token");

  if (!token && view !== "login") return loadView("login");

  let perfil = null;

  if (token) {
    try {
      // Llamamos al backend para obtener perfil real
      perfil = await fetch("http://localhost:3000/api/usuarios/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());

      if (!perfil || perfil.mensaje) {
        localStorage.removeItem("token");
        return loadView("login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      return loadView("login");
    }
  }

  // Validación de roles
  if (view.startsWith("admin") && perfil?.rol !== "admin") {
    alert("Acceso denegado");
    return loadView("idiomas");
  }

  // Cargar HTML
  const response = await fetch(`./views/${view}.html`);
  const html = await response.text();
  app.innerHTML = html;

  // Inicializar scripts de cada vista
  switch (view) {
    case "login":
      initLogin();
      break;
    case "idiomas":
      initIdiomas();
      break;
    case "adminDashboard":
      initAdminDashboard();
      break;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    loadView("login");
  } else {
    // Obtener perfil real desde backend
    try {
      const perfil = await fetch("http://localhost:3000/api/usuarios/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());

      if (!perfil || perfil.mensaje) {
        localStorage.removeItem("token");
        return loadView("login");
      }

      if (perfil.rol === "admin") loadView("adminDashboard");
      else loadView("idiomas");

    } catch (err) {
      localStorage.removeItem("token");
      loadView("login");
    }
  }
});