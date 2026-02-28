const app = document.getElementById("app");

async function loadView(view) {
  const token = localStorage.getItem("token");

  if (!token && view !== "login") {
    return loadView("login");
  }

  let payload = null;
  if (token) {
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      localStorage.removeItem("token");
      return loadView("login");
    }
  }

  if (view.startsWith("admin") && payload?.rol !== "admin") {
    alert("Acceso denegado");
    return loadView("idiomas");
  }

  const response = await fetch(`./views/${view}.html`);
  const html = await response.text();
  app.innerHTML = html;

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

window.loadView = loadView;

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