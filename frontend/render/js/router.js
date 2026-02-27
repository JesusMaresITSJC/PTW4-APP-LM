const app = document.getElementById("app");

async function loadView(view) {
  const token = localStorage.getItem("token");

  // 🔐 Si intenta entrar sin token
  if (!token && view !== "login") {
    return loadView("login");
  }

  // 🔎 Decodificar token si existe
  let payload = null;
  if (token) {
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      localStorage.removeItem("token");
      return loadView("login");
    }
  }

  // 🚫 Bloquear acceso a admin si no es admin
  if (view.startsWith("admin") && payload?.rol !== "admin") {
    alert("Acceso denegado");
    return loadView("idiomas");
  }

  // 📥 Cargar vista
  const response = await fetch(`./views/${view}.html`);
  const html = await response.text();
  app.innerHTML = html;

  // 🚀 Inicializar vista
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

    case "adminIdiomas":
      initAdminIdiomas();
      break;
  }
}

window.loadView = loadView;

// 🔄 Vista inicial automática según rol
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    loadView("login");
  } else {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.rol === "admin") {
      loadView("adminDashboard");
    } else {
      loadView("idiomas");
    }
  }
});